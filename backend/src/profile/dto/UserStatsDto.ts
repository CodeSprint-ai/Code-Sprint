export interface DifficultyDistribution {
    easy: { solved: number; total: number };
    medium: { solved: number; total: number };
    hard: { solved: number; total: number };
}

export interface LanguageUsage {
    [language: string]: number; // percentage
}

export interface SubmissionHeatmapEntry {
    date: string; // YYYY-MM-DD
    count: number;
}

export interface SolvedOverTimeEntry {
    month: string; // YYYY-MM
    cumulative: number;
}

export class UserStatsDto {
    difficultyDistribution: DifficultyDistribution;
    languageUsage: LanguageUsage;
    submissionHeatmap: SubmissionHeatmapEntry[];
    solvedOverTime: SolvedOverTimeEntry[];
    totalSubmissions: number;
    acceptedSubmissions: number;
    submissionSuccessRate: number;

    static create(
        difficultyDistribution: DifficultyDistribution,
        languageUsage: LanguageUsage,
        submissionHeatmap: SubmissionHeatmapEntry[],
        solvedOverTime: SolvedOverTimeEntry[],
        totalSubmissions: number,
        acceptedSubmissions: number,
    ): UserStatsDto {
        return {
            difficultyDistribution,
            languageUsage,
            submissionHeatmap,
            solvedOverTime,
            totalSubmissions,
            acceptedSubmissions,
            submissionSuccessRate: totalSubmissions > 0
                ? Math.round((acceptedSubmissions / totalSubmissions) * 1000) / 10
                : 0,
        };
    }
}
