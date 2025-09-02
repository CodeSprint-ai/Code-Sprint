// controllers/problem.controller.ts
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { ProblemCommand } from './command/ProblemCommand';
import { CreateTestCaseCommand } from './command/CreateTestCaseCommand';
import { ProblemDto } from './dto/ProblemDto';
import { TestCaseDto } from './dto/TestCaseDto';

@Controller('problems')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Post()
  async create(@Body() cmd: ProblemCommand): Promise<ProblemDto> {
    return this.problemService.createProblem(cmd);
  }

  @Get()
  async findAll(): Promise<ProblemDto[]> {
    return this.problemService.listProblems();
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string): Promise<ProblemDto> {
    return this.problemService.getProblem(uuid);
  }

  @Put(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() cmd: Partial<ProblemCommand>,
  ): Promise<ProblemDto> {
    return this.problemService.updateProblem(uuid, cmd);
  }

  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string): Promise<void> {
    return this.problemService.deleteProblem(uuid);
  }

  @Post(':uuid/testcases')
  async addTestCase(
    @Param('uuid') uuid: string,
    @Body() cmd: CreateTestCaseCommand,
  ): Promise<TestCaseDto> {
    return this.problemService.addTestCase(uuid, cmd);
  }
}
