/**
 * Submission Processor
 *
 * NestJS Execution Flow (STRICT):
 * Controller → SubmissionService → SubmissionProcessor → RunnerFactory → Judge0Service
 *
 * Architecture:
 * ✅ SINGLE Judge0 submission per problem (all test cases bundled)
 * ✅ Runner template handles comparison internally
 * ✅ executionConfig + tests sent as one JSON payload via stdin
 * ✅ Runner returns JSON array: [{ok, output, expected, durationMs, error}, ...]
 * ❌ No per-problem runner templates
 * ❌ No batch submission (one execution = all test cases)
 */
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Submission } from '../entities/Submission';
import { SubmissionStatus } from '../enum/SubmissionStatus';
import { Judge0Service } from '../../judge/judge.service';
import { RunnerFactory } from '../../judge/runners/runner.factory';
import { LanguageId, normalizeLanguage } from '../../judge/enums/language.enum';
import { SubmissionGateway } from '../../common/utils/socket-gateway';
import { UserStatsService } from '../../profile/user-stats.service';

// ─── Result Interfaces ─────────────────────────────────────────────

/**
 * Per-test-case judge result (returned by runner via stdout)
 */
interface JudgeResult {
  ok: boolean;
  output: any;
  expected: any;
  durationMs: number;
  error: string | null;
  traceback?: string;
}

/**
 * Internal test result (stored in DB + emitted via socket)
 */
interface TestResult {
  input: Record<string, unknown>;
  expected: unknown;
  got: unknown;
  verdict: SubmissionStatus;
  time: number;
  memory: number;
  token: string;
  isHidden: boolean;
}

