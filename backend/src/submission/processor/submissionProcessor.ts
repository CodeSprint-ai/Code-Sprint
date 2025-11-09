// submission.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { Submission } from '../entities/Submission';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Judge0Service } from '../../common/services/judge.service';
import { SubmissionStatus } from '../enum/SubmissionStatus';
import { SubmissionGateway } from 'src/common/utils/socket-gateway';

@Processor('submissions')
@Injectable()
export class SubmissionProcessor {
  private logger = new Logger(SubmissionProcessor.name);

  constructor(
    @InjectRepository(Submission)
    private submissionRepo: Repository<Submission>,
    private judge0: Judge0Service,
    private socket: SubmissionGateway,
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
    this.socket.sendSubmissionUpdate(submission.user.uuid, {
      id: submission.uuid,
      status: submission.status,
    });

    try {
      // const langId = await this.judge0.getLanguageIdByNameHint(submission.language);
      let langId: number;

      if (!submission.language) {
        throw new Error('Language not specified in submission');
      }

      switch (submission.language.toLowerCase()) {
        case 'python':
        case 'python3':
          langId = 71;
          break;
        case 'java':
          langId = 62;
          break;
        case 'c++':
        case 'cpp':
          langId = 54;
          break;
        default:
          throw new Error(`Unsupported language: ${submission.language}`);
      }

      const useBase64 = process.env.JUDGE0_BASE64 === 'true';
      const items = submission.problem.testCases.map((tc) => ({
        language_id: langId,
        source_code: useBase64
          ? Buffer.from(submission.code).toString('base64')
          : submission.code,
        stdin: tc.input
          ? useBase64
            ? Buffer.from(tc.input).toString('base64')
            : tc.input
          : '',
        expected_output: tc.expectedOutput
          ? useBase64
            ? Buffer.from(tc.expectedOutput).toString('base64')
            : tc.expectedOutput
          : '',
        cpu_time_limit: submission.problem.timeLimitSeconds ?? 2,
        memory_limit: Math.max(submission.problem.memoryLimitMB ?? 2048, 2048),
      }));

      const tokensResp = await this.judge0.submitBatch(items);
      if (!tokensResp?.length) {
        throw new Error('Judge0 submission failed');
      }

      const tokens = tokensResp.map((t) => t.token).filter((t): t is string => !!t);
      submission.judgeTokens = JSON.stringify(tokens);
      await this.submissionRepo.save(submission);

      const results = (await this.judge0.pollBatchUntilDone(tokens, 60_000, 800)) || [];

      const testResults = submission.problem.testCases.map((tc, i) => {
        const r = results[i] ?? {};
        const statusId = r.status?.id ?? r.status_id ?? 13;
        const statusMap: Record<number, SubmissionStatus> = {
          3: SubmissionStatus.ACCEPTED,
          4: SubmissionStatus.WRONG_ANSWER,
          5: SubmissionStatus.TIME_LIMIT_EXCEEDED,
          6: SubmissionStatus.COMPILATION_ERROR,
          7: SubmissionStatus.RUNTIME_ERROR,
          8: SubmissionStatus.RUNTIME_ERROR,
          9: SubmissionStatus.RUNTIME_ERROR,
          10: SubmissionStatus.RUNTIME_ERROR,
          11: SubmissionStatus.RUNTIME_ERROR,
          12: SubmissionStatus.RUNTIME_ERROR,
          13: SubmissionStatus.INTERNAL_ERROR,
          14: SubmissionStatus.INTERNAL_ERROR,
          15: SubmissionStatus.INTERNAL_ERROR,
        };
        const verdict = statusMap[statusId] || SubmissionStatus.INTERNAL_ERROR;
        return {
          input: tc.input ?? '',
          expected: tc.expectedOutput ?? '',
          got: r.stdout ?? '',
          verdict,
          time: r.time ?? 0,
          memory: r.memory ?? 0,
          token: r.token ?? '',
        };
      });

      const allAccepted = testResults.every((tr) => tr.verdict === SubmissionStatus.ACCEPTED);

      submission.testResults = testResults;
      submission.status = allAccepted ? SubmissionStatus.ACCEPTED : SubmissionStatus.WRONG_ANSWER;
      submission.executionTime = Math.max(...results.map((r) => parseFloat(r.time ?? '0')));
      submission.memoryUsage = Math.max(...results.map((r) => r.memory ?? 0));
      submission.finishedAt = new Date();

      await this.submissionRepo.save(submission);
      this.socket.sendSubmissionUpdate(submission.user.uuid, {
        id: submission.uuid,
        status: submission.status,
        testResults,
      });

    } catch (err) {
      this.logger.error('Submission processing failed', err);
      submission.status = SubmissionStatus.INTERNAL_ERROR;
      submission.finishedAt = new Date();
      await this.submissionRepo.save(submission);
      this.socket.sendSubmissionUpdate(submission.user.uuid, {
        id: submission.uuid,
        status: submission.status,
      });
    }
  }


}


