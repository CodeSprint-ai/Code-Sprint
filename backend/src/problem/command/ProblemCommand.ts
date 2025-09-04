// commands/create-problem.command.ts
import { IsArray, IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { DifficultyEnum } from "../enum/DifficultyEnum"
import { User } from '../../user/entities/user.model';

export class ProblemCommand {
  @IsNotEmpty()
  @Length(3, 255)
  title: string;

  @IsNotEmpty()
  slug: string;

  @IsNotEmpty()
  description: string;

  @IsEnum(DifficultyEnum)
  difficulty: DifficultyEnum;

  @IsOptional()
  inputFormat?: string;

  @IsOptional()
  outputFormat?: string;

  @IsOptional()
  constraints?: string;

  @IsOptional()
  sampleInput?: string;

  @IsOptional()
  sampleOutput?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsOptional()
  createdBy?: User;
}
