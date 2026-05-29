export type ContestTab = 'ongoing' | 'upcoming' | 'next24h';
export type ContestFormat = 'json' | 'atom' | 'rss';
export type ContestStatus = 'ongoing' | 'upcoming';

export interface ContestPlatform {
    name: string;
    icon: string;
    url: string;
}

export interface Contest {
    id: number;
    event: string;
    host: string;
    href: string;
    start: string;
    end: string;
    duration: number; // seconds
    status: ContestStatus;
    platform: ContestPlatform;
}

export interface ContestsMeta {
    total: number;
    cached: boolean;
    cacheAge?: number;
    source: 'clist' | 'kontests' | 'cache' | 'error';
}

export interface ContestsApiResponse {
    success: boolean;
    data: Contest[];
    meta: ContestsMeta;
    error?: string;
}

export interface ContestFilters {
    tab: ContestTab;
    platforms?: string[];
    search?: string;
    limit?: number;
    from?: string;
    to?: string;
    orderBy?: 'start' | 'duration' | '-start' | '-duration';
}

export const POPULAR_PLATFORMS = [
    { id: 'codeforces.com', name: 'Codeforces', color: '#1890ff' },
    { id: 'leetcode.com', name: 'LeetCode', color: '#ffa116' },
    { id: 'atcoder.jp', name: 'AtCoder', color: '#222222' },
    { id: 'codechef.com', name: 'CodeChef', color: '#5b4638' },
    { id: 'hackerrank.com', name: 'HackerRank', color: '#00ea64' },
    { id: 'hackerearth.com', name: 'HackerEarth', color: '#2c3454' },
    { id: 'topcoder.com', name: 'TopCoder', color: '#4d94ff' },
    { id: 'kaggle.com', name: 'Kaggle', color: '#20beff' },
] as const;

export type PlatformId = (typeof POPULAR_PLATFORMS)[number]['id'];
