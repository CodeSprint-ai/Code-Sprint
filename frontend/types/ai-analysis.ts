/**
 * Frontend types for the AI post-submission analysis feature.
 * Mirrors the backend AnalysisResult Zod schema + job status API responses.
 */

export interface AIAnalysisResult {
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
  edgeCases: string[];
  optimizations: string[];
  feedback: string;
  isOptimal: boolean;
}

export type AIJobState =
  | "waiting"
  | "active"
  | "completed"
  | "failed"
  | "not_found";

export interface AIJobStatusResponse {
  id: string;
  state: AIJobState;
  result?: AIAnalysisResult;
  error?: string;
}

export interface AITriggerResponse {
  jobId: string;
  status: "queued";
}
