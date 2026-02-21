import { Language } from '../enums/language.enum';
import { ExecutionConfig } from '../interfaces/execution-config.interface';

/**
 * Runner interface for building executable code from user solution + global template
 * Each language has its own implementation
 *
 * ❌ No per-problem runner templates
 * ✅ Uses global templates driven by ExecutionConfig
 */
export interface Runner {
  /**
   * The language this runner handles
   */
  readonly language: Language;

  /**
   * Build the final executable code from user code + execution config
   * Uses global templates — NOT per-problem template strings
   *
   * @param userCode - The user's Solution class code
   * @param config - The problem's execution configuration
   * @returns Complete source code ready for Judge0 execution
   */
  build(userCode: string, config: ExecutionConfig): string;

  /**
   * Serialize the test case input to JSON string for stdin
   * @param input - The test case input object
   * @returns JSON string to be passed as stdin
   */
  serializeInput(input: Record<string, unknown>): string;
}
