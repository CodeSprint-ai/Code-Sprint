// create-submission.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class SubmissionCommand {
  @IsOptional()
  @IsUUID()
  problemUuid?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  language: string; // e.g. 'python', 'cpp', 'c++'
}
