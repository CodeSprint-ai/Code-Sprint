export interface User {
  name: string;
  avatar: string;
  rank: number;
  xp: number;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'Solved' | 'Attempted' | 'Todo';
  tags: string[];
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  SUBMISSIONS = 'SUBMISSIONS',
  PROBLEMS = 'PROBLEMS',
  CONTEST = 'CONTEST',
  PROFILE = 'PROFILE',
  SPRINT = 'SPRINT',
  PROBLEM_WORKSPACE = 'PROBLEM_WORKSPACE'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}