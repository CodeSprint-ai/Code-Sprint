// submission.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { Submission } from '../entities/Submission';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Judge0Service } from '../../common/services/judge.service';
import { SocketGateway } from '../../common/utils/socket-gateway';
import { SubmissionStatus } from '../enum/SubmissionStatus';

@Processor('submissions')
@Injectable()
export class SubmissionProcessor {
  private logger = new Logger(SubmissionProcessor.name);

  constructor(
    @InjectRepository(Submission)
    private submissionRepo: Repository<Submission>,
    private judge0: Judge0Service,
    private socket: SocketGateway,
  ) { }

  @Process('process')
  async handle(job: Job) {
    const { submissionId } = job.data;
    const submission = await this.submissionRepo.findOne({
      where: { uuid: submissionId },
      relations: ['problem', 'problem.testCases', 'user'],
    });
    if (!submission) throw new Error('Submission not found');

    submission.status = SubmissionStatus.PROCESSING;
    await this.submissionRepo.save(submission);
    this.socket.emitToUser(submission.user.uuid, 'submission.update', {
      id: submission.uuid,
      status: submission.status,
    });

    const langId = await this.judge0.getLanguageIdByNameHint(submission.language);
    const items = submission.problem.testCases.map((tc) => ({
      language_id: langId,
      source_code: submission.code,
      stdin: tc.input ?? '',
      expected_output: tc.expectedOutput ?? '',
      cpu_time_limit: submission.problem.timeLimitSeconds ?? 2,
      memory_limit: Math.max(submission.problem.memoryLimitMB ?? 2048, 2048),
    }));

    // ✅ Submit to Judge0
    const tokensResp = await this.judge0.submitBatch(items);
    if (!tokensResp?.length) throw new Error('Failed to submit to Judge0');

    const tokens = tokensResp.map((t) => t.token).filter((t): t is string => !!t);
    submission.judgeTokens = JSON.stringify(tokens);
    await this.submissionRepo.save(submission);

    // ✅ Poll Judge0
    let results = await this.judge0.pollBatchUntilDone(tokens, 60_000, 800);
    if (!results) results = [];

    // ✅ Map test results
    const testResults = results.map((r, i) => {
      const tc = submission.problem.testCases[i];
      const statusId = r.status?.id ?? r.status_id;
      const statusMap: Record<number, SubmissionStatus> = {
        11: SubmissionStatus.ACCEPTED,
        4: SubmissionStatus.WRONG_ANSWER,
        5: SubmissionStatus.TIME_LIMIT_EXCEEDED,
        6: SubmissionStatus.COMPILATION_ERROR,
        7: SubmissionStatus.RUNTIME_ERROR,
        8: SubmissionStatus.RUNTIME_ERROR,
        9: SubmissionStatus.RUNTIME_ERROR,
        10: SubmissionStatus.RUNTIME_ERROR,
        12: SubmissionStatus.RUNTIME_ERROR,
        13: SubmissionStatus.RUNTIME_ERROR,
        14: SubmissionStatus.INTERNAL_ERROR,
        15: SubmissionStatus.INTERNAL_ERROR,
      };

      const verdict = statusMap[statusId] || SubmissionStatus.INTERNAL_ERROR;
      return {
        input: tc.input,
        expected: tc.expectedOutput,
        got: r.stdout ?? '',
        verdict,
        time: r.time,
        memory: r.memory,
        token: r.token,
      };
    });

    const allAccepted = testResults.every(
      (tr) => tr.verdict?.toUpperCase() === 'ACCEPTED',
    );

    submission.testResults = testResults;
    submission.status = allAccepted
      ? SubmissionStatus.ACCEPTED
      : SubmissionStatus.WRONG_ANSWER;

    submission.executionTime = Math.max(
      ...results.map((r) => parseFloat(r.time || 0)),
    );
    submission.memoryUsage = Math.max(...results.map((r) => r.memory || 0));
    submission.finishedAt = new Date();

    await this.submissionRepo.save(submission);

    // ✅ Emit socket update
    this.socket.emitToUser(submission.user.uuid, 'submission.update', {
      id: submission.uuid,
      status: submission.status,
      testResults,
    });
  }

}
