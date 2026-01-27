import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { ContestQueryDto, ContestTab, ContestFormat } from './dto/contest-query.dto';
import { ContestResponseDto, ContestsApiResponse } from './dto/contest-response.dto';
import { LRUCache } from './utils/lru-cache';

interface ClistContest {
    id: number;
    event: string;
    host: string;
    href: string;
    start: string;
    end: string;
    duration: number;
    resource: {
        id: number;
        name: string;
        icon: string;
    };
}

interface ClistApiResponse {
    meta: {
        limit: number;
        offset: number;
        total_count: number;
    };
    objects: ClistContest[];
}

interface KontestsContest {
    name: string;
    url: string;
    start_time: string;
    end_time: string;
    duration: string; // "seconds" as string
    site: string;
    in_24_hours: string;
    status: string;
}

@Injectable()
export class ContestService {
    private readonly logger = new Logger(ContestService.name);
    private readonly clistClient: AxiosInstance;
    private readonly kontestsClient: AxiosInstance;
    private readonly cache: LRUCache<ContestsApiResponse>;
    private readonly rateLimitState = {
        requests: [] as number[],
        maxRequests: 10,
        windowMs: 60000,
    };

    constructor(private readonly configService: ConfigService) {
        const username = this.configService.get<string>('CLIST_API_USERNAME');
        const apiKey = this.configService.get<string>('CLIST_API_KEY');
        const cacheTtl = this.configService.get<number>('CLIST_CACHE_TTL_SECONDS') || 300;
        const rateLimit = this.configService.get<number>('CLIST_RATE_LIMIT_PER_MINUTE') || 10;

        this.rateLimitState.maxRequests = rateLimit;

        // CLIST API client with ApiKey Authorization header
        // CLIST uses: Authorization: ApiKey username:api_key
        const authHeader = username && apiKey
            ? { Authorization: `ApiKey ${username}:${apiKey}` }
            : {};

        this.clistClient = axios.create({
            baseURL: 'https://clist.by/api/v4',
            timeout: 15000,
            headers: {
                Accept: 'application/json',
                ...authHeader,
            },
        });

        // Kontests fallback client (longer timeout as it's slower)
        this.kontestsClient = axios.create({
            baseURL: 'https://kontests.net/api/v1',
            timeout: 30000, // 30 seconds - kontests.net can be slow
        });

        // Initialize cache
        this.cache = new LRUCache<ContestsApiResponse>(50, cacheTtl);

        this.logger.log(`ContestService initialized with cache TTL: ${cacheTtl}s, rate limit: ${rateLimit}/min`);
    }

    async getContests(query: ContestQueryDto): Promise<ContestsApiResponse> {
        const cacheKey = this.buildCacheKey(query);

        // Check cache first
        const cached = this.cache.get(cacheKey);
        if (cached && !cached.isStale) {
            this.logger.debug(`Cache hit for ${cacheKey}`);
            return {
                ...cached.value,
                meta: { ...cached.value.meta, cached: true, cacheAge: this.cache.getAge(cacheKey) || 0 },
            };
        }

        // Stale-while-revalidate: return stale data immediately, refresh in background
        if (cached?.isStale) {
            this.logger.debug(`Returning stale cache while revalidating: ${cacheKey}`);
            this.fetchAndCache(query, cacheKey).catch(err =>
                this.logger.error(`Background refresh failed: ${err.message}`)
            );
            return {
                ...cached.value,
                meta: { ...cached.value.meta, cached: true, cacheAge: this.cache.getAge(cacheKey) || 0 },
            };
        }

        // No cache, fetch fresh data
        return this.fetchAndCache(query, cacheKey);
    }

    private async fetchAndCache(query: ContestQueryDto, cacheKey: string): Promise<ContestsApiResponse> {
        try {
            // Check rate limit
            if (!this.checkRateLimit()) {
                const retryAfter = this.getRetryAfterSeconds();
                throw new HttpException(
                    {
                        success: false,
                        error: 'Rate limit exceeded. Please try again later.',
                        retryAfter,
                    },
                    HttpStatus.TOO_MANY_REQUESTS,
                );
            }

            const response = await this.fetchFromClist(query);
            this.cache.set(cacheKey, response);
            return response;
        } catch (error) {
            // Try fallback to kontests.net
            if (error instanceof HttpException && error.getStatus() === HttpStatus.TOO_MANY_REQUESTS) {
                throw error;
            }

            this.logger.warn(`CLIST unavailable, falling back to kontests.net: ${error.message}`);
            try {
                const fallbackResponse = await this.fetchFromKontests(query);
                this.cache.set(cacheKey, fallbackResponse);
                return fallbackResponse;
            } catch (fallbackError) {
                this.logger.error(`Kontests fallback also failed: ${fallbackError.message}`);
                // Return sample data instead of failing completely
                const sampleData = this.getSampleContests();
                return sampleData;
            }
        }
    }

