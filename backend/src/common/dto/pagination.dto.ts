import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  offset?: number;
}
