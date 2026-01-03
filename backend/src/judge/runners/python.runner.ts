import { Language } from '../enums/language.enum';
import { Runner } from './runner.interface';
import { compareOutput } from '../utils/output-comparator';

/**
 * Python Runner Implementation
 * 
 * Combines user's Solution class with the runner template
 * Uses built-in json module for parsing/serialization
 */
export class PythonRunner implements Runner {
  readonly language = Language.PYTHON;

  /**
   * Build executable Python code
   * 
   * @example
   * User code:
   * ```python
   * class Solution:
   *     def twoSum(self, nums, target):
   *         # implementation
   *         return [0, 1]
   * ```
   * 
   * Template contains imports and main execution logic
   */
  build(userCode: string, runnerTemplate: string): string {
    // The runner template should have {{USER_CODE}} placeholder
    if (runnerTemplate.includes('{{USER_CODE}}')) {
      return runnerTemplate.replace('{{USER_CODE}}', userCode);
    }

    // Default: Python expects Solution class to be defined first
    // Find "import sys" or "import json" and insert after imports
    const importJsonMatch = runnerTemplate.match(/^(import\s+.*\n)+/m);
    if (importJsonMatch) {
      const importEnd = importJsonMatch.index! + importJsonMatch[0].length;
      return (
        runnerTemplate.slice(0, importEnd) +
        '\n' +
        userCode +
        '\n' +
        runnerTemplate.slice(importEnd)
      );
    }

    // Fallback: prepend user code
    return userCode + '\n\n' + runnerTemplate;
  }

  serializeInput(input: Record<string, unknown>): string {
    return JSON.stringify(input);
  }

  compareOutput(stdout: string, expectedOutput: unknown): boolean {
    return compareOutput(stdout, expectedOutput);
  }
}
