
// DTO for a problem, including its test cases
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DifficultyEnum } from '../enum/DifficultyEnum';
import { UserDto } from '../../user/dto/user.dto';
import { TestCaseDto } from './TestCaseDto';
import { Problem } from '../entities/Problem';

export class ProblemDto {
  @ApiProperty({ description: 'The UUID of the problem' })
  uuid: string;

  @ApiProperty({ description: 'The title of the problem' })
  title: string;

  @ApiProperty({ description: 'The unique slug for the problem' })
  slug: string;

  @ApiProperty({ description: 'The description of the problem' })
  description: string;

  @ApiPropertyOptional({ description: 'The input format of the problem' })
  inputFormat?: string;

  @ApiPropertyOptional({ description: 'The output format of the problem' })
  outputFormat?: string;

  @ApiPropertyOptional({ description: 'The constraints of the problem' })
  constraints?: string;

  @ApiPropertyOptional({ description: 'The sample input for the problem' })
  sampleInput?: string;

  @ApiPropertyOptional({ description: 'The sample output for the problem' })
  sampleOutput?: string;

  @ApiProperty({
    enum: DifficultyEnum,
    description: 'The difficulty of the problem',
  })
  difficulty: DifficultyEnum;

  @ApiProperty({ type: [String], description: 'Tags for the problem' })
  tags: string[];

  @ApiPropertyOptional({ description: 'Time limit for execution in seconds' })
  timeLimitSeconds?: number;

  @ApiPropertyOptional({ description: 'Memory limit for execution in MB' })
  memoryLimitMB?: number;

  @ApiPropertyOptional({ description: 'The user who created the problem' })
  createdBy: UserDto | null;

  @ApiProperty({
    type: [TestCaseDto],
    description: 'An array of test cases for the problem',
  })
  testCases: TestCaseDto[];

  @ApiProperty({ description: 'The creation date of the problem' })
  createdAt: Date;

  @ApiProperty({ description: 'The last update date of the problem' })
  updatedAt: Date;

  public static toDto(problem: Problem): ProblemDto {
    return {
      uuid: problem.uuid,
      title: problem.title,
      slug: problem.slug,
      description: problem.description,
      inputFormat: problem.inputFormat,
      outputFormat: problem.outputFormat,
      constraints: problem.constraints,
      sampleInput: problem.sampleInput,
      sampleOutput: problem.sampleOutput,
      difficulty: problem.difficulty,
      tags: problem.tags,
      timeLimitSeconds: problem.timeLimitSeconds,
      memoryLimitMB: problem.memoryLimitMB,
      createdBy: problem.createdBy ? UserDto.toDto(problem.createdBy) : null,
      testCases: problem.testCases?.map((testCase) =>
        TestCaseDto.toDto(testCase),
      ),
      createdAt: problem.createdAt,
      updatedAt: problem.updatedAt,
    };
  }
}
