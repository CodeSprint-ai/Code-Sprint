// export interface TestResult {
//   input: string;
//   expected: string;
//   got: string;
//   verdict:
//     | "ACCEPTED"
//     | "WRONG_ANSWER"
//     | "TIME_LIMIT_EXCEEDED"
//     | "RUNTIME_ERROR"
//     | "COMPILATION_ERROR"
//     | "INTERNAL_ERROR";
//   time: string;
//   memory: number;
//   token: string;
// }

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
  id: string;
  status: "PASSED" | "FAILED";
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
  executionTime?: number;
  memoryUsage?: number;
  verdict:
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "RUNTIME_ERROR"
  | "COMPILATION_ERROR"
  | "INTERNAL_ERROR";
  time: string;
  memory: number;
  token: string;
}

export interface Submission {
  uuid: string;
  code: string;
  language: string;
  status: SubmissionStatus;

  output?: string;

  executionTime?: number;
  memoryUsage?: number;

  userId: string;
  problemId: string;

  createdAt: string; // ISO string from backend

  testResults?: TestResult[]; // ✅ optional (important)
}


export interface SubmissionResponse {
  submission: Submission;
}

export interface SubmissionsResponse {
  submissions: Submission[];
}

export interface CreateSubmissionInput {
  code: string;
  language: string;
  problemUuid: string;
  slug: string;
}
