import { Language } from '../enums/language.enum';
import { Runner } from './runner.interface';
import { compareOutput } from '../utils/output-comparator';

/**
 * Java Runner Implementation
 * 
 * Combines user's Solution class with the runner template
 * Uses Gson for JSON parsing/serialization
 */
export class JavaRunner implements Runner {
  readonly language = Language.JAVA;

  /**
   * Build executable Java code
   * The runner template must contain a placeholder for the Solution class
   * Template format: imports + Main class with main() method
   * User code: Solution class with the method to implement
   * 
   * @example
   * User code:
   * ```java
   * class Solution {
   *     public int[] twoSum(int[] nums, int target) {
   *         // implementation
   *         return new int[]{0, 1};
   *     }
   * }
   * ```
   * 
   * Template prepends imports and appends Main class
   */
  build(userCode: string, runnerTemplate: string): string {
    // The runner template should have {{USER_CODE}} placeholder
    // If not, we append user code before the Main class
    if (runnerTemplate.includes('{{USER_CODE}}')) {
      return runnerTemplate.replace('{{USER_CODE}}', userCode);
    }

    // Default: Insert user code before the Main class
    // Find "public class Main" and insert Solution class before it
    const mainClassIndex = runnerTemplate.indexOf('public class Main');
    if (mainClassIndex !== -1) {
      return (
        runnerTemplate.slice(0, mainClassIndex) +
        userCode +
        '\n\n' +
        runnerTemplate.slice(mainClassIndex)
      );
    }

    // Fallback: prepend user code to template
    return userCode + '\n\n' + runnerTemplate;
  }

  serializeInput(input: Record<string, unknown>): string {
    return JSON.stringify(input);
  }

  compareOutput(stdout: string, expectedOutput: unknown): boolean {
    return compareOutput(stdout, expectedOutput);
  }
}
