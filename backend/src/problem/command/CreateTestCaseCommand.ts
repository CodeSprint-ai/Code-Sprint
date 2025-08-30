// commands/create-test-case.command.ts
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateTestCaseCommand {
  @IsNotEmpty()
  input: string;

  @IsNotEmpty()
  expectedOutput: string;

  @IsBoolean()
  isSample: boolean;
}
