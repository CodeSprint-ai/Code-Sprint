import { Module } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintSession } from './entities/SprintSession';
import { User } from '../user/entities/user.model';
import { SprintProblem } from './entities/SprintProblem';

@Module({
  imports: [TypeOrmModule.forFeature([SprintSession, User,SprintProblem])],
  controllers: [],
  providers: [SprintService],
  exports: [SprintService,TypeOrmModule],
})
export class SprintModule {}
