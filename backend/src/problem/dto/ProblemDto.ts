import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DifficultyEnum } from '../enum/DifficultyEnum';
import { PatternEnum } from '../enum/PatternEnum';
import { UserDto } from '../../user/dto/user.dto';
import { TestCaseDto } from './TestCaseDto';
import { Problem } from '../entities/Problem';
import { StarterCode, RunnerTemplate } from '../../judge/interfaces/starter-code.interface';

/**
 * DTO for a problem
 * 
 * ✅ Function-based problems only
 * ✅ Supports Java, Python, C++
 * ✅ Contains starter code (what user sees)
 * 🚨 Runner templates are NEVER exposed to users in public DTO
 */
export class ProblemDto {
  @ApiProperty({ description: 'The UUID of the problem' })
  uuid: string;

  @ApiProperty({ description: 'The title of the problem' })
  title: string;

  @ApiProperty({ description: 'The unique slug for the problem' })
  slug: string;

  @ApiProperty({ description: 'The description of the problem (markdown supported)' })
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

  @ApiProperty({
    enum: PatternEnum,
    isArray: true,
    description: 'The patterns of the problem',
  })
  patterns: PatternEnum[];

  @ApiProperty({ type: [String], description: 'Tags for the problem' })
  tags: string[];

  @ApiProperty({ type: [String], description: 'Companies that have asked this problem' })
  companies: string[];

  @ApiProperty({
    description: 'Starter code for each language (what user sees in editor)',
  })
  starterCode: StarterCode;

  @ApiPropertyOptional({ description: 'Time limit for execution in seconds' })
  timeLimitSeconds?: number;

  @ApiPropertyOptional({ description: 'Memory limit for execution in MB' })
  memoryLimitMB?: number;

  @ApiPropertyOptional({ description: 'The user who created the problem' })
  createdBy: UserDto | null;

  @ApiProperty({
    type: [TestCaseDto],
    description: 'An array of test cases for the problem (hidden cases have obscured details)',
  })
  testCases: TestCaseDto[];

  @ApiProperty({ description: 'The creation date of the problem' })
  createdAt: Date;

  @ApiProperty({ description: 'The last update date of the problem' })
  updatedAt: Date;

  /**
   * Convert Problem entity to public DTO
   * 🚨 Runner templates are NEVER included - only for internal use
   */
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
      patterns: problem.patterns ?? [],
      tags: problem.tags ?? [],
      companies: problem.companies ?? [],
      starterCode: problem.starterCode,
      timeLimitSeconds: problem.timeLimitSeconds,
      memoryLimitMB: problem.memoryLimitMB,
      createdBy: problem.createdBy ? UserDto.toDto(problem.createdBy) : null,
      testCases: problem.testCases?.map((testCase) =>
        TestCaseDto.toPublicDto(testCase),
      ) ?? [],
      createdAt: problem.createdAt,
      updatedAt: problem.updatedAt,
    };
  }

  /**
   * Convert Problem entity to admin DTO (includes all details)
   * Used only for admin endpoints
   */
  public static toAdminDto(problem: Problem): ProblemDto & { runnerTemplate: RunnerTemplate } {
    return {
      ...this.toDto(problem),
      testCases: problem.testCases?.map((testCase) =>
        TestCaseDto.toDto(testCase),
      ) ?? [],
      runnerTemplate: problem.runnerTemplate,
    };
  }
}
