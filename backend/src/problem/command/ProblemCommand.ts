// commands/create-problem.command.ts
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { DifficultyEnum } from '../enum/DifficultyEnum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateTestCaseCommand } from './CreateTestCaseCommand';

export class CreateProblemCommand {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The title of the problem' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The description of the problem' })
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
  @ApiPropertyOptional({
    type: [String],
    description: 'Tags for the problem',
  })
  tags?: string[];

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ description: 'The UUID of the user creating the problem' })
  createdByUuid: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Time limit for execution in seconds',
    default: 2,
  })
  timeLimitSeconds?: number;

  @IsOptional()
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
