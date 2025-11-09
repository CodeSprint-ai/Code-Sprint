export interface Submission {
  id: string;
  code: string;
  language: string;
  status: "QUEUED" | "RUNNING" | "SUCCESS" | "FAILED";
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
