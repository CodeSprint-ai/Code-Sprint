import { ProblemCard } from "@/components/ProblemCard";
import React from "react";

// Define strict types to match ProblemCardProps
type Difficulty = "Easy" | "Medium" | "Hard";
type Trend = "High" | "Medium" | "Low";
type IconType = "check" | "clock" | "code";

interface ProblemCardProps {
  id: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  completion: number;
  tags: string[];
  trend: Trend;
  trendStats: { correct: number; wrong: number };
  iconType: IconType;
  starred?: boolean;
}

const problemsData: ProblemCardProps[] = [
  {
    id: 1,
    title: "Two Sum",
    description: "Given an array of integers, return indices ...",
    difficulty: "Easy",
    completion: 54.3,
    tags: ["Array", "Hash Table"],
    trend: "High",
    trendStats: { correct: 1247, wrong: 45 },
    iconType: "check",
  },
  {
    id: 2,
    title: "Add Two Numbers",
    description: "Add two numbers represented as linked...",
    difficulty: "Medium",
    completion: 40.8,
    tags: ["Linked List", "Math"],
    trend: "Medium",
    trendStats: { correct: 892, wrong: 78 },
    iconType: "clock",
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    description: "Find the length of the longest substring ...",
    difficulty: "Medium",
    completion: 35.6,
    tags: ["Hash Table", "String"],
    trend: "High",
    trendStats: { correct: 1456, wrong: 123 },
    iconType: "code",
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    description: "Find the median of two sorted arrays with...",
    difficulty: "Hard",
    completion: 38.2,
    tags: ["Array", "Binary Search"],
    trend: "Low",
    trendStats: { correct: 678, wrong: 234 },
    iconType: "code",
    starred: true,
  },
];

const Problems = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {problemsData.map((problem) => (
        <ProblemCard key={problem.id} {...problem} />
      ))}
    </div>
  );
};

export default Problems;
