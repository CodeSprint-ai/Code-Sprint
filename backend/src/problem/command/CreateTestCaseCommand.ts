import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTestCaseCommand {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The input for the test case' })
  input: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The expected output for the test case' })
  expectedOutput: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Whether this is a sample test case',
    default: false,
  })
  isSample?: boolean;
}
