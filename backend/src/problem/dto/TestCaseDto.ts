// dto/test-case.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { TestCase } from "../entities/TestCase"

export class TestCaseDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  input: string;

  @ApiProperty()
  expectedOutput: string;

  @ApiProperty()
  isSample: boolean;

  @ApiProperty()
  createdAt: Date;

  static toDto(testCase: TestCase): TestCaseDto {

    const dto = new TestCaseDto();
    dto.uuid = testCase.uuid;
    dto.input = testCase.input;
    dto.expectedOutput = testCase.expectedOutput;
    dto.isSample = testCase.isSample;
    dto.createdAt = testCase.createdAt;
    return dto;

  }
}
