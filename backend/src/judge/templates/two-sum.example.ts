/**
 * Example: Two Sum Problem Configuration
 *
 * This file shows the complete structure for a function-based problem
 * using the new ExecutionConfig-driven judge system.
 *
 * Problem: Given an array of integers nums and an integer target,
 * return indices of the two numbers such that they add up to target.
 */

import { StarterCode } from '../interfaces';
import {
  ExecutionConfig,
  ExecutionType,
  CompareMode,
  OutputSerializer,
} from '../interfaces/execution-config.interface';
import { CreateTestCaseCommand } from '../../problem/command/CreateTestCaseCommand';

/**
 * ============================================
 * STARTER CODE (What the USER sees in editor)
 * ============================================
 */
export const twoSumStarterCode: StarterCode = {
  // 🟦 Java Starter Code
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // write your code here
        return new int[]{};
    }
}`,

  // 🟨 Python Starter Code
  python: `class Solution:
    def twoSum(self, nums, target):
        # write your code here
        return []`,

  // 🟥 C++ Starter Code
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // write your code here
        return {};
    }
};`,
};

/**
 * ================================================
 * EXECUTION CONFIG (Drives global runner templates)
 * ❌ No per-problem runner template strings
 * ✅ Global templates generate code from this config
 * ================================================
 */
export const twoSumExecutionConfig: ExecutionConfig = {
  type: ExecutionType.FUNCTION,
  className: 'Solution',
  methodName: 'twoSum',
  compareMode: CompareMode.ORDER_INSENSITIVE,
  outputSerializer: OutputSerializer.NONE,
};

/**
 * ============================================
 * TEST CASES (JSON format, language-agnostic)
 * ============================================
 */
export const twoSumTestCases: CreateTestCaseCommand[] = [
  {
    input: { nums: [2, 7, 11, 15], target: 9 },
    expectedOutput: [0, 1],
    isHidden: false,
  },
  {
    input: { nums: [3, 2, 4], target: 6 },
    expectedOutput: [1, 2],
    isHidden: false,
  },
  {
    input: { nums: [3, 3], target: 6 },
    expectedOutput: [0, 1],
    isHidden: true, // Hidden test case
  },
];

/**
 * ============================================
 * COMPLETE PROBLEM CREATION EXAMPLE
 * ============================================
 */
export const twoSumProblemData = {
  title: 'Two Sum',
  description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

## Example 1:
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

## Example 2:
\`\`\`
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

## Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
  difficulty: 'EASY',
  tags: ['array', 'hash-table'],
  companies: ['Google', 'Amazon', 'Apple', 'Meta', 'Microsoft'],
  starterCode: twoSumStarterCode,
  executionConfig: twoSumExecutionConfig,
  testCases: twoSumTestCases,
  timeLimitSeconds: 2,
  memoryLimitMB: 256,
};
