import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SprintSolutionDto {
  @IsNotEmpty()
  @IsString()
  problemId: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  language: string;
}

export class FinishSprintDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SprintSolutionDto)
  solutions?: SprintSolutionDto[];
}
