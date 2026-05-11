import api from './api';
import { Submission, PaginatedSubmissionsResponse } from '@/types/submission';
import { PrivateProfile, UserStats } from '@/types/profile';
import { ApiResponse } from '@/types/common';

// ============== Dashboard Types ==============

export interface DashboardStats {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    currentStreak: number;
    maxStreak: number;
    totalSubmissions: number;
    acceptedSubmissions: number;
    rating: number;
}

export interface WeeklyActivityEntry {
    day: string;
    problems: number;
}

export interface RecentSubmission {
    title: string;
    status: 'Passed' | 'Failed';
    lang: string;
    problemUuid?: string;
}

// ============== Dashboard API Functions ==============

/**
 * Get dashboard stats from profile
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
    try {
        const { data } = await api.get<ApiResponse<PrivateProfile>>('/profile/me');
        const profile = data.data;

        return {
            totalSolved: profile.stats?.totalSolved ?? 0,
            easySolved: profile.stats?.easySolved ?? 0,
            mediumSolved: profile.stats?.mediumSolved ?? 0,
            hardSolved: profile.stats?.hardSolved ?? 0,
            currentStreak: profile.stats?.currentStreak ?? 0,
            maxStreak: profile.stats?.maxStreak ?? 0,
            totalSubmissions: profile.stats?.totalSubmissions ?? 0,
            acceptedSubmissions: profile.stats?.acceptedSubmissions ?? 0,
            rating: profile.stats?.rating ?? 0,
        };
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        return {
            totalSolved: 0,
            easySolved: 0,
            mediumSolved: 0,
            hardSolved: 0,
            currentStreak: 0,
            maxStreak: 0,
            totalSubmissions: 0,
            acceptedSubmissions: 0,
            rating: 0,
        };
    }
};

/**
 * Get recent submissions for activity display
 */
export const getRecentSubmissions = async (limit: number = 5): Promise<RecentSubmission[]> => {
    try {
        const { data } = await api.get<PaginatedSubmissionsResponse>(`/submission?pageSize=${limit}&page=1`);

        return data.data.map((sub: Submission) => ({
            title: sub.problemTitle || 'Unknown Problem',
            status: sub.status === 'ACCEPTED' ? 'Passed' as const : 'Failed' as const,
            lang: getLanguageShort(sub.language),
            problemUuid: sub.problemId,
        }));
    } catch (error) {
        console.error('Failed to fetch recent submissions:', error);
        return [];
    }
};

/**
 * Calculate weekly activity from submissions
 */
export const getWeeklyActivity = async (): Promise<{ data: WeeklyActivityEntry[]; total: number; percentChange: number }> => {
    try {
        // Get submissions from past 14 days to calculate percent change
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        const { data } = await api.get<PaginatedSubmissionsResponse>(
            `/submission?pageSize=100&fromDate=${twoWeeksAgo.toISOString().split('T')[0]}&status=ACCEPTED`
        );

        const submissions = data.data || [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();

        // Initialize weekly data
        const weeklyData: WeeklyActivityEntry[] = [];
        let thisWeekTotal = 0;
        let lastWeekTotal = 0;

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const count = submissions.filter((sub: Submission) => {
                const subDate = new Date(sub.createdAt);
                return subDate >= date && subDate < nextDate;
            }).length;

            weeklyData.push({
                day: days[date.getDay()],
                problems: count,
            });

            thisWeekTotal += count;
        }

        // Calculate last week's total for percent change
        for (let i = 13; i >= 7; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            lastWeekTotal += submissions.filter((sub: Submission) => {
                const subDate = new Date(sub.createdAt);
                return subDate >= date && subDate < nextDate;
            }).length;
        }

        const percentChange = lastWeekTotal > 0
            ? Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100)
            : thisWeekTotal > 0 ? 100 : 0;

        return {
            data: weeklyData,
            total: thisWeekTotal,
            percentChange,
        };
    } catch (error) {
        console.error('Failed to fetch weekly activity:', error);
        return {
            data: [
                { day: 'Mon', problems: 0 },
                { day: 'Tue', problems: 0 },
                { day: 'Wed', problems: 0 },
                { day: 'Thu', problems: 0 },
                { day: 'Fri', problems: 0 },
                { day: 'Sat', problems: 0 },
                { day: 'Sun', problems: 0 },
            ],
            total: 0,
            percentChange: 0,
        };
    }
};

/**
 * Helper to get short language name
 */
function getLanguageShort(language: string): string {
    const langMap: Record<string, string> = {
        'python': 'Py',
        'python3': 'Py',
        'javascript': 'JS',
        'typescript': 'TS',
        'java': 'Java',
        'cpp': 'C++',
        'c': 'C',
        'go': 'Go',
        'rust': 'Rust',
    };
    return langMap[language?.toLowerCase()] || language?.toUpperCase()?.slice(0, 2) || '??';
}

export const dashboardApi = {
    getDashboardStats,
    getRecentSubmissions,
    getWeeklyActivity,
};

export default dashboardApi;
