import { Module } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintSession } from './entities/SprintSession';
import { User } from '../user/entities/user.model';
import { SprintProblem } from './entities/SprintProblem';
import { SprintController } from './sprint.controller'; // Import Controller
import { Problem } from '../problem/entities/Problem'; // Import Problem
import { Submission } from '../submission/entities/Submission'; // Import Submission

@Module({
  imports: [TypeOrmModule.forFeature([SprintSession, User, SprintProblem, Problem, Submission])],
  controllers: [SprintController],
  providers: [SprintService],
  exports: [SprintService, TypeOrmModule],
})
export class SprintModule { }
