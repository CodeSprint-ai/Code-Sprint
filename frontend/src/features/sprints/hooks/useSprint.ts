import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export interface SprintProblem {
    order: number;
    maxScore: number;
    problem: any; // Using any for now to match ProblemDto structure broadly
}

export interface SprintSession {
    uuid: string;
    userId: string;
    startTime: Date;
    endTime: Date;
    status: "ACTIVE" | "COMPLETED" | "PENDING" | "ABANDONED";
    score: number;
    sprintProblems: SprintProblem[];
}

export interface SprintSolution {
    problemId: string;
    code: string;
    language: string;
}

export interface SprintCompletionResult {
    pointsEarned: number;
    totalPoints: number;
    newLevel: string | null;
    newBadges: {
        uuid: string;
        name: string;
        description: string;
        tier: string;
        unlockedAt?: string;
    }[];
    updatedStreak: number;
    correctAnswers: number;
    totalQuestions: number;
    difficultyBreakdown: { easy: number; medium: number; hard: number };
    sprintId: string;
}

export const useSprint = () => {
    const queryClient = useQueryClient();

    const createSprintMutation = useMutation<SprintSession, Error, { userId: string }>({
        mutationFn: async ({ userId }) => {
            const response = await api.post<SprintSession>("/sprint", {});
            // @ts-ignore wrapper handling
            return response.data.data ? response.data.data : response.data;
        },
    });

    const finishSprintMutation = useMutation<
        SprintCompletionResult,
        Error,
        { sprintId: string; solutions: SprintSolution[] }
    >({
        mutationFn: async ({ sprintId, solutions }) => {
            const response = await api.post<SprintCompletionResult>(
                `/sprint/${sprintId}/finish`,
                { solutions }
            );
            // @ts-ignore wrapper handling
            return response.data.data ? response.data.data : response.data;
        },
        onSuccess: () => {
            // Invalidate all profile/gamification caches so dashboard reflects new data
            queryClient.invalidateQueries({ queryKey: ['my-profile'] });
            queryClient.invalidateQueries({ queryKey: ['my-stats'] });
            queryClient.invalidateQueries({ queryKey: ['my-badges'] });
        },
    });

    return {
        createSprint: createSprintMutation.mutateAsync,
        isCreating: createSprintMutation.isPending,
        finishSprint: finishSprintMutation.mutateAsync,
        isFinishing: finishSprintMutation.isPending,
    };
};
