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
    status: "ACTIVE" | "COMPLETED" | "PENDING";
    score: number;
    sprintProblems: SprintProblem[];
}

export const useSprint = () => {
    const queryClient = useQueryClient();

    const createSprintMutation = useMutation<SprintSession, Error, { userId: string }>({
        mutationFn: async ({ userId }) => {
            // userId is implied by auth token usually, but matching backend command structure if needed
            // Actually controller took user from Req, so body might be empty or specific DTO
            const response = await api.post<SprintSession>("/sprint", {});
            // @ts-ignore wrapper handling
            return response.data.data ? response.data.data : response.data;
        },
    });

    const finishSprintMutation = useMutation<SprintSession, Error, { sprintId: string }>({
        mutationFn: async ({ sprintId }) => {
            const response = await api.post<SprintSession>(`/sprint/${sprintId}/finish`);
            // @ts-ignore wrapper handling
            return response.data.data ? response.data.data : response.data;
        },
    });

    return {
        createSprint: createSprintMutation.mutateAsync,
        isCreating: createSprintMutation.isPending,
        finishSprint: finishSprintMutation.mutateAsync,
        isFinishing: finishSprintMutation.isPending,
    };
};
