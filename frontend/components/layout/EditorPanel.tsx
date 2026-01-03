// components/layout/EditorPanel.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";

import Split from "react-split";


import EditorHeader from "../editor/EditorHeader";
import CodeEditor from "../editor/CodeEditor";
import { SubmissionPanel } from "../submission";
import { useSubmission } from "@/hooks/useSubmission";
import { Problem, StarterCode } from "@/types/problems";

// Default starter code if problem doesn't have any
const defaultStarterCode: StarterCode = {
  java: `class Solution {
    // Write your solution here
}`,
  python: `class Solution:
    # Write your solution here
    pass`,
  cpp: `class Solution {
public:
    // Write your solution here
};`,
};

// Map language selector value to starterCode keys
const languageMap: Record<string, keyof StarterCode> = {
  python: "python",
  python3: "python",
  java: "java",
  cpp: "cpp",
  "c++": "cpp",
};

// Map language to Monaco editor language
const monacoLanguageMap: Record<string, string> = {
  python: "python",
  java: "java",
  cpp: "cpp",
};

interface EditorPanelProps {
  problem: Problem;
  hideSubmit?: boolean;
  onNext?: () => void;
  isLastQuestion?: boolean;
}

export default function EditorPanel({
  problem,
  hideSubmit = false,
  onNext,
  isLastQuestion = false,
}: EditorPanelProps) {
  const [language, setLanguage] = useState("python");

  // Get starter code based on selected language
  const getStarterCode = useCallback((lang: string): string => {
    const langKey = languageMap[lang.toLowerCase()] || "python";

    // Use problem's starter code if available
    if (problem?.starterCode && problem.starterCode[langKey]) {
      return problem.starterCode[langKey];
    }

    // Fallback to default
    return defaultStarterCode[langKey];
  }, [problem?.starterCode]);

  const [code, setCode] = useState(() => getStarterCode("python"));

  // Update code when language changes
  useEffect(() => {
    setCode(getStarterCode(language));
  }, [language, getStarterCode]);


  // State for submission/run status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const { createSubmission } = useSubmission(problem?.uuid);

  /**
   * Handles running the code against simple test cases
   */
  const handleRunCode = async () => {
    console.log("Attempting to run code...");
    setIsRunning(true);

    try {
      // TODO: Implement run code endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Run finished");
    } catch (error) {
      console.error("Run error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  /**
   * Handles submitting the code against all test cases
   */
  const handleSubmitCode = async () => {
    console.log("Attempting to submit code...");
    setIsSubmitting(true);

    try {
      const resp = await createSubmission({
        code,
        language: languageMap[language.toLowerCase()] || language,
        problemUuid: problem.uuid,
        slug: problem.slug,
      });

      console.log("Submission created:", resp);
      // The SubmissionPanel will handle real-time updates via socket
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      // Keep submitting true until socket confirms completion
      // The socket handler in SubmissionPanel will manage the UI state
      setTimeout(() => setIsSubmitting(false), 1000);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex-shrink-0">
        <EditorHeader
          language={language}
          setLanguage={setLanguage}
          problem={problem}
          code={code}
          onRun={handleRunCode}
          onSubmit={handleSubmitCode}
          isSubmitting={isSubmitting}
          isRunning={isRunning}
          hideSubmit={hideSubmit}
          onNext={onNext}
          isLastQuestion={isLastQuestion}
        />
      </div>

      <Split
        direction="vertical" // top/bottom
        sizes={[70, 30]}
        minSize={50}
        gutterSize={6}       // thickness of the handle
        className="h-full flex flex-col"
      >
        <div className="h-full">
          <CodeEditor
            language={monacoLanguageMap[language] || language}
            code={code}
            setCode={setCode}
          />
        </div>

        <div className="h-full">
          <SubmissionPanel
            problemId={problem.uuid}
            isSubmitting={isSubmitting}
            isRunning={isRunning}
          />
        </div>
      </Split>



    </div>
  );
}