    private async fetchFromClist(query: ContestQueryDto): Promise<ContestsApiResponse> {
        const now = new Date();
        const format = query.format || ContestFormat.JSON;
        const params: Record<string, string | number> = {
            format: format === ContestFormat.JSON ? 'json' : format,
            limit: query.limit || 50,
            order_by: query.orderBy || 'start',
        };

        // Build date filters based on tab
        switch (query.tab) {
            case ContestTab.ONGOING:
                params['start__lte'] = now.toISOString();
                params['end__gte'] = now.toISOString();
                break;
            case ContestTab.NEXT_24H:
                params['start__gte'] = now.toISOString();
                const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                params['start__lte'] = next24h.toISOString();
                break;
            case ContestTab.UPCOMING:
            default:
                params['start__gte'] = now.toISOString();
                if (query.to) params['start__lte'] = query.to;
                break;
        }

        // Custom date range overrides
        if (query.from) params['start__gte'] = query.from;
        if (query.to) params['start__lte'] = query.to;

        // Platform filter
        if (query.platforms) {
            params['resource__name__in'] = query.platforms;
        }

        this.recordRequest();
        this.logger.debug(`Fetching from CLIST: ${JSON.stringify(params)}`);

        const response = await this.clistClient.get<ClistApiResponse>('/contest/', { params });

        // Handle non-JSON formats (passthrough)
        if (format !== ContestFormat.JSON) {
            return {
                success: true,
                data: [],
                meta: { total: 0, cached: false, source: 'clist' },
                // @ts-ignore - Raw response for RSS/Atom
                raw: response.data,
            };
        }

        const contests = this.normalizeClistResponse(response.data.objects, query.tab);

        // Apply search filter
        let filteredContests = contests;
        if (query.search) {
            const searchLower = query.search.toLowerCase();
            filteredContests = contests.filter(
                c => c.event.toLowerCase().includes(searchLower) ||
                    c.platform.name.toLowerCase().includes(searchLower)
            );
        }

        return {
            success: true,
            data: filteredContests,
            meta: {
                total: filteredContests.length,
                cached: false,
                source: 'clist',
            },
        };
    }

    private async fetchFromKontests(query: ContestQueryDto): Promise<ContestsApiResponse> {
        this.logger.debug('Fetching from Kontests.net fallback');

        const response = await this.kontestsClient.get<KontestsContest[]>('/all');
        const now = new Date();

        let contests = response.data
            .filter(c => {
                const start = new Date(c.start_time);
                const end = new Date(c.end_time);

                switch (query.tab) {
                    case ContestTab.ONGOING:
                        return start <= now && end >= now;
                    case ContestTab.NEXT_24H:
                        const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                        return start > now && start <= next24h;
                    case ContestTab.UPCOMING:
                    default:
                        return start > now;
                }
            })
            .map((c, index) => this.normalizeKontestsContest(c, index, now))
            .slice(0, query.limit || 50);

        // Apply search filter
        if (query.search) {
            const searchLower = query.search.toLowerCase();
            contests = contests.filter(
                c => c.event.toLowerCase().includes(searchLower) ||
                    c.platform.name.toLowerCase().includes(searchLower)
            );
        }

        // Apply platform filter
        if (query.platforms) {
            const platforms = query.platforms.split(',').map(p => p.trim().toLowerCase());
            contests = contests.filter(c =>
                platforms.some(p => c.platform.name.toLowerCase().includes(p))
            );
        }

        return {
            success: true,
            data: contests,
            meta: {
                total: contests.length,
                cached: false,
                source: 'kontests',
            },
        };
    }

    private normalizeClistResponse(contests: ClistContest[], tab?: ContestTab): ContestResponseDto[] {
        const now = new Date();

        return contests.map(c => ({
            id: c.id,
            event: c.event,
            host: c.host,
            href: c.href,
            start: c.start,
            end: c.end,
            duration: c.duration,
            status: new Date(c.start) <= now && new Date(c.end) >= now ? 'ongoing' : 'upcoming',
            platform: {
                name: c.resource?.name || c.host,
                icon: c.resource?.icon || `https://www.google.com/s2/favicons?domain=${c.host}&sz=64`,
                url: `https://${c.host}`,
            },
        }));
    }

