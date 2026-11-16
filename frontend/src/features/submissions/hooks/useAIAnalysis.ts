import { getErrorDetails } from "@/features/shared/utils/api-error";
import { useState, useCallback, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/features/shared/api/api";
import type {
  AIAnalysisResult,
  AIJobState,
  AIJobStatusResponse,
  AITriggerResponse,
} from "@/features/submissions/types/ai-analysis.types";

interface UseAIAnalysisReturn {
  /** The completed analysis result, or null */
  data: AIAnalysisResult | null;
  /** Current job state */
  status: AIJobState | null;
  /** Whether polling is currently active */
  isPolling: boolean;
  /** Whether the initial POST request is in-flight */
  isLoading: boolean;
  /** Error message (from trigger or from a failed job) */
  error: string | null;
  /** Trigger AI analysis for a given submissionId */
  triggerAnalysis: (submissionId: string) => void;
  /** Reset hook state (called automatically on submissionId change) */
  reset: () => void;
}

/**
 * Custom hook that handles the full AI analysis lifecycle:
 * 1. POST /ai/analyze-submission  → get a jobId
 * 2. Poll GET /ai/job-status/:id  → every 2 seconds until terminal state
 * 3. Expose loading / polling / data / error state to the consumer
 *
 * @param submissionId - Optional. When provided, auto-resets on change.
 */
export function useAIAnalysis(submissionId?: string): UseAIAnalysisReturn {
  const queryClient = useQueryClient();
  const [request, setRequest] = useState<{
    owner?: string;
    generation: number;
    jobId: string | null;
    data: AIAnalysisResult | null;
    status: AIJobState | null;
    error: string | null;
  }>({ owner: submissionId, generation: 0, jobId: null, data: null, status: null, error: null });

  // Changing submissions resets the local request before children render old data.
  if (request.owner !== submissionId) {
    setRequest({ owner: submissionId, generation: request.generation + 1, jobId: null, data: null, status: null, error: null });
  }
  const jobId = request.jobId;
  const requestVersion = useRef(0);
  const reset = useCallback(() => {
    requestVersion.current += 1;
    setRequest((previous) => ({ ...previous, owner: submissionId, jobId: null, data: null, status: null, error: null }));
  }, [submissionId]);

  // ── 1. Trigger mutation (POST) ────────────────────────────────────────
  const triggerMutation = useMutation<AITriggerResponse, Error, { subId: string; owner?: string; version: number; generation: number }>({
    mutationFn: async ({ subId }) => {
      const response = await api.post<AITriggerResponse>(
        "/ai/analyze-submission",
        { submissionId: subId }
      );
      return response.data;
    },
    onSuccess: (responseData, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ai-usage"] });
      if (variables.version !== requestVersion.current) return;
      setRequest((previous) => {
        if ((previous.owner !== variables.owner || previous.generation !== variables.generation)) return previous;
        return responseData.status === "cached"
          ? { ...previous, jobId: null, data: responseData.result, status: "completed", error: null }
          : { ...previous, jobId: responseData.jobId, data: null, status: "waiting", error: null };
      });
    },
    onError: (err, variables) => {
      if (variables.version !== requestVersion.current) return;
      const details = getErrorDetails(err);
      setRequest((previous) => (previous.owner !== variables.owner || previous.generation !== variables.generation) ? previous : {
        ...previous, status: "failed", error: details.response?.data?.message || details.message,
      });
    },
  });

  // ── 2. Polling query (GET) ────────────────────────────────────────────
  const pollingQuery = useQuery<AIJobStatusResponse>({
    queryKey: ["ai-job-status", jobId],
    queryFn: async () => {
      const response = await api.get<AIJobStatusResponse | { status: "not_found" }>(
        `/ai/job-status/${jobId}`
      );
      return "status" in response.data ? { id: String(jobId), state: "not_found" as const } : response.data;
    },
    enabled: !!jobId,
    refetchInterval: (query) => {
      const state = query.state.data?.state;
      return state === "completed" || state === "failed" || state === "not_found" ? false : 2000;
    },
    refetchIntervalInBackground: false,
  });

  const response = pollingQuery.data;
  const status = response?.state ?? request.status;
  const data = response?.result ?? request.data;
  const error = status === "failed" ? response?.error ?? request.error ?? "Analysis failed"
    : status === "not_found" ? "Analysis job not found" : request.error;
  const isTerminal = status === "completed" || status === "failed" || status === "not_found";

  // ── 3. Public API ─────────────────────────────────────────────────────
  const triggerAnalysis = useCallback(
    (subId: string) => {
      reset();
      triggerMutation.mutate({ subId, owner: submissionId, version: requestVersion.current, generation: request.generation });
    },
    [triggerMutation, reset, submissionId, request.generation]
  );

  const isPolling = !!jobId && !isTerminal;

  return {
    data,
    status,
    isPolling,
    isLoading: triggerMutation.isPending && triggerMutation.variables?.owner === submissionId,
    error,
    triggerAnalysis,
    reset,
  };
}
