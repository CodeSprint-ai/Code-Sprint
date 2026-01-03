import { IsNotEmpty, IsOptional, IsBoolean, IsObject, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Command for creating a test case
 * 
 * ✅ JSON input format (language-agnostic) - preferred
 * ✅ Legacy text input - for backward compatibility
 * ✅ JSON expected output
 */
export class CreateTestCaseCommand {
  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ 
    description: 'The input for the test case as JSON object (preferred)',
    example: { nums: [2, 7, 11, 15], target: 9 },
  })
  input?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ 
    description: 'Legacy text input (for backward compatibility)',
    example: '2 7 11 15\n9',
  })
  inputText?: string;

  @IsOptional()
  @ApiPropertyOptional({ 
    description: 'The expected output for the test case (any JSON-serializable value)',
    example: [0, 1],
  })
  expectedOutput?: unknown;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ 
    description: 'Legacy text expected output (for backward compatibility)',
    example: '0 1',
  })
  expectedOutputText?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Whether this is a sample test case (shown to users)',
    default: false,
  })
  isSample?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Whether this test case should be hidden from users',
    default: false,
  })
  isHidden?: boolean;
}
