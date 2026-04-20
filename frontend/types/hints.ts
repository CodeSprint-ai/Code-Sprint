export interface Hint {
    uuid: string;
    level: number;
    content: string;
}

export interface HintUsageResponse {
    levelReached: number;
    scorePenalty: number;
    hintsUsedAt: Array<{ level: number; timestamp: string }>;
    hintsRemaining: number;
    hints?: Hint[];
}

export interface NextHintResponse {
    hintUuid: string;
    level: number;
    content: string;
    totalPenalty: number;
    hintsRemaining: number;
}

export interface HintFeedbackResponse {
    success: boolean;
}
