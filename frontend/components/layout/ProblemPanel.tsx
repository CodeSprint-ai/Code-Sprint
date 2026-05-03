// components/layout/ProblemPanel.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProblemDescription from "../ProblemDescription";
import { Problem } from "@/types/problems";

interface ProblemPanelProps {
  problem: Problem;
  basePath?: string;
}

// Difficulty color mapping
const difficultyStyles: Record<string, string> = {
  EASY: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  MEDIUM: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  HARD: "bg-red-500/10 border-red-500/20 text-red-400",
};

export default function ProblemPanel({ problem, basePath = "/problems" }: ProblemPanelProps) {
  const difficultyClass = difficultyStyles[problem.difficulty?.toUpperCase()] || difficultyStyles.MEDIUM;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Bar */}
      <div className="h-12 border-b dark:border-white/5 border-zinc-200 flex items-center justify-between px-4 dark:bg-white/[0.02] bg-zinc-50 shrink-0">
        <Link
          href={basePath}
          className="flex items-center gap-1 text-xs font-bold dark:text-zinc-500 text-zinc-600 dark:hover:text-white hover:text-zinc-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          All Problems
        </Link>
        <div className="flex items-center gap-1">
          <button className="p-1.5 dark:hover:bg-white/10 hover:bg-zinc-200 rounded-lg dark:text-zinc-500 text-zinc-600 dark:hover:text-white hover:text-zinc-900 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1.5 dark:hover:bg-white/10 hover:bg-zinc-200 rounded-lg dark:text-zinc-500 text-zinc-600 dark:hover:text-white hover:text-zinc-900 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {/* Title */}
        <h1 className="text-2xl font-bold dark:text-white text-zinc-900 mb-4">{problem.title}</h1>

        {/* Difficulty & Tags */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wide ${difficultyClass}`}>
            {problem.difficulty || "Medium"}
          </span>
          {problem.tags && problem.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {problem.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded dark:bg-white/5 bg-zinc-100 dark:text-zinc-500 text-zinc-600 text-[10px] font-mono border dark:border-white/5 border-zinc-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-6 text-sm dark:text-zinc-300 text-zinc-700 leading-relaxed mb-8">
          <p>{problem.description}</p>
        </div>

        {/* Problem Details (Examples, Constraints, Companies) */}
        <ProblemDescription problem={problem} />
      </div>
    </div>
  );
}