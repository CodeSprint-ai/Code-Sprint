import { forwardRef, Module } from '@nestjs/common';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/Submission';
import { Problem } from '../problem/entities/Problem';

import { SprintModule } from '../sprint/sprint.module';
import { BullModule } from '@nestjs/bull';
import { SubmissionProcessor } from './processor/submissionProcessor';
import { CommonModule } from 'src/common/common.module';
import { JudgeModule } from '../judge/judge.module';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission, Problem]), // only entities needed here
    SprintModule,
    CommonModule,
    JudgeModule,
    ProfileModule,
    BullModule.registerQueue({
      name: 'submissions',   // 👈 name must match
    }),
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService, SubmissionProcessor],
})
export class SubmissionModule { }

