import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type {
    Hint,
    HintUsageResponse,
    NextHintResponse,
} from "@/types/hints";

interface UseHintsReturn {
    /** All revealed hints so far */
    hints: Hint[];
    /** Current level reached (0–4) */
    levelReached: number;
    /** Total score penalty accumulated */
    totalPenalty: number;
    /** Hints remaining (4 - levelReached) */
    hintsRemaining: number;
    /** Whether the initial usage fetch is loading */
    isLoadingUsage: boolean;
    /** Whether the unlock mutation is in-flight */
    isUnlocking: boolean;
    /** Error message */
    error: string | null;
    /** Unlock the next hint */
    unlockNextHint: (language?: string) => void;
    /** Submit feedback for a hint */
    submitFeedback: (hintUuid: string, isUseful: boolean) => void;
}

/**
 * Custom hook for the progressive hint system.
 * Fetches usage state on mount, provides unlock + feedback mutations.
 */
export function useHints(problemUuid: string): UseHintsReturn {
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);

    // ── 1. Fetch current hint usage state ──────────────────────────────
    const usageQuery = useQuery<HintUsageResponse>({
        queryKey: ["hint-usage", problemUuid],
        queryFn: async () => {
            const response = await api.get<HintUsageResponse>(
                `/hints/usage/${problemUuid}`
            );
            return response.data;
        },
        enabled: !!problemUuid,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const usage = usageQuery.data;

    // ── 2. Unlock next hint mutation ───────────────────────────────────
    const unlockMutation = useMutation<NextHintResponse, Error, string | undefined>({
        mutationFn: async (language?: string) => {
            const response = await api.post<NextHintResponse>("/hints/next", {
                problemUuid,
                language: language || "python",
            });
            return response.data;
        },
        onSuccess: () => {
            setError(null);
            // Refetch usage to get the full updated hint list
            queryClient.invalidateQueries({ queryKey: ["hint-usage", problemUuid] });
        },
        onError: (err: any) => {
            const message =
                err?.response?.data?.message || err.message || "Failed to unlock hint";
            setError(message);
        },
    });

    // ── 3. Feedback mutation ───────────────────────────────────────────
    const feedbackMutation = useMutation<void, Error, { hintUuid: string; isUseful: boolean }>({
        mutationFn: async ({ hintUuid, isUseful }) => {
            await api.post(`/hints/${hintUuid}/feedback`, { isUseful });
        },
    });

    // ── 4. Public API ─────────────────────────────────────────────────
    const unlockNextHint = useCallback(
        (language?: string) => {
            setError(null);
            unlockMutation.mutate(language);
        },
        [unlockMutation]
    );

    const submitFeedback = useCallback(
        (hintUuid: string, isUseful: boolean) => {
            feedbackMutation.mutate({ hintUuid, isUseful });
        },
        [feedbackMutation]
    );

    return {
        hints: usage?.hints || [],
        levelReached: usage?.levelReached || 0,
        totalPenalty: usage?.scorePenalty || 0,
        hintsRemaining: usage?.hintsRemaining ?? 4,
        isLoadingUsage: usageQuery.isLoading,
        isUnlocking: unlockMutation.isPending,
        error,
        unlockNextHint,
        submitFeedback,
    };
}
