import { ApiProperty } from '@nestjs/swagger';
import { TestCase } from '../entities/TestCase';

/**
 * DTO for a single test case
 * 
 * ✅ JSON input format
 * ✅ JSON expected output
 * ✅ isHidden flag for test visibility
 */
export class TestCaseDto {
  @ApiProperty({ description: 'The UUID of the test case' })
  uuid: string;

  @ApiProperty({ 
    description: 'The input for the test case as JSON object',
    example: { nums: [2, 7, 11, 15], target: 9 },
  })
  input: Record<string, unknown>;

  @ApiProperty({ 
    description: 'The expected output of the test case (JSON-serializable)',
    example: [0, 1],
  })
  expectedOutput: unknown;

  @ApiProperty({ 
    description: 'Whether this is a sample test case',
    default: false,
  })
  isSample: boolean;

  @ApiProperty({ 
    description: 'Whether this test case is hidden from users',
    default: false,
  })
  isHidden: boolean;

  @ApiProperty({ description: 'The creation date of the test case' })
  createdAt: Date;

  public static toDto(testCase: TestCase): TestCaseDto {
    return {
      uuid: testCase.uuid,
      input: testCase.getInput(),
      expectedOutput: testCase.getExpectedOutput(),
      isSample: testCase.isSample,
      isHidden: testCase.isHidden,
      createdAt: testCase.createdAt,
    };
  }

  /**
   * Convert to DTO with hidden test case details obscured
   * Used when returning results to users
   */
  public static toPublicDto(testCase: TestCase): TestCaseDto {
    if (testCase.isHidden) {
      return {
        uuid: testCase.uuid,
        input: {},
        expectedOutput: null,
        isSample: false,
        isHidden: true,
        createdAt: testCase.createdAt,
      };
    }
    return this.toDto(testCase);
  }
}
