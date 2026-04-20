import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { HintController } from './hint.controller';
import { HintService } from './hint.service';
import { HintGenerationService } from './hint-generation.service';
import { HintProcessor } from './hint.processor';
import { ProblemHint } from './entities/problem-hint.entity';
import { HintUsage } from './entities/hint-usage.entity';
import { Problem } from '../../problem/entities/Problem';
import { RagModule } from '../../rag/rag.module';
import { CommonModule } from '../../common/common.module';

@Module({
    imports: [
        // 1. Register entities
        TypeOrmModule.forFeature([ProblemHint, HintUsage, Problem]),

        // 2. Register Bull queue with default job options
        BullModule.registerQueue({
            name: 'hint-generation',
            defaultJobOptions: {
                attempts: 3,
                backoff: { type: 'exponential', delay: 3000 },
                removeOnComplete: 50,
                removeOnFail: 20,
            },
        }),

        // 3. Import RAG module (for RagService)
        RagModule,

        // 4. Import CommonModule (for RateLimiterGuard's AppLogger dependency)
        CommonModule,
    ],
    controllers: [HintController],
    providers: [HintService, HintGenerationService, HintProcessor],
    exports: [HintService],
})
export class HintModule { }
