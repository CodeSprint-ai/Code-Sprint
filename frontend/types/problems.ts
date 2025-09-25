// src/types/problem.ts
export interface Problem {
  uuid: string;
  title: string;
  slug: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: string[];
  timeLimitSeconds: number;
  memoryLimitMB: number;
  createdBy: {
    userUuid: string;
    email: string;
    name: string;
  };
  testCases: {
    uuid: string;
    input: string;
    expectedOutput: string;
    isSample: boolean;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
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
  // slug: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: string[];
}


export interface ProblemStore {
 isAddProblemPopupForm:boolean
 setIsAddProblemPopupForm:(isAddProblemPopupForm:boolean)=> void;
}