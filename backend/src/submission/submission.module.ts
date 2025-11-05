import { forwardRef, Module } from '@nestjs/common';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/Submission';
import { Problem } from '../problem/entities/Problem';

import { SprintModule } from '../sprint/sprint.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission, Problem]), // only entities needed here
    SprintModule, // 👈 gives access to SprintService + SprintSessionRepository
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService],
})
export class SubmissionModule {}
