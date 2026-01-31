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
}: Props) {
  const isDisabled = isSubmitting || isRunning;
  const langColor = languageColors[language.toLowerCase()] || "text-blue-400";

  return (
    <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-white/[0.02] shrink-0">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Select value={language} onValueChange={setLanguage} disabled={isDisabled}>
            <SelectTrigger className="flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-white bg-white/5 px-3 py-1.5 h-auto rounded-lg border border-white/5 hover:border-white/20 transition-all w-[140px]">
              <FileCode className={`w-3.5 h-3.5 ${langColor}`} />
              <SelectValue placeholder="Language" />
              <ChevronDown className="w-3 h-3 text-zinc-500 ml-auto" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10">
              <SelectItem value="python" className="text-zinc-200 focus:bg-white/10 focus:text-white">
                Python
              </SelectItem>
              <SelectItem value="java" className="text-zinc-200 focus:bg-white/10 focus:text-white">
                Java
              </SelectItem>
              <SelectItem value="cpp" className="text-zinc-200 focus:bg-white/10 focus:text-white">
                C++
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-colors">
          <Settings className="w-4 h-4" />
        </button>

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
      </div>
    </div>
  );
}
