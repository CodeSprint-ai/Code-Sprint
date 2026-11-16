import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
export class PublicProblemsQueryDto {
  @IsOptional() @IsString() @MaxLength(100) search?: string;
  @IsOptional() @IsIn(['EASY', 'MEDIUM', 'HARD']) difficulty?:
    | 'EASY'
    | 'MEDIUM'
    | 'HARD';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50) pageSize: number =
    12;
}
