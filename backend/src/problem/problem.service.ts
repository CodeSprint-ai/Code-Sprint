// services/problem.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Problem } from './entities/Problem';
import { TestCase } from './entities/TestCase';
import { ProblemCommand } from './command/ProblemCommand';
import { CreateTestCaseCommand } from './command/CreateTestCaseCommand';
import { ProblemDto } from './dto/ProblemDto';
import { TestCaseDto } from './dto/TestCaseDto';

@Injectable()
export class ProblemService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepo: Repository<Problem>,

    @InjectRepository(TestCase)
    private readonly testCaseRepo: Repository<TestCase>,
  ) {}

  async createProblem(cmd: ProblemCommand): Promise<ProblemDto> {
    const problem = this.problemRepo.create(cmd);
    await this.problemRepo.save(problem);
    return ProblemDto.toDto(problem);
  }

  async getProblem(uuid: string): Promise<ProblemDto> {
    const problem = await this.problemRepo.findOne({
      where: { uuid },
      relations: ['testCases'],
    });

    if (!problem) throw new NotFoundException(`Problem ${uuid} not found`);
    return ProblemDto.toDto(problem);
  }

  async listProblems(): Promise<ProblemDto[]> {
    const problems = await this.problemRepo.find();
    return problems.map(ProblemDto.toDto);
  }

  async updateProblem(
    uuid: string,
    cmd: Partial<ProblemCommand>,
  ): Promise<ProblemDto> {
    const problem = await this.problemRepo.findOne({ where: { uuid } });
    if (!problem) throw new NotFoundException(`Problem ${uuid} not found`);
    Object.assign(problem, cmd);
    await this.problemRepo.save(problem);
    return ProblemDto.toDto(problem);
  }

  async deleteProblem(uuid: string): Promise<void> {
    const result = await this.problemRepo.delete({ uuid });
    if (!result.affected)
      throw new NotFoundException(`Problem ${uuid} not found`);
  }

  async addTestCase(
    problemUuid: string,
    cmd: CreateTestCaseCommand,
  ): Promise<TestCaseDto> {
    const problem = await this.problemRepo.findOne({
      where: { uuid: problemUuid },
    });
    if (!problem)
      throw new NotFoundException(`Problem ${problemUuid} not found`);

    const testCase = this.testCaseRepo.create({ ...cmd, problem });
    await this.testCaseRepo.save(testCase);
    return TestCaseDto.toDto(testCase);
  }
}
