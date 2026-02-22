import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { PostSubmissionService } from './post-submission.service';
import { PostSubmissionController } from './post-submission.controller';
import { AnalysisProcessor } from './analysis.processor';
import { Submission } from '../../submission/entities/Submission';
import { DocumentEmbedding } from '../../entities/DocumentEmbedding';
import { Problem } from '../../problem/entities/Problem';
import { RagModule } from '../../rag/rag.module';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    // 1. Register entities
    TypeOrmModule.forFeature([Submission, DocumentEmbedding, Problem]),

    // 2. Register Bull queue with default job options (Gap #3: retry belongs here)
    BullModule.registerQueue({
      name: 'analysis-queue',
      defaultJobOptions: {
        attempts: 5,
        backoff: { type: 'exponential', delay: 3000 },
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 50, // Keep last 50 failed for debugging
      },
    }),

    // 3. Import RAG module (for RagService & EmbeddingService)
    RagModule,

    // 4. Import CommonModule (for RateLimiterGuard's AppLogger dependency)
    CommonModule,
  ],
  controllers: [PostSubmissionController],
  providers: [PostSubmissionService, AnalysisProcessor],
  exports: [PostSubmissionService],
})
export class PostSubmissionModule {}
