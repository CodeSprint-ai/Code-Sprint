import { Module } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { ProblemController } from './problem.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from './entities/Problem';
import { TestCase } from './entities/TestCase';

@Module({
  providers: [ProblemService],
  controllers: [ProblemController],
  imports: [TypeOrmModule.forFeature([Problem, TestCase])],
})
export class ProblemModule {}
