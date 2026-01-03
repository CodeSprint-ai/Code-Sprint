import { Language } from '../enums/language.enum';
import { Runner } from './runner.interface';
import { compareOutput } from '../utils/output-comparator';

/**
 * C++ Runner Implementation
 * 
 * Combines user's Solution class with the runner template
 * Uses nlohmann/json for JSON parsing/serialization
 * 
 * ⚠️ CRITICAL: C++ requires nlohmann/json.hpp
 * Judge0 supports it in GNU++17 mode
 */
export class CppRunner implements Runner {
  readonly language = Language.CPP;

  /**
   * Build executable C++ code
   * 
   * @example
   * User code:
   * ```cpp
   * class Solution {
   * public:
   *     vector<int> twoSum(vector<int>& nums, int target) {
   *         // implementation
   *         return {};
   *     }
   * };
   * ```
   * 
   * Template contains includes, using namespace, and main function
   */
  build(userCode: string, runnerTemplate: string): string {
    // The runner template should have {{USER_CODE}} placeholder
    if (runnerTemplate.includes('{{USER_CODE}}')) {
      return runnerTemplate.replace('{{USER_CODE}}', userCode);
    }

    // Default: C++ expects Solution class before main()
    // Find "int main()" and insert Solution class before it
    const mainFuncIndex = runnerTemplate.indexOf('int main()');
    if (mainFuncIndex !== -1) {
      return (
        runnerTemplate.slice(0, mainFuncIndex) +
        userCode +
        '\n\n' +
        runnerTemplate.slice(mainFuncIndex)
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
