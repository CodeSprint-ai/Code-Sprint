// components/editor/EditorHeader.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileCode, Settings, ChevronDown } from "lucide-react";

interface Props {
  language: string;
  setLanguage: (lang: string) => void;
  problem: any;
  code: string;
  onRun: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isRunning: boolean;
  hideSubmit?: boolean;
  onNext?: () => void;
  isLastQuestion?: boolean;
  sprintMode?: boolean;
  onFinishSprint?: () => void;
}

// Language icon colors
const languageColors: Record<string, string> = {
  python: "text-blue-400",
  java: "text-orange-400",
  cpp: "text-purple-400",
};

export default function EditorHeader({
  language,
  setLanguage,
  onRun,
  onSubmit,
  isSubmitting,
  isRunning,
  hideSubmit = false,
  onNext,
  isLastQuestion = false,
  sprintMode = false,
  onFinishSprint,
}: Props) {
  const isDisabled = isSubmitting || isRunning;
  const langColor = languageColors[language.toLowerCase()] || "text-blue-400";

  return (
    <div className="h-12 border-b dark:border-white/5 border-zinc-200 flex items-center justify-between px-4 dark:bg-white/[0.02] bg-zinc-50 shrink-0">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Select value={language} onValueChange={setLanguage} disabled={isDisabled}>
            <SelectTrigger className="flex items-center gap-2 text-xs font-bold dark:text-zinc-300 text-zinc-600 dark:hover:text-white hover:text-zinc-900 dark:bg-white/5 bg-zinc-100 px-3 py-1.5 h-auto rounded-lg border dark:border-white/5 border-zinc-200 dark:hover:border-white/20 hover:border-zinc-300 transition-all w-[140px]">
              <FileCode className={`w-3.5 h-3.5 ${langColor}`} />
              <SelectValue placeholder="Language" />
              <ChevronDown className="w-3 h-3 text-zinc-500 ml-auto" />
            </SelectTrigger>
            <SelectContent className="dark:bg-zinc-900 bg-white border dark:border-white/10 border-zinc-200">
              <SelectItem value="python" className="dark:text-zinc-200 text-zinc-700 dark:focus:bg-white/10 focus:bg-zinc-100 dark:focus:text-white focus:text-zinc-900">
                Python
              </SelectItem>
              <SelectItem value="java" className="dark:text-zinc-200 text-zinc-700 dark:focus:bg-white/10 focus:bg-zinc-100 dark:focus:text-white focus:text-zinc-900">
                Java
              </SelectItem>
              <SelectItem value="cpp" className="dark:text-zinc-200 text-zinc-700 dark:focus:bg-white/10 focus:bg-zinc-100 dark:focus:text-white focus:text-zinc-900">
                C++
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* <button className="p-2 dark:hover:bg-white/10 hover:bg-zinc-200 rounded-lg dark:text-zinc-500 text-zinc-600 dark:hover:text-white hover:text-zinc-900 transition-colors">
          <Settings className="w-4 h-4" />
        </button> */}

        {!hideSubmit && (
          <Button
            onClick={onSubmit}
            disabled={isDisabled}
            className="px-4 py-1.5 h-auto bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-bold rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        )}

        {hideSubmit && onNext && (
          <Button
            onClick={onNext}
            disabled={isLastQuestion}
            className="px-4 py-1.5 h-auto bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-bold rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
          >
            {isLastQuestion ? "Last Question" : "Next Question →"}
          </Button>
        )}

        {sprintMode && onFinishSprint && (
          <Button
            onClick={onFinishSprint}
            className="px-4 py-1.5 h-auto bg-red-600 text-white hover:bg-red-500 text-xs font-bold rounded-lg transition-colors shadow-lg shadow-red-900/20"
          >
            Finish Sprint
          </Button>
        )}
      </div>
    </div>
  );
}
