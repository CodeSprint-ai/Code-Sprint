// Profile types for frontend

export interface SocialLinks {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
}

export interface PublicUserStats {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    submissionSuccessRate: number;
    currentStreak: number;
    maxStreak: number;
    rating: number;
    rank?: number;
}

export interface RecentBadge {
    name: string;
    icon: string;
    tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
    unlockedAt: string;
}

export interface PublicProfile {
    username: string;
    name: string;
    avatarUrl?: string;
    bio?: string;
    country?: string;
    socialLinks: SocialLinks;
    level: string;
    stats: PublicUserStats;
    recentBadges: RecentBadge[];
    joinedAt: string;
}

export interface UserPreferences {
    theme: 'LIGHT' | 'DARK' | 'SYSTEM';
    defaultLanguage: 'java' | 'python' | 'cpp';
    emailNotifications: boolean;
    marketingEmails: boolean;
    showActivityStatus: boolean;
}

export interface PrivateStats {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    totalSubmissions: number;
    acceptedSubmissions: number;
    currentStreak: number;
    maxStreak: number;
    contestsParticipated: number;
    rating: number;
}

export interface PrivateProfile extends Omit<PublicProfile, 'stats'> {
    uuid: string;
    email: string;
    role: string;
    isVerified: boolean;
    stats: PrivateStats;
    preferences: UserPreferences;
}

// Stats types for charts
export interface DifficultyDistribution {
    easy: { solved: number; total: number };
    medium: { solved: number; total: number };
    hard: { solved: number; total: number };
}

export interface LanguageUsage {
    [language: string]: number;
}

export interface SubmissionHeatmapEntry {
    date: string;
    count: number;
}

export interface SolvedOverTimeEntry {
    month: string;
    cumulative: number;
}

export interface UserStats {
    difficultyDistribution: DifficultyDistribution;
    languageUsage: LanguageUsage;
    submissionHeatmap: SubmissionHeatmapEntry[];
    solvedOverTime: SolvedOverTimeEntry[];
    totalSubmissions: number;
    acceptedSubmissions: number;
    submissionSuccessRate: number;
}

export interface Badge {
    uuid: string;
    name: string;
    description: string;
    icon: string;
    tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
    unlockedAt?: string;
}

export interface SavedProblem {
    uuid: string;
    problemUuid: string;
    problemTitle: string;
    problemSlug: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    notes?: string;
    savedAt: string;
}
