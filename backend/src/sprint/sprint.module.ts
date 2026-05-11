import { Module } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintSession } from './entities/SprintSession';
import { User } from '../user/entities/user.model';
import { SprintProblem } from './entities/SprintProblem';
import { SprintController } from './sprint.controller';
import { Problem } from '../problem/entities/Problem';
import { Submission } from '../submission/entities/Submission';
import { UserStats } from '../profile/entities/UserStats';
import { ProfileModule } from '../profile/profile.module';
import { JudgeModule } from '../judge/judge.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SprintSession,
      User,
      SprintProblem,
      Problem,
      Submission,
      UserStats,
    ]),
    ProfileModule, // Provides BadgeService
    JudgeModule,   // Provides Judge0Service, RunnerFactory
  ],
  controllers: [SprintController],
  providers: [SprintService],
  exports: [SprintService, TypeOrmModule],
})
export class SprintModule { }
