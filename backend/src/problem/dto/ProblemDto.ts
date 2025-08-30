// dto/problem.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Problem } from "../entities/Problem"
import { TestCaseDto } from './TestCaseDto'
import { DifficultyEnum } from '../enum/DifficultyEnum';

export class ProblemDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  inputFormat?: string;

  @ApiProperty()
  outputFormat?: string;

  @ApiProperty()
  constraints?: string;

  @ApiProperty()
  sampleInput?: string;

  @ApiProperty()
  sampleOutput?: string;

  @ApiProperty()
  difficulty: DifficultyEnum;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  createdBy?: string;

  @ApiProperty({ type: [TestCaseDto] })
  testCases: TestCaseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  public static toDto(problem: Problem): ProblemDto {
    const dto : ProblemDto = new ProblemDto();
    dto.uuid = problem.uuid;
    dto.title = problem.title;
    dto.slug = problem.slug;
    dto.description = problem.description;
    dto.inputFormat = problem.inputFormat;
    dto.outputFormat = problem.outputFormat;
    dto.constraints = problem.constraints;
    dto.sampleInput = problem.sampleInput;
    dto.sampleOutput = problem.sampleOutput;
    dto.difficulty = problem.difficulty;
    dto.tags = problem.tags;
    dto.createdAt = problem.createdAt;
    dto.updatedAt = problem.updatedAt;

    if (problem.testCases) {
      dto.testCases = problem.testCases.map((testCase) => TestCaseDto.toDto(testCase));
    }

    return dto;
  }
}
