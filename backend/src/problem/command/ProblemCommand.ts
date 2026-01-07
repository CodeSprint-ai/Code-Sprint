import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  IsArray,
  ValidateNested,
  IsObject,
  Min,
} from 'class-validator';
import { DifficultyEnum } from '../enum/DifficultyEnum';
import { PatternEnum } from '../enum/PatternEnum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateTestCaseCommand } from './CreateTestCaseCommand';

/**
 * Starter code structure for all supported languages
 */
class StarterCodeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Java starter code (Solution class)',
    example: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // write your code here
        return new int[]{};
    }
}`,
  })
  java: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Python starter code (Solution class)',
    example: `class Solution:
    def twoSum(self, nums, target):
        # write your code here
        return []`,
  })
  python: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'C++ starter code (Solution class)',
    example: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // write your code here
        return {};
    }
};`,
  })
  cpp: string;
}

/**
 * Runner template structure for all supported languages
 * 🚨 User NEVER sees this - only for Judge0 execution
 */
class RunnerTemplateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Java runner template (imports, Main class, JSON parsing)',
  })
  java: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Python runner template (imports, JSON parsing, execution)',
  })
  python: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'C++ runner template (includes, JSON parsing with nlohmann)',
  })
  cpp: string;
}

/**
 * Command for creating a new problem
 * 
 * ✅ Function-based problems only
 * ✅ Supports Java, Python, C++
 * ❌ No JavaScript
 * ❌ No stdin-only problems
 */
export class CreateProblemCommand {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The title of the problem' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The description of the problem (supports markdown)' })
  description: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'The input format of the problem' })
  inputFormat?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'The output format of the problem' })
  outputFormat?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'The constraints of the problem' })
  constraints?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'The sample input for the problem' })
  sampleInput?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'The sample output for the problem' })
  sampleOutput?: string;

  @IsEnum(DifficultyEnum)
  @ApiProperty({
    enum: DifficultyEnum,
    description: 'The difficulty of the problem',
  })
  difficulty: DifficultyEnum;

  @IsOptional()
  @IsEnum(PatternEnum, { each: true })
  @ApiPropertyOptional({
    enum: PatternEnum,
    isArray: true,
    description: 'The patterns of the problem',
  })
  patterns?: PatternEnum[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: [String],
    description: 'Tags for the problem',
    example: ['array', 'hash-table'],
  })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: [String],
    description: 'Companies that have asked this problem',
    example: ['Google', 'Amazon', 'Meta'],
  })
  companies?: string[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => StarterCodeDto)
  @ApiProperty({
    type: StarterCodeDto,
    description: 'Starter code for each language (what user sees)',
  })
  starterCode: StarterCodeDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RunnerTemplateDto)
  @ApiProperty({
    type: RunnerTemplateDto,
    description: 'Runner templates for each language (what Judge0 executes)',
  })
  runnerTemplate: RunnerTemplateDto;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ description: 'The UUID of the user creating the problem' })
  createdByUuid: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({
    description: 'Time limit for execution in seconds',
    default: 2,
  })
  timeLimitSeconds?: number;

  @IsOptional()
  @IsNumber()
  @Min(16)
  @ApiPropertyOptional({
    description: 'Memory limit for execution in MB',
    default: 256,
  })
  memoryLimitMB?: number;

  @ValidateNested({ each: true })
  @Type(() => CreateTestCaseCommand)
  @ApiProperty({
    type: [CreateTestCaseCommand],
    description: 'An array of test cases for the problem',
  })
  testCases: CreateTestCaseCommand[];
}
