/**
 * Example: Two Sum Problem Templates
 * 
 * This file shows the complete structure for a function-based problem
 * following the Judge0 Wrapper Architecture.
 * 
 * Problem: Given an array of integers nums and an integer target,
 * return indices of the two numbers such that they add up to target.
 */

import { StarterCode, RunnerTemplate } from '../interfaces';
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
 * RUNNER TEMPLATES (What Judge0 actually executes)
 * 🚨 User NEVER sees this
 * ================================================
 */
export const twoSumRunnerTemplate: RunnerTemplate = {
  // 🟦 Java Runner Template
  java: `import java.util.*;
import com.google.gson.*;

{{USER_CODE}}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.useDelimiter("\\\\A").next();

        JsonObject data = JsonParser.parseString(input).getAsJsonObject();

        int[] nums = new Gson().fromJson(data.get("nums"), int[].class);
        int target = data.get("target").getAsInt();

        Solution solution = new Solution();
        int[] result = solution.twoSum(nums, target);

        System.out.println(new Gson().toJson(result));
    }
}`,

  // 🟨 Python Runner Template
  python: `import sys, json

{{USER_CODE}}

data = json.loads(sys.stdin.read())

nums = data["nums"]
target = data["target"]

solution = Solution()
result = solution.twoSum(nums, target)

print(json.dumps(result))`,

  // 🟥 C++ Runner Template
  // ⚠️ Requires nlohmann/json.hpp (supported in Judge0 GNU++17)
  cpp: `#include <bits/stdc++.h>
#include <nlohmann/json.hpp>
using namespace std;
using json = nlohmann::json;

{{USER_CODE}}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string input((istreambuf_iterator<char>(cin)), {});
    auto data = json::parse(input);

    vector<int> nums = data["nums"].get<vector<int>>();
    int target = data["target"].get<int>();

    Solution solution;
    vector<int> result = solution.twoSum(nums, target);

    cout << json(result).dump();
}`,
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
  runnerTemplate: twoSumRunnerTemplate,
  testCases: twoSumTestCases,
  timeLimitSeconds: 2,
  memoryLimitMB: 256,
};

