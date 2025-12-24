// components/editor/EditorHeader.tsx (Updated)
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  language: string;
  setLanguage: (lang: string) => void;
  problem: any;
  code: string;
  // New props for functionality
  onRun: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isRunning: boolean;
}

export default function EditorHeader({
  language,
  setLanguage,
  onRun,
  onSubmit,
  isSubmitting,
  isRunning,
}: Props) {
  const isDisabled = isSubmitting || isRunning;

  return (
    <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-800 bg-muted/50">
      <div className="flex items-center gap-3">
        <Select
          value={language}
          onValueChange={setLanguage}
          disabled={isDisabled}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        {/* <Button variant="outline" onClick={onRun} disabled={isDisabled}>
          {isRunning ? "Running..." : "Run"}
        </Button> */}
        <Button onClick={onSubmit} disabled={isDisabled}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
