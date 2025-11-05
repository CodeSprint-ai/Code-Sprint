import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DifficultyEnum } from '../enum/DifficultyEnum';
import { TestCase } from '../entities/TestCase';
import { Problem } from '../entities/Problem';
import { User } from 'src/user/entities/user.model';
import { UserDto } from 'src/user/dto/user.dto';

// DTO for a single test case
export class TestCaseDto {
  @ApiProperty({ description: 'The UUID of the test case' })
  uuid: string;

  @ApiProperty({ description: 'The input for the test case' })
  input: string;

  @ApiProperty({ description: 'The expected output of the test case' })
  expectedOutput: string;

  @ApiProperty({ description: 'Whether this is a sample test case' })
  isSample: boolean;

  @ApiProperty({ description: 'The creation date of the test case' })
  createdAt: Date;

  public static toDto(testCase: TestCase): TestCaseDto {
    return {
      uuid: testCase.uuid,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      isSample: testCase.isSample,
      createdAt: testCase.createdAt,
    };
  }
}
