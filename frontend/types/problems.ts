// src/types/problem.ts

// interface ProblemCardProps {
//   id: number;
//   title: string;
//   description: string;
//   difficulty: Difficulty;
//   completion: number;
//   tags: string[];
//   trend: Trend;
//   trendStats: { correct: number; wrong: number };
//   iconType: IconType;
//   starred?: boolean;
// }

export enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}


type IconType = "check" | "clock" | "code";

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
  type?:IconType // code with timer or simple code    both will come from backend
  starred?:boolean // making it like favorite or like saving it to do that later.
  tags: string[];
  timeLimitSeconds?: number;
  memoryLimitMB?: number;
  createdBy?: {
    userUuid: string;
    email: string;
    name: string;
  };
  testCases?: {
    uuid: string;
    input: string;
    expectedOutput: string;
    isSample: boolean;
    createdAt: string;
  }[];
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