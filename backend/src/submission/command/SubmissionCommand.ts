export class SubmissionCommand {
  userId: string;
  problemId: string;
  code: string;
  language: string;
  sprintSessionId?: string; // optional
}
