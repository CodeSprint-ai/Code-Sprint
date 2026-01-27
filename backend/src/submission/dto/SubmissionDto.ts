import { Submission } from '../entities/Submission';

export class SubmissionDto {
  uuid: string;
  userId: string;
  problemId: string;
  sprintSessionId?: string;
  code: string;
  language: string;
  status: string;
  executionTime?: number;
  memoryUsage?: number;
  createdAt: Date;
  problemTitle?: string;
  userName?: string;
  testResults?: any;
  compileOutput?: string;
  finishedAt?: Date;

  static toDto(submission: Submission): SubmissionDto {
    return {
      uuid: submission.uuid,
      userId: submission.user.uuid,
      problemId: submission.problem.uuid,
      sprintSessionId: submission.sprintSession?.uuid,
      code: submission.code,
      language: submission.language,
      status: submission.status,
      executionTime: submission.executionTime,
      memoryUsage: submission.memoryUsage,
      createdAt: submission.createdAt,
      problemTitle: submission.problem?.title,
      userName: submission.user?.name,
      testResults: submission.testResults,
      compileOutput: submission.compileOutput,
      finishedAt: submission.finishedAt,
    };
  }
}
