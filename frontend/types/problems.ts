// src/types/problem.ts

export enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

type IconType = "check" | "clock" | "code";

/**
 * Starter code structure for all supported languages
 */
export interface StarterCode {
  java: string;
  python: string;
  cpp: string;
}

/**
 * Test case structure - now uses JSON for input/output
 */
export interface TestCase {
  uuid: string;
  /** JSON input object for function-based problems */
  input: Record<string, unknown>;
  /** Legacy text input (for backward compatibility) */
  inputText?: string;
  /** JSON expected output */
  expectedOutput: unknown;
  /** Legacy text expected output */
  expectedOutputText?: string;
  /** Whether this is a sample test case */
  isSample: boolean;
  /** Whether this test case is hidden from users */
  isHidden: boolean;
  createdAt: string;
}

export interface Problem {
  uuid: string;
  title: string;
  slug: string;
  description: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  sampleInput?: string;
  sampleOutput?: string;
  difficulty: Difficulty;
  type?: IconType; // code with timer or simple code
  starred?: boolean; // favorite/save for later
  tags: string[];
  companies?: string[];
  /** Starter code for each language (what user sees in editor) */
  starterCode?: StarterCode;
  timeLimitSeconds?: number;
  memoryLimitMB?: number;
  createdBy?: {
    userUuid: string;
    email: string;
    name: string;
  };
  testCases?: TestCase[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProblemCardProps extends Problem {
  index: number;
}

export interface ProblemsResponse {
  data: Problem[];
  message: string;
  httpStatusCode: number;
  isSuccess: boolean;
}

export interface ProblemResponse {
  data: Problem;
  message: string;
  httpStatusCode: number;
  isSuccess: boolean;
}

export interface CreateProblemInput {
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: string[];
  companies?: string[];
  starterCode: StarterCode;
  runnerTemplate: StarterCode;
  testCases: {
    input: Record<string, unknown>;
    expectedOutput: unknown;
    isSample?: boolean;
    isHidden?: boolean;
  }[];
}

export interface ProblemStore {
  isAddProblemPopupForm: boolean;
  setIsAddProblemPopupForm: (isAddProblemPopupForm: boolean) => void;
}

/**
 * Helper function to format test case input for display
 */
export function formatTestCaseInput(testCase: TestCase): string {
  // Prefer JSON input, fall back to text
  if (testCase.input && Object.keys(testCase.input).length > 0) {
    return JSON.stringify(testCase.input, null, 2);
  }
  if (testCase.inputText) {
    return testCase.inputText;
  }
  return '';
}

/**
 * Helper function to format test case output for display
 */
export function formatTestCaseOutput(testCase: TestCase): string {
  // Prefer JSON output, fall back to text
  if (testCase.expectedOutput !== null && testCase.expectedOutput !== undefined) {
    return typeof testCase.expectedOutput === 'string' 
      ? testCase.expectedOutput 
      : JSON.stringify(testCase.expectedOutput, null, 2);
  }
  if (testCase.expectedOutputText) {
    return testCase.expectedOutputText;
  }
  return '';
}
