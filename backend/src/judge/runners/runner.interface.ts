import { Language } from '../enums/language.enum';

/**
 * Runner interface for building executable code from user solution + template
 * Each language has its own implementation
 */
export interface Runner {
  /**
   * The language this runner handles
   */
  readonly language: Language;

  /**
   * Build the final executable code by combining user's solution with runner template
   * @param userCode - The user's Solution class code
   * @param runnerTemplate - The template that wraps the Solution class
   * @returns Complete source code ready for Judge0 execution
   */
  build(userCode: string, runnerTemplate: string): string;

  /**
   * Serialize the test case input to JSON string for stdin
   * @param input - The test case input object
   * @returns JSON string to be passed as stdin
   */
  serializeInput(input: Record<string, unknown>): string;

  /**
   * Parse the stdout from Judge0 and compare with expected output
   * @param stdout - Raw stdout from Judge0
   * @param expectedOutput - Expected output value
   * @returns Whether the outputs match
   */
  compareOutput(stdout: string, expectedOutput: unknown): boolean;
}