@Processor('submissions')
@Injectable()
export class SubmissionProcessor {
  private readonly logger = new Logger(SubmissionProcessor.name);

  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepo: Repository<Submission>,
    private readonly judge0: Judge0Service,
    private readonly runnerFactory: RunnerFactory,
    private readonly socket: SubmissionGateway,
    private readonly userStatsService: UserStatsService,
  ) { }

  @Process('process')
  async handle(job: Job): Promise<void> {
    const { submissionId } = job.data;

    const submission = await this.submissionRepo.findOne({
      where: { uuid: submissionId },
      relations: ['problem', 'problem.testCases', 'user'],
    });

    if (!submission) {
      throw new Error(`Submission ${submissionId} not found`);
    }

    // Mark as processing
    submission.status = SubmissionStatus.PROCESSING;
    await this.submissionRepo.save(submission);
    this.emitUpdate(submission, { status: submission.status });

    try {
      await this.executeSubmission(submission);
    } catch (err: any) {
      this.logger.error('Submission processing failed', err);
      submission.status = SubmissionStatus.INTERNAL_ERROR;
      submission.finishedAt = new Date();
      await this.submissionRepo.save(submission);
      this.emitUpdate(submission, {
        status: submission.status,
        error: err.message || 'An internal error occurred during processing',
      });
    }
  }

  private async executeSubmission(submission: Submission): Promise<void> {
    const { problem, code, language } = submission;

    if (!language) {
      throw new Error('Language not specified in submission');
    }

    // Get the appropriate runner
    const normalizedLang = normalizeLanguage(language);
    const runner = this.runnerFactory.getRunner(normalizedLang);
    const languageId = LanguageId[normalizedLang];

    // Get execution config from problem
    if (!problem.executionConfig) {
      throw new Error('Problem missing execution configuration');
    }
    const config = problem.executionConfig;

    // Build the final executable code (global template + user code)
    const finalCode = runner.build(code, config);

    const useBase64 = process.env.JUDGE0_BASE64 === 'true';
    const encode = (str: string) =>
      useBase64 ? Buffer.from(str).toString('base64') : str;

    // ─── Bundle ALL test cases into a single stdin payload ─────
    // The runner template handles iteration, comparison, and result formatting
    const stdinPayload = JSON.stringify({
      executionConfig: config,
      tests: problem.testCases.map((tc) => ({
        input: tc.getInput(),
        expectedOutput: tc.getExpectedOutput(),
      })),
    });

    // ─── Submit ONE execution to Judge0 ───────────────────────
    const items = [
      {
        language_id: languageId,
        source_code: encode(finalCode),
        stdin: encode(stdinPayload),
        cpu_time_limit: problem.timeLimitSeconds ?? 5,
        memory_limit: (problem.memoryLimitMB ?? 128) * 1024,
      },
    ];

    const tokensResp = await this.judge0.submitBatch(items);

    if (!tokensResp?.length) {
      throw new Error('Judge0 submission failed - no tokens returned');
    }

    const tokens = tokensResp
      .map((t) => t.token)
      .filter((t): t is string => !!t);

    submission.judgeTokens = JSON.stringify(tokens);
    await this.submissionRepo.save(submission);

    // Poll for result (single submission)
    const results =
      (await this.judge0.pollBatchUntilDone(tokens, 60_000, 800)) || [];

    const judgeResponse = results[0];

    if (!judgeResponse) {
      throw new Error('No response from Judge0');
    }

    const statusId = judgeResponse.status?.id ?? judgeResponse.status_id ?? 13;

    // ─── Handle non-success Judge0 statuses ───────────────────
    if (statusId >= 5) {
      // TLE, CE, RTE, etc. — the code didn't produce output
      const verdict = this.mapJudge0Status(statusId);
      const errorOutput =
        judgeResponse.stderr ||
        judgeResponse.compile_output ||
        judgeResponse.stdout ||
        null;

      const testResults: TestResult[] = problem.testCases.map((tc) => ({
        input: tc.getInput(),
        expected: tc.getExpectedOutput(),
        got: errorOutput,
        verdict,
        time: parseFloat(judgeResponse.time ?? '0'),
        memory: judgeResponse.memory ?? 0,
        token: judgeResponse.token ?? '',
        isHidden: tc.isHidden,
      }));

      submission.testResults = testResults;
      submission.status = verdict;
      submission.executionTime = parseFloat(judgeResponse.time ?? '0');
      submission.memoryUsage = judgeResponse.memory ?? 0;
      submission.finishedAt = new Date();

      await this.submissionRepo.save(submission);

      this.emitUpdate(submission, {
        status: submission.status,
        testResults: this.filterHiddenResults(testResults),
        executionTime: submission.executionTime,
        memoryUsage: submission.memoryUsage,
      });
      return;
    }

    // ─── Parse runner's JSON output ───────────────────────────
    const stdout = judgeResponse.stdout ?? '';
    let judgeResults: JudgeResult[];

    try {
      judgeResults = JSON.parse(stdout.trim());

      if (!Array.isArray(judgeResults)) {
        throw new Error('Runner output is not an array');
      }
    } catch (parseErr: any) {
      this.logger.error('Failed to parse runner output', parseErr);
      this.logger.error('Raw stdout:', stdout);

      submission.status = SubmissionStatus.INTERNAL_ERROR;
      submission.finishedAt = new Date();
      submission.compileOutput = `Runner output parse error: ${stdout.substring(0, 500)}`;
      await this.submissionRepo.save(submission);

      this.emitUpdate(submission, {
        status: submission.status,
        error: 'Internal error: failed to parse runner output',
      });
      return;
    }

    // ─── Map judge results to test results ────────────────────
    const testResults: TestResult[] = problem.testCases.map((tc, i) => {
      const jr = judgeResults[i];

      if (!jr) {
        return {
          input: tc.getInput(),
          expected: tc.getExpectedOutput(),
          got: null,
          verdict: SubmissionStatus.INTERNAL_ERROR,
          time: 0,
          memory: 0,
          token: judgeResponse.token ?? '',
          isHidden: tc.isHidden,
        };
      }

      let verdict: SubmissionStatus;
      if (jr.error) {
        verdict = SubmissionStatus.RUNTIME_ERROR;
      } else if (jr.ok) {
        verdict = SubmissionStatus.ACCEPTED;
      } else {
        verdict = SubmissionStatus.WRONG_ANSWER;
      }

      return {
        input: tc.getInput(),
        expected: jr.expected ?? tc.getExpectedOutput(),
        got: jr.error ?? jr.output,
        verdict,
        time: (jr.durationMs ?? 0) / 1000, // convert ms → seconds for consistency
        memory: judgeResponse.memory ?? 0,
        token: judgeResponse.token ?? '',
        isHidden: tc.isHidden,
      };
    });

    // ─── Determine final verdict ──────────────────────────────
    const allAccepted = testResults.every(
      (tr) => tr.verdict === SubmissionStatus.ACCEPTED,
    );
    const firstFailure = testResults.find(
      (tr) => tr.verdict !== SubmissionStatus.ACCEPTED,
    );

    submission.testResults = testResults;
    submission.status = allAccepted
      ? SubmissionStatus.ACCEPTED
      : firstFailure?.verdict || SubmissionStatus.WRONG_ANSWER;
    submission.executionTime = parseFloat(judgeResponse.time ?? '0');
    submission.memoryUsage = judgeResponse.memory ?? 0;
    submission.finishedAt = new Date();

    await this.submissionRepo.save(submission);

    // Update user stats if submission was accepted
    if (submission.status === SubmissionStatus.ACCEPTED) {
      await this.userStatsService.updateStatsOnAcceptedSubmission(
        submission.user.uuid,
        submission.problem.uuid,
      );
    }

    this.emitUpdate(submission, {
      status: submission.status,
      testResults: this.filterHiddenResults(testResults),
      executionTime: submission.executionTime,
      memoryUsage: submission.memoryUsage,
    });
  }

  private mapJudge0Status(statusId: number): SubmissionStatus {
    const statusMap: Record<number, SubmissionStatus> = {
      1: SubmissionStatus.QUEUED,
      2: SubmissionStatus.PROCESSING,
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
    };

    return statusMap[statusId] || SubmissionStatus.INTERNAL_ERROR;
  }

  private filterHiddenResults(results: TestResult[]): TestResult[] {
    return results.map((r) => {
      if (r.isHidden) {
        return {
          ...r,
          input: {},
          expected: null,
          got: null,
        };
      }
      return r;
    });
  }

  private emitUpdate(
    submission: Submission,
    data: {
      status: SubmissionStatus;
      testResults?: TestResult[];
      executionTime?: number;
      memoryUsage?: number;
      error?: string;
    },
  ): void {
    this.socket.sendSubmissionUpdate(submission.user.uuid, {
      id: submission.uuid,
      language: submission.language,
      ...data,
    });
  }
}
