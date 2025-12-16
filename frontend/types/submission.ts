export interface TestResult {
  input: string;
  expected: string;
  got: string;
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
  id: string;
  code: string;
  language: string;
  status:
    | "PENDING"
    | "QUEUED"
    | "PROCESSING"
    | "ACCEPTED"
    | "WRONG_ANSWER"
    | "TIME_LIMIT_EXCEEDED"
    | "RUNTIME_ERROR"
    | "COMPILATION_ERROR"
    | "INTERNAL_ERROR";
  output?: string;
  userId: string;
  problemId: string;
  createdAt: string;
  testResults: TestResult[];
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
