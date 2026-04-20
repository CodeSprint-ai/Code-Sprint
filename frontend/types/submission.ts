export type SubmissionStatus =
  | "PENDING"
  | "QUEUED"
  | "PROCESSING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "RUNTIME_ERROR"
  | "COMPILATION_ERROR"
  | "INTERNAL_ERROR";

export interface TestResult {
  /** JSON input object */
  input: Record<string, unknown>;
  /** Expected output (JSON) */
  expected: unknown;
  /** Actual output from execution */
  got: unknown;
  /** Verdict for this test case */
  verdict: SubmissionStatus;
  /** Execution time in seconds */
  time: number;
  /** Memory usage in KB */
  memory: number;
  /** Judge0 token */
  token: string;
  /** Whether this test case is hidden */
  isHidden: boolean;
}

export interface Submission {
  uuid: string;
  userId: string;
  problemId: string;
  sprintSessionId?: string;
  code: string;
  language: string;
  status: SubmissionStatus;
  executionTime?: number;
  memoryUsage?: number;
  testResults?: TestResult[];
  judgeTokens?: string;
  compileOutput?: string;
  finishedAt?: string;
  createdAt: string;
  // Extended fields from backend (when using paginated endpoint)
  problemTitle?: string;
  userName?: string;
}

export interface SubmissionResponse {
  submission: Submission;
}

export interface SubmissionsResponse {
  submissions: Submission[];
}

export interface PaginatedSubmissionsResponse {
  data: Submission[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface GetSubmissionsParams {
  page?: number;
  pageSize?: number;
  status?: SubmissionStatus;
  search?: string;
  userId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface CreateSubmissionInput {
  code: string;
  language: string;
  problemUuid?: string;
  slug?: string;
  timeSpentMs?: number;
}

/**
 * Helper to format test result input for display
 */
export function formatTestResultInput(result: TestResult): string {
  if (result.isHidden) {
    return "(Hidden)";
  }
  if (result.input && Object.keys(result.input).length > 0) {
    return JSON.stringify(result.input, null, 2);
  }
  return "";
}

/**
 * Helper to format test result expected output for display
 */
export function formatTestResultExpected(result: TestResult): string {
  if (result.isHidden) {
    return "(Hidden)";
  }
  if (result.expected !== null && result.expected !== undefined) {
    return typeof result.expected === "string"
      ? result.expected
      : JSON.stringify(result.expected, null, 2);
  }
  return "";
}

/**
 * Helper to format test result actual output for display
 */
export function formatTestResultGot(result: TestResult): string {
  if (result.isHidden) {
    return "(Hidden)";
  }
  if (result.got !== null && result.got !== undefined) {
    return typeof result.got === "string"
      ? result.got
      : JSON.stringify(result.got, null, 2);
  }
  return "";
}

/**
 * Get status color class
 */
export function getStatusColor(status: SubmissionStatus): string {
  switch (status) {
    case "ACCEPTED":
      return "text-green-600";
    case "WRONG_ANSWER":
      return "text-red-600";
    case "TIME_LIMIT_EXCEEDED":
      return "text-orange-600";
    case "RUNTIME_ERROR":
    case "COMPILATION_ERROR":
      return "text-red-600";
    case "PROCESSING":
    case "QUEUED":
      return "text-yellow-600";
    case "PENDING":
      return "text-gray-500";
    default:
      return "text-gray-500";
  }
}
