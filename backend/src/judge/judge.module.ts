import { Module } from '@nestjs/common';
import { Judge0Service } from './judge.service';
import { RunnerFactory } from './runners/runner.factory';

@Module({
  providers: [Judge0Service, RunnerFactory],
  exports: [Judge0Service, RunnerFactory],
})
export class JudgeModule {}
