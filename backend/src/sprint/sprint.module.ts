import { Module } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintSession } from './entities/SprintSession';
import { User } from '../user/entities/user.model';

@Module({
  imports: [TypeOrmModule.forFeature([SprintSession, User])],
  controllers: [],
  providers: [SprintService],
  exports: [SprintService,TypeOrmModule],
})
export class SprintModule {}
