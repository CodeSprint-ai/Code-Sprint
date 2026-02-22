import { Process, Processor, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostSubmissionService } from './post-submission.service';
import { Submission } from '../../submission/entities/Submission';

/**
 * Bull processor for background AI analysis jobs.
 * Handles retries, dead letters, and graceful shutdown.
 */
@Processor('analysis-queue')
@Injectable()
export class AnalysisProcessor implements OnModuleDestroy {
  private readonly logger = new Logger(AnalysisProcessor.name);

  constructor(
    private readonly postSubmissionService: PostSubmissionService,
    @InjectRepository(Submission)
    private readonly submissionRepo: Repository<Submission>,
  ) {}

  @Process('analyze')
  async handleAnalysis(job: Job): Promise<any> {
    const { submissionId, userId } = job.data;
    this.logger.log(
      `Processing analysis job ${job.id} for submission ${submissionId} (attempt ${job.attemptsMade + 1})`,
    );

    const start = Date.now();
    const result = await this.postSubmissionService.performAnalysis(
      submissionId,
      userId,
    );
    const elapsed = Date.now() - start;

    this.logger.log(
      `Job ${job.id} completed in ${elapsed}ms`,
    );

    return result;
  }

  /**
   * Dead letter handler — fires when a job exhausts all retries (Gap #4).
   * Stores failure reason on the submission entity for user visibility.
   */
  @OnQueueFailed()
  async onFailed(job: Job, error: Error): Promise<void> {
    this.logger.error(
      `Analysis job ${job.id} failed permanently after ${job.attemptsMade} attempts: ${error.message}`,
      error.stack,
    );

    // Store failure on the submission so the frontend can show an error state
    try {
      await this.submissionRepo.update(job.data.submissionId, {
        aiAnalysis: {
          error: 'analysis_failed',
          reason: error.message,
          failedAt: new Date().toISOString(),
          attempts: job.attemptsMade,
        } as any,
      });
    } catch (updateErr) {
      this.logger.error(
        `Failed to update submission with failure status: ${updateErr}`,
      );
    }
  }

  /**
   * Graceful shutdown — drain active jobs on SIGTERM (Production concern #4).
   */
  async onModuleDestroy(): Promise<void> {
    this.logger.log('Shutting down analysis processor — draining active jobs...');
    // Bull handles this gracefully via NestJS lifecycle hooks:
    // active jobs will finish before the process exits.
  }
}
