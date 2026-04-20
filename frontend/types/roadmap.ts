/**
 * Types for the Adaptive Roadmap & Mastery System.
 */

export interface TopicMastery {
    topic_name: string;
    mastery_score: number;
    problems_solved: number;
    total_attempts: number;
    last_practiced: string;
    level?: string; // Novice | Apprentice | Proficient | Expert | Master
}

export interface RoadmapBadge {
    badge_key: string;
    badge_label: string;
    awarded_at: string;
}

export interface DailySuggestion {
    problemId: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    reason: string;
    solved?: boolean;
    isDailyChallenge?: boolean;
}

export interface StreakData {
    current: number;
    longest: number;
    todayActive: boolean;
}

export interface ComparativeInsight {
    topic_name: string;
    speed_percentile: number;
    user_avg_ms: number;
}

export interface MasteryTier {
    level: string;
    color: string;
    glowColor: string;
}

export interface MasteryHistoryPoint {
    topic_name: string;
    mastery_score: number;
    recorded_at: string;
}

export interface RoadmapData {
    themeOfWeek: string;
    coachInsight: string;
    dailySuggestions: DailySuggestion[];
    nextWeekPreview: string[];
    weeklyGoalSummary: string;
    topicMastery: TopicMastery[];
    badges: RoadmapBadge[];
    streak: StreakData;
    comparativeInsights: ComparativeInsight[];
    overallMastery: number;
    masteryTier: MasteryTier;
    masteryHistory: MasteryHistoryPoint[];
}
