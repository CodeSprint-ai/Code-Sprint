import { Module } from '@nestjs/common';
import { Judge0Service } from './judge.service';

@Module({
    providers: [Judge0Service],
    exports: [Judge0Service],
})
export class JudgeModule { }