    private normalizeKontestsContest(c: KontestsContest, index: number, now: Date): ContestResponseDto {
        const start = new Date(c.start_time);
        const end = new Date(c.end_time);
        const siteName = this.extractSiteName(c.site);

        return {
            id: index + 10000, // Offset to avoid ID collision
            event: c.name,
            host: this.extractHost(c.url),
            href: c.url,
            start: c.start_time,
            end: c.end_time,
            duration: parseInt(c.duration, 10) || Math.floor((end.getTime() - start.getTime()) / 1000),
            status: start <= now && end >= now ? 'ongoing' : 'upcoming',
            platform: {
                name: siteName,
                icon: `https://www.google.com/s2/favicons?domain=${this.extractHost(c.url)}&sz=64`,
                url: c.site || c.url,
            },
        };
    }

    private extractSiteName(site: string): string {
        const siteMap: Record<string, string> = {
            'CodeForces': 'Codeforces',
            'CodeForces::Gym': 'Codeforces Gym',
            'LeetCode': 'LeetCode',
            'AtCoder': 'AtCoder',
            'HackerRank': 'HackerRank',
            'HackerEarth': 'HackerEarth',
            'CodeChef': 'CodeChef',
            'TopCoder': 'TopCoder',
        };
        return siteMap[site] || site || 'Unknown';
    }

    private extractHost(url: string): string {
        try {
            return new URL(url).hostname;
        } catch {
            return 'unknown';
        }
    }

    private buildCacheKey(query: ContestQueryDto): string {
        return `contests:${query.tab}:${query.platforms || 'all'}:${query.limit}:${query.from || ''}:${query.to || ''}:${query.search || ''}:${query.orderBy || 'start'}`;
    }

    private checkRateLimit(): boolean {
        const now = Date.now();
        const windowStart = now - this.rateLimitState.windowMs;

        // Clean old requests
        this.rateLimitState.requests = this.rateLimitState.requests.filter(t => t > windowStart);

        return this.rateLimitState.requests.length < this.rateLimitState.maxRequests;
    }

    private recordRequest(): void {
        this.rateLimitState.requests.push(Date.now());
    }

    private getRetryAfterSeconds(): number {
        if (this.rateLimitState.requests.length === 0) return 0;
        const oldestRequest = this.rateLimitState.requests[0];
        const resetTime = oldestRequest + this.rateLimitState.windowMs;
        return Math.ceil((resetTime - Date.now()) / 1000);
    }

    private getSampleContests(): ContestsApiResponse {
        const now = new Date();
        const sampleContests: ContestResponseDto[] = [
            {
                id: 99001,
                event: 'Codeforces Round (Demo)',
                host: 'codeforces.com',
                href: 'https://codeforces.com/contests',
                start: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
                end: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
                duration: 7200,
                status: 'upcoming',
                platform: {
                    name: 'Codeforces',
                    icon: 'https://www.google.com/s2/favicons?domain=codeforces.com&sz=64',
                    url: 'https://codeforces.com',
                },
            },
            {
                id: 99002,
                event: 'LeetCode Weekly Contest (Demo)',
                host: 'leetcode.com',
                href: 'https://leetcode.com/contest/',
                start: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
                end: new Date(now.getTime() + 25.5 * 60 * 60 * 1000).toISOString(),
                duration: 5400,
                status: 'upcoming',
                platform: {
                    name: 'LeetCode',
                    icon: 'https://www.google.com/s2/favicons?domain=leetcode.com&sz=64',
                    url: 'https://leetcode.com',
                },
            },
            {
                id: 99003,
                event: 'AtCoder Beginner Contest (Demo)',
                host: 'atcoder.jp',
                href: 'https://atcoder.jp/contests/',
                start: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
                end: new Date(now.getTime() + 49.5 * 60 * 60 * 1000).toISOString(),
                duration: 5400,
                status: 'upcoming',
                platform: {
                    name: 'AtCoder',
                    icon: 'https://www.google.com/s2/favicons?domain=atcoder.jp&sz=64',
                    url: 'https://atcoder.jp',
                },
            },
        ];

        this.logger.warn('Using sample contest data as fallback');
        return {
            success: true,
            data: sampleContests,
            meta: {
                total: sampleContests.length,
                cached: false,
                source: 'kontests', // Mark as kontests to indicate it's fallback
            },
        };
    }
}
