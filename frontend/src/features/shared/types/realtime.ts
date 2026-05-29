/**
 * Real-time submission event types
 * These events are emitted by the backend via Socket.IO
 */

export type SubmissionEventType =
  | "submission:created"
  | "submission:queued"
  | "submission:compiling"
  | "submission:running"
  | "submission:testcase_result"
  | "submission:completed"
  | "submission:error";

export type SubmissionPhase =
  | "idle"
  | "created"
  | "queued"
  | "compiling"
  | "running"
  | "completed"
  | "error";

export interface TestCaseResult {
  index: number;
  input: Record<string, unknown>;
  expected: unknown;
  got: unknown;
  verdict: "ACCEPTED" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "RUNTIME_ERROR" | "COMPILATION_ERROR";
  time: number; // seconds
  memory: number; // KB
  isHidden: boolean;
  passed: boolean;
}

export interface SubmissionProgress {
  submissionId: string;
  phase: SubmissionPhase;
  currentTestCase?: number;
  totalTestCases?: number;
  message?: string;
  timestamp: Date;
}

export interface SubmissionCreatedEvent {
  submissionId: string;
  problemId: string;
  language: string;
  timestamp: string;
}

export interface SubmissionQueuedEvent {
  submissionId: string;
  position?: number;
  estimatedWait?: number;
}

export interface SubmissionCompilingEvent {
  submissionId: string;
  language: string;
}

export interface SubmissionRunningEvent {
  submissionId: string;
  currentTestCase: number;
  totalTestCases: number;
}

export interface SubmissionTestCaseResultEvent {
  submissionId: string;
  testCaseIndex: number;
  result: TestCaseResult;
}

export interface SubmissionCompletedEvent {
  submissionId: string;
  status: string;
  executionTime: number;
  memoryUsage: number;
  passedCount: number;
  totalCount: number;
  testResults: TestCaseResult[];
}

export interface SubmissionErrorEvent {
  submissionId: string;
  error: string;
  compileOutput?: string;
}

export interface RealTimeSubmission {
  id: string;
  phase: SubmissionPhase;
  status?: string;
  language?: string;
  
  // Progress tracking
  currentTestCase: number;
  totalTestCases: number;
  
  // Results
  executionTime?: number;
  memoryUsage?: number;
  passedCount: number;
  testResults: TestCaseResult[];
  
  // Error info
  error?: string;
  compileOutput?: string;
  
  // Timestamps
  createdAt?: Date;
  completedAt?: Date;
}

export const initialSubmissionState: RealTimeSubmission = {
  id: "",
  phase: "idle",
  currentTestCase: 0,
  totalTestCases: 0,
  passedCount: 0,
  testResults: [],
};

/**
 * Get human-readable phase label
 */
export function getPhaseLabel(phase: SubmissionPhase): string {
  switch (phase) {
    case "idle":
      return "Ready";
    case "created":
      return "Submission Created";
    case "queued":
      return "In Queue";
    case "compiling":
      return "Compiling...";
    case "running":
      return "Running Tests...";
    case "completed":
      return "Completed";
    case "error":
      return "Error";
    default:
      return "Unknown";
  }
}

/**
 * Get status color class
 */
export function getStatusColorClass(status?: string): string {
  switch (status) {
    case "ACCEPTED":
      return "text-green-500";
    case "WRONG_ANSWER":
      return "text-red-500";
    case "TIME_LIMIT_EXCEEDED":
      return "text-orange-500";
    case "RUNTIME_ERROR":
      return "text-red-600";
    case "COMPILATION_ERROR":
      return "text-yellow-500";
    case "PENDING":
    case "QUEUED":
    case "PROCESSING":
      return "text-blue-500";
    default:
      return "text-gray-500";
  }
}

/**
 * Get status background color class
 */
export function getStatusBgClass(status?: string): string {
  switch (status) {
    case "ACCEPTED":
      return "bg-green-500/10 border-green-500/20";
    case "WRONG_ANSWER":
      return "bg-red-500/10 border-red-500/20";
    case "TIME_LIMIT_EXCEEDED":
      return "bg-orange-500/10 border-orange-500/20";
    case "RUNTIME_ERROR":
      return "bg-red-600/10 border-red-600/20";
    case "COMPILATION_ERROR":
      return "bg-yellow-500/10 border-yellow-500/20";
    default:
      return "bg-gray-500/10 border-gray-500/20";
  }
}

