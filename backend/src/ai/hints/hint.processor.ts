import { Process, Processor, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { HintGenerationService } from './hint-generation.service';

/**
 * Bull processor for background hint generation jobs.
 * Handles admin-triggered bulk generation for a given problem.
 * Follows the same pattern as AnalysisProcessor.
 */
@Processor('hint-generation')
@Injectable()
export class HintProcessor implements OnModuleDestroy {
    private readonly logger = new Logger(HintProcessor.name);

    constructor(
        private readonly generationService: HintGenerationService,
    ) { }

    @Process('generate')
    async handleGeneration(
        job: Job<{ problemUuid: string; language?: string }>,
    ): Promise<any> {
        const { problemUuid, language } = job.data;
        this.logger.log(
            `Processing hint generation job ${job.id} for problem ${problemUuid} (attempt ${job.attemptsMade + 1})`,
        );

        const start = Date.now();
        const hints = await this.generationService.generateForProblem(
            problemUuid,
            language || 'python',
        );
        const elapsed = Date.now() - start;

        await job.progress(100);

        this.logger.log(
            `Job ${job.id} completed in ${elapsed}ms — generated ${hints.length} hints`,
        );

        return { hintsGenerated: hints.length, problemUuid };
    }

    /**
     * Dead letter handler — fires when a job exhausts all retries.
     */
    @OnQueueFailed()
    async onFailed(job: Job, error: Error): Promise<void> {
        this.logger.error(
            `Hint generation job ${job.id} failed permanently after ${job.attemptsMade} attempts: ${error.message}`,
            error.stack,
        );
    }

    /**
     * Graceful shutdown — drain active jobs on SIGTERM.
     */
    async onModuleDestroy(): Promise<void> {
        this.logger.log(
            'Shutting down hint processor — draining active jobs...',
        );
    }
}
