import z from "zod";

// Starter code schema for all languages
const starterCodeSchema = z.object({
  java: z.string().min(1, "Java starter code is required"),
  python: z.string().min(1, "Python starter code is required"),
  cpp: z.string().min(1, "C++ starter code is required"),
});

// Runner template schema (same structure as starter code)
const runnerTemplateSchema = z.object({
  java: z.string().min(1, "Java runner template is required"),
  python: z.string().min(1, "Python runner template is required"),
  cpp: z.string().min(1, "C++ runner template is required"),
});

// Test case schema - supports both JSON and text input
const testCaseSchema = z.object({
  // JSON input (preferred) - user enters as JSON string, we parse it
  input: z.union([z.record(z.unknown()), z.string()]).optional(),
  // Text input for backward compatibility
  inputText: z.string().optional(),
  // JSON expected output
  expectedOutput: z.unknown().optional(),
  // Text expected output for backward compatibility
  expectedOutputText: z.string().optional(),
  // Whether this is a sample test case
  isSample: z.boolean().optional().default(false),
  // Whether this is hidden
  isHidden: z.boolean().optional().default(false),
});

export const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  inputFormat: z.string().optional(),
  outputFormat: z.string().optional(),
  constraints: z.string().optional(),
  sampleInput: z.string().optional(),
  sampleOutput: z.string().optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).default([]),
  companies: z.array(z.string()).default([]),
  createdByUuid: z.string().uuid(),
  timeLimitSeconds: z.number().min(1).default(2),
  memoryLimitMB: z.number().min(16).default(256),
  starterCode: starterCodeSchema,
  runnerTemplate: runnerTemplateSchema,
  testCases: z.array(testCaseSchema).min(1, "At least one test case is required"),
});

export type ProblemFormValues = z.infer<typeof problemSchema>;
export type StarterCodeValues = z.infer<typeof starterCodeSchema>;
export type TestCaseValues = z.infer<typeof testCaseSchema>;

// Default starter code templates
export const defaultStarterCode: StarterCodeValues = {
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // write your code here
        return new int[]{};
    }
}`,
  python: `class Solution:
    def twoSum(self, nums, target):
        # write your code here
        return []`,
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // write your code here
        return {};
    }
};`,
};

// Default runner templates
export const defaultRunnerTemplate: StarterCodeValues = {
  java: `import java.util.*;
import com.google.gson.*;

{{USER_CODE}}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.useDelimiter("\\\\A").next();

        JsonObject data = JsonParser.parseString(input).getAsJsonObject();

        // TODO: Parse input fields here
        // int[] nums = new Gson().fromJson(data.get("nums"), int[].class);
        // int target = data.get("target").getAsInt();

        Solution solution = new Solution();
        // TODO: Call solution method and print result
        // int[] result = solution.twoSum(nums, target);
        // System.out.println(new Gson().toJson(result));
    }
}`,
  python: `import sys, json

{{USER_CODE}}

data = json.loads(sys.stdin.read())

# TODO: Parse input fields here
# nums = data["nums"]
# target = data["target"]

solution = Solution()
# TODO: Call solution method and print result
# result = solution.twoSum(nums, target)
# print(json.dumps(result))`,
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

    // TODO: Parse input fields here
    // vector<int> nums = data["nums"].get<vector<int>>();
    // int target = data["target"].get<int>();

    Solution solution;
    // TODO: Call solution method and print result
    // vector<int> result = solution.twoSum(nums, target);
    // cout << json(result).dump();
}`,
};

/**
 * Helper to parse test case input from form
 * Tries to parse as JSON, falls back to text
 */
export function parseTestCaseInput(inputStr: string): Record<string, unknown> | null {
  if (!inputStr || inputStr.trim() === "") return null;
  
  try {
    const parsed = JSON.parse(inputStr);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed;
    }
    return { value: parsed };
  } catch {
    // Not valid JSON, return as text
    return null;
  }
}

/**
 * Helper to parse expected output from form
 */
export function parseExpectedOutput(outputStr: string): unknown {
  if (!outputStr || outputStr.trim() === "") return null;
  
  try {
    return JSON.parse(outputStr);
  } catch {
    return outputStr;
  }
}
