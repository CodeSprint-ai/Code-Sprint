/**
 * Submission Processor
 * 
 * NestJS Execution Flow (STRICT):
 * Controller → SubmissionService → SubmissionProcessor → RunnerFactory → Judge0Service
 * 
 * ❌ No if-else chains for language selection
 * ❌ No raw user code execution
 * ✅ Function-based problems only
 * ✅ JSON input/output format
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
import { LanguageId, normalizeLanguage, Language } from '../../judge/enums/language.enum';
import { SubmissionGateway } from '../../common/utils/socket-gateway';
import { UserStatsService } from '../../profile/user-stats.service';

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
    } catch (err) {
      this.logger.error('Submission processing failed', err);
      submission.status = SubmissionStatus.INTERNAL_ERROR;
      submission.finishedAt = new Date();
      await this.submissionRepo.save(submission);
      this.emitUpdate(submission, { status: submission.status });
    }
  }

  private async executeSubmission(submission: Submission): Promise<void> {
    const { problem, code, language } = submission;

    if (!language) {
      throw new Error('Language not specified in submission');
    }

    // Get the appropriate runner (no if-else chains!)
    const normalizedLang = normalizeLanguage(language);
    const runner = this.runnerFactory.getRunner(normalizedLang);
    const languageId = LanguageId[normalizedLang];

    // Get the runner template for this language
    if (!problem.runnerTemplate) {
      throw new Error('Problem missing runner template configuration');
    }
    const runnerTemplate = this.getRunnerTemplate(problem.runnerTemplate, normalizedLang);

    // Build the final executable code
    // This combines user's Solution class with the runner template
    const finalCode = runner.build(code, runnerTemplate);

    const useBase64 = process.env.JUDGE0_BASE64 === 'true';
    const encode = (str: string) =>
      useBase64 ? Buffer.from(str).toString('base64') : str;

    // Prepare Judge0 submission payloads
    const items = problem.testCases.map((tc) => {
      // Get input using helper method (supports both JSONB and legacy text)
      const inputData = tc.getInput();
      const stdin = runner.serializeInput(inputData);

      // Get expected output using helper method
      const expectedOutputData = tc.getExpectedOutput();
      const expectedOutput = typeof expectedOutputData === 'string'
        ? expectedOutputData
        : JSON.stringify(expectedOutputData);

      return {
        language_id: languageId,
        source_code: encode(finalCode),
        stdin: encode(stdin),
        expected_output: encode(expectedOutput),
        cpu_time_limit: problem.timeLimitSeconds ?? 5,
        memory_limit: (problem.memoryLimitMB ?? 128) * 1024, // Convert MB to KB
      };
    });

    // Submit batch to Judge0
    const tokensResp = await this.judge0.submitBatch(items);

    if (!tokensResp?.length) {
      throw new Error('Judge0 submission failed - no tokens returned');
    }

    const tokens = tokensResp
      .map((t) => t.token)
      .filter((t): t is string => !!t);

    submission.judgeTokens = JSON.stringify(tokens);
    await this.submissionRepo.save(submission);

    // Poll for results
    const results = await this.judge0.pollBatchUntilDone(tokens, 60_000, 800) || [];

    // Process results with JSON comparison
    const testResults = this.processResults(
      problem.testCases,
      results,
      runner,
    );

    // Determine final verdict
    const allAccepted = testResults.every(
      (tr) => tr.verdict === SubmissionStatus.ACCEPTED,
    );

    // Find first non-accepted result for detailed status
    const firstFailure = testResults.find(
      (tr) => tr.verdict !== SubmissionStatus.ACCEPTED,
    );

    submission.testResults = testResults;
    submission.status = allAccepted
      ? SubmissionStatus.ACCEPTED
      : firstFailure?.verdict || SubmissionStatus.WRONG_ANSWER;
    submission.executionTime = Math.max(
      ...results.map((r) => parseFloat(r.time ?? '0')),
    );
    submission.memoryUsage = Math.max(...results.map((r) => r.memory ?? 0));
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
    });
  }

  private getRunnerTemplate(
    templates: { java: string; python: string; cpp: string },
    language: Language,
  ): string {
    switch (language) {
      case Language.JAVA:
        return templates.java;
      case Language.PYTHON:
        return templates.python;
      case Language.CPP:
        return templates.cpp;
    }
  }

  private processResults(
    testCases: import('../../problem/entities/TestCase').TestCase[],
    results: Array<{
      status?: { id: number };
      status_id?: number;
      stdout?: string;
      stderr?: string;
      compile_output?: string;
      time?: string;
      memory?: number;
      token?: string;
    }>,
    runner: ReturnType<RunnerFactory['getRunner']>,
  ): TestResult[] {
    return testCases.map((tc, i) => {
      const r = results[i] ?? {};
      const statusId = r.status?.id ?? r.status_id ?? 13;

      // Get input and expected output using helper methods
      const inputData = tc.getInput();
      const expectedOutputData = tc.getExpectedOutput();

      // Map Judge0 status IDs to our status enum
      let verdict: SubmissionStatus;
      let got: unknown = null;

      if (statusId === 3) {
        // Status 3 = "Accepted" by Judge0 (execution successful + output matched)
        const stdout = r.stdout ?? '';

        try {
          got = JSON.parse(stdout.trim());
        } catch {
          got = stdout.trim();
        }

        // Judge0 already verified, but double-check with our JSON comparator
        // This handles edge cases like whitespace differences
        const isCorrect = runner.compareOutput(stdout, expectedOutputData);
        verdict = isCorrect ? SubmissionStatus.ACCEPTED : SubmissionStatus.WRONG_ANSWER;
      } else if (statusId === 4) {
        // Status 4 = Wrong Answer (execution successful but output didn't match)
        const stdout = r.stdout ?? '';

        try {
          got = JSON.parse(stdout.trim());
        } catch {
          got = stdout.trim();
        }

        // Double-check with our JSON comparator (Judge0 uses strict string matching)
        // Our comparator is more lenient (ignores whitespace, compares JSON structure)
        const isCorrect = runner.compareOutput(stdout, expectedOutputData);
        verdict = isCorrect ? SubmissionStatus.ACCEPTED : SubmissionStatus.WRONG_ANSWER;
      } else {
        // Map other status codes (TLE, RTE, CE, etc.)
        verdict = this.mapJudge0Status(statusId);
        got = r.stderr || r.compile_output || r.stdout || null;
      }

      return {
        input: inputData,
        expected: expectedOutputData,
        got,
        verdict,
        time: parseFloat(r.time ?? '0'),
        memory: r.memory ?? 0,
        token: r.token ?? '',
        isHidden: tc.isHidden,
      };
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
      7: SubmissionStatus.RUNTIME_ERROR,  // SIGSEGV
      8: SubmissionStatus.RUNTIME_ERROR,  // SIGXFSZ
      9: SubmissionStatus.RUNTIME_ERROR,  // SIGFPE
      10: SubmissionStatus.RUNTIME_ERROR, // SIGABRT
      11: SubmissionStatus.RUNTIME_ERROR, // NZEC
      12: SubmissionStatus.RUNTIME_ERROR, // Other
      13: SubmissionStatus.INTERNAL_ERROR,
      14: SubmissionStatus.INTERNAL_ERROR, // Exec Format Error
    };

    return statusMap[statusId] || SubmissionStatus.INTERNAL_ERROR;
  }

  private filterHiddenResults(results: TestResult[]): TestResult[] {
    // Don't expose hidden test case details to users
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
    data: { status: SubmissionStatus; testResults?: TestResult[] },
  ): void {
    this.socket.sendSubmissionUpdate(submission.user.uuid, {
      id: submission.uuid,
      ...data,
    });
  }
}
