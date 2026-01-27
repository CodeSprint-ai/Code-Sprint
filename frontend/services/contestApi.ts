import api from './api';
import { Contest, ContestFilters, ContestsApiResponse, ContestTab } from '../types/contest';

const CONTESTS_BASE_URL = '/api/contests';

export interface ContestQueryParams {
    tab?: ContestTab;
    platforms?: string;
    limit?: number;
    from?: string;
    to?: string;
    search?: string;
    format?: 'json' | 'atom' | 'rss';
    orderBy?: string;
}

export async function fetchContests(params: ContestQueryParams = {}): Promise<ContestsApiResponse> {
    try {
        const response = await api.get<ContestsApiResponse>(CONTESTS_BASE_URL, { params });
        return response.data;
    } catch (error: any) {
        // Handle rate limit
        if (error.response?.status === 429) {
            const retryAfter = error.response?.data?.retryAfter || 60;
            return {
                success: false,
                data: [],
                meta: { total: 0, cached: false, source: 'error' },
                error: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
            };
        }

        // Handle service unavailable
        if (error.response?.status === 503) {
            return {
                success: false,
                data: [],
                meta: { total: 0, cached: false, source: 'error' },
                error: 'Contest data temporarily unavailable. Please try again later.',
            };
        }

        // Generic error
        return {
            success: false,
            data: [],
            meta: { total: 0, cached: false, source: 'error' },
            error: error.message || 'Failed to fetch contests',
        };
    }
}

export function filtersToParams(filters: ContestFilters): ContestQueryParams {
    return {
        tab: filters.tab,
        platforms: filters.platforms?.join(','),
        limit: filters.limit,
        from: filters.from,
        to: filters.to,
        search: filters.search,
        orderBy: filters.orderBy,
    };
}

// ICS file generation for "Add to Calendar"
export function generateICSFile(contest: Contest): string {
    const formatDate = (date: string) => {
        return new Date(date).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Code-Sprint//Contest Aggregator//EN
BEGIN:VEVENT
UID:${contest.id}@codesprint.local
DTSTAMP:${formatDate(new Date().toISOString())}
DTSTART:${formatDate(contest.start)}
DTEND:${formatDate(contest.end)}
SUMMARY:${contest.event}
DESCRIPTION:${contest.event} on ${contest.platform.name}
URL:${contest.href}
LOCATION:${contest.href}
END:VEVENT
END:VCALENDAR`;

    return ics;
}

export function downloadICSFile(contest: Contest): void {
    const ics = generateICSFile(contest);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${contest.event.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function getGoogleCalendarUrl(contest: Contest): string {
    const formatDate = (date: string) => {
        return new Date(date).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: contest.event,
        dates: `${formatDate(contest.start)}/${formatDate(contest.end)}`,
        details: `${contest.event} on ${contest.platform.name}\n\nLink: ${contest.href}`,
        location: contest.href,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
