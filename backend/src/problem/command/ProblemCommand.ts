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
import {
  ExecutionType,
  CompareMode,
  OutputSerializer,
} from '../../judge/interfaces/execution-config.interface';

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
 * Execution configuration DTO
 * Drives the global runner templates — NO per-problem template strings
 */
class ExecutionConfigDto {
  @IsNotEmpty()
  @IsEnum(ExecutionType)
  @ApiProperty({
    enum: ExecutionType,
    description: 'The type of problem execution',
    example: ExecutionType.FUNCTION,
  })
  type: ExecutionType;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The class name for the solution (e.g. "Solution", "LRUCache")',
    example: 'Solution',
  })
  className: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'The method name for FUNCTION type problems (e.g. "twoSum")',
    example: 'twoSum',
  })
  methodName?: string;

  @IsNotEmpty()
  @IsEnum(CompareMode)
  @ApiProperty({
    enum: CompareMode,
    description: 'How to compare actual vs expected output',
    example: CompareMode.EXACT,
  })
  compareMode: CompareMode;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Float tolerance for FLOAT_TOLERANCE compare mode',
    example: 1e-6,
    default: 1e-6,
  })
  floatTolerance?: number;

  @IsNotEmpty()
  @IsEnum(OutputSerializer)
  @ApiProperty({
    enum: OutputSerializer,
    description: 'Output serializer for special data structures',
    example: OutputSerializer.NONE,
  })
  outputSerializer: OutputSerializer;
}

/**
 * Command for creating a new problem
 *
 * ✅ Function-based, stdin/stdout, and class-design problems
 * ✅ Supports Java, Python, C++
 * ✅ executionConfig drives global runners
 * ❌ No per-problem runner templates
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
  @Type(() => ExecutionConfigDto)
  @ApiProperty({
    type: ExecutionConfigDto,
    description: 'Execution configuration (drives global runner templates)',
  })
  executionConfig: ExecutionConfigDto;

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
