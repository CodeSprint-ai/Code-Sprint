export interface Submission {
  id: string;
  code: string;
  language: string;
  status: "PENDING" | "QUEUED" | "PROCESSING" | "ACCEPTED" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "RUNTIME_ERROR" | "COMPILATION_ERROR" | "INTERNAL_ERROR";
  output?: string;
  userId: string;
  problemId: string;
  createdAt: string;
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
