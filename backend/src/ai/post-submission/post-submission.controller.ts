import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Req,
  UseGuards,
  ForbiddenException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RateLimiterGuard, RateLimit } from '../../auth/guards/rate-limiter.guard';
import { Submission } from '../../submission/entities/Submission';
import { RagService } from '../../rag/rag.service';
import { Problem } from '../../problem/entities/Problem';
import { Roles } from '../../common/decorators/roleDecorater';

@Controller('ai')
export class PostSubmissionController {
  constructor(
    @InjectQueue('analysis-queue') private readonly analysisQueue: Queue,
    @InjectRepository(Submission)
    private readonly submissionRepo: Repository<Submission>,
    @InjectRepository(Problem)
    private readonly problemRepo: Repository<Problem>,
    private readonly ragService: RagService,
  ) {}

  /**
   * Dispatch an AI analysis job for a submission.
   * Rate limited: 5 requests per 60 seconds per user.
   * Validates submission ownership before dispatching.
   */
  @Post('analyze-submission')
  @UseGuards(AuthGuard('jwt'), RateLimiterGuard)
  @RateLimit({
    maxAttempts: 5,
    windowSeconds: 60,
    keyGenerator: (req: any) => `ai_analysis:${req.user?.uuid || req.ip}`,
  })
  @HttpCode(HttpStatus.ACCEPTED)
  async triggerAnalysis(
    @Body('submissionId') submissionId: string,
    @Req() req: any,
  ) {
    // Ownership check before even queuing (Production concern #3)
    const submission = await this.submissionRepo.findOne({
      where: { uuid: submissionId },
      relations: ['user'],
    });

    if (!submission) {
      throw new ForbiddenException('Submission not found');
    }

    if (submission.user.uuid !== req.user.uuid) {
      throw new ForbiddenException(
        'You can only request analysis for your own submissions',
      );
    }

    // Return cached analysis if it already exists (avoid wasting tokens)
    if (submission.aiAnalysis) {
      return {
        jobId: null,
        status: 'cached',
        result: submission.aiAnalysis,
      };
    }

    // Dispatch job — retry config is on the queue's defaultJobOptions
    const job = await this.analysisQueue.add('analyze', {
      submissionId,
      userId: req.user.uuid,
    });

    return { jobId: job.id, status: 'queued' };
  }

  /**
   * Get the status of an analysis job.
   */
  @Get('job-status/:id')
  @UseGuards(AuthGuard('jwt'))
  async getJobStatus(@Param('id') id: string) {
    const job = await this.analysisQueue.getJob(id);
    if (!job) {
      return { status: 'not_found' };
    }

    const state = await job.getState();

    return {
      id: job.id,
      state, // 'waiting', 'active', 'completed', 'failed'
      result: job.returnvalue, // Populates with AnalysisResult JSON on completion
      error: job.failedReason,
    };
  }

  /**
   * Admin endpoint: Bulk ingest all problems + test cases into RAG store.
   * Called once to seed the vector store, or periodically to refresh.
   */
  @Post('ingest-problems')
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async ingestProblems() {
    const problems = await this.problemRepo.find({
      relations: ['testCases'],
    });

    let ingested = 0;

    for (const problem of problems) {
      // Ingest problem description
      const problemContent = [
        `Title: ${problem.title}`,
        `Difficulty: ${problem.difficulty}`,
        `Description: ${problem.description}`,
        problem.constraints ? `Constraints: ${problem.constraints}` : '',
        problem.inputFormat ? `Input Format: ${problem.inputFormat}` : '',
        problem.outputFormat ? `Output Format: ${problem.outputFormat}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      await this.ragService.ingest('problems', problem.uuid, problemContent, {
        title: problem.title,
        difficulty: problem.difficulty,
        slug: problem.slug,
      });

      // Ingest test case patterns (non-hidden only)
      const visibleTestCases = problem.testCases?.filter(
        (tc) => !tc.isHidden,
      );

      if (visibleTestCases?.length) {
        const testCaseContent = visibleTestCases
          .map(
            (tc, i) =>
              `Test Case ${i + 1}: Input=${JSON.stringify(tc.getInput())}, Expected=${JSON.stringify(tc.getExpectedOutput())}`,
          )
          .join('\n');

        await this.ragService.ingest(
          'test_cases',
          problem.uuid,
          testCaseContent,
          {
            title: problem.title,
            testCaseCount: visibleTestCases.length,
          },
        );
      }

      ingested++;
    }

    return {
      message: `Ingested ${ingested} problems into RAG store`,
      count: ingested,
    };
  }
}
