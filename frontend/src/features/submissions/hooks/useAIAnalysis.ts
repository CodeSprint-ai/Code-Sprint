import { useState, useCallback, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type {
  AIAnalysisResult,
  AIJobState,
  AIJobStatusResponse,
  AITriggerResponse,
} from "@/types/ai-analysis";

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
  const [jobId, setJobId] = useState<string | null>(null);
  const [data, setData] = useState<AIAnalysisResult | null>(null);
  const [status, setStatus] = useState<AIJobState | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── Reset helper ──────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setJobId(null);
    setData(null);
    setStatus(null);
    setError(null);
  }, []);

  // Auto-reset when submissionId changes
  useEffect(() => {
    reset();
  }, [submissionId, reset]);

  // ── Terminal states where polling should stop ─────────────────────────
  const isTerminal =
    status === "completed" || status === "failed" || status === "not_found";

  // ── 1. Trigger mutation (POST) ────────────────────────────────────────
  const triggerMutation = useMutation<AITriggerResponse, Error, string>({
    mutationFn: async (subId: string) => {
      const response = await api.post<AITriggerResponse>(
        "/ai/analyze-submission",
        { submissionId: subId }
      );
      return response.data;
    },
    onSuccess: (responseData: any) => {
      if (responseData.status === "cached" && responseData.result) {
        // Backend returned cached analysis — no polling needed
        setData(responseData.result);
        setStatus("completed");
        setError(null);
      } else {
        // New job queued — start polling
        setJobId(String(responseData.jobId));
        setStatus("waiting");
        setError(null);
        setData(null);
      }
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message || err.message || "Failed to start analysis";
      setError(message);
      setStatus("failed");
    },
  });

  // ── 2. Polling query (GET) ────────────────────────────────────────────
  const pollingQuery = useQuery<AIJobStatusResponse>({
    queryKey: ["ai-job-status", jobId],
    queryFn: async () => {
      const response = await api.get<AIJobStatusResponse>(
        `/ai/job-status/${jobId}`
      );
      return response.data;
    },
    enabled: !!jobId && !isTerminal,
    refetchInterval: !!jobId && !isTerminal ? 2000 : false,
    refetchIntervalInBackground: false,
  });

  // Sync query data → local state via useEffect (NOT inside select, which causes re-render loops)
  useEffect(() => {
    const responseData = pollingQuery.data;
    if (!responseData) return;

    if (responseData.state === "completed" && responseData.result) {
      setData(responseData.result);
      setStatus("completed");
    } else if (responseData.state === "failed") {
      setError(responseData.error || "Analysis failed");
      setStatus("failed");
    } else if (responseData.state === "not_found") {
      setError("Analysis job not found");
      setStatus("not_found");
    } else {
      setStatus(responseData.state);
    }
  }, [pollingQuery.data]);

  // ── 3. Public API ─────────────────────────────────────────────────────
  const triggerAnalysis = useCallback(
    (subId: string) => {
      reset();
      triggerMutation.mutate(subId);
    },
    [triggerMutation, reset]
  );

  const isPolling = !!jobId && !isTerminal;

  return {
    data,
    status,
    isPolling,
    isLoading: triggerMutation.isPending,
    error,
    triggerAnalysis,
    reset,
  };
}
