// components/layout/EditorPanel.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Split from "react-split";
import { useQuery } from "@tanstack/react-query";
import EditorHeader from "../editor/EditorHeader";
import CodeEditor from "../editor/CodeEditor";
import { SubmissionPanel } from "../submission";
import { useSubmission } from "@/hooks/useSubmission";
import { Problem, StarterCode } from "@/types/problems";
import { getMySettings } from "@/services/profileApi";

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
  sprintMode?: boolean;
  onFinishSprint?: () => void;
}

export default function EditorPanel({
  problem,
  hideSubmit = false,
  onNext,
  isLastQuestion = false,
  sprintMode = false,
  onFinishSprint,
}: EditorPanelProps) {
  // Fetch user's preferred language from settings
  const { data: userSettings } = useQuery({
    queryKey: ['my-settings'],
    queryFn: getMySettings,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Use user's preferred language or fallback to python
  const defaultLang = userSettings?.defaultLanguage || "python";
  const [language, setLanguage] = useState(defaultLang);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Update language when user settings are loaded (only once)
  useEffect(() => {
    if (userSettings?.defaultLanguage && !hasInitialized) {
      setLanguage(userSettings.defaultLanguage);
      setHasInitialized(true);
    }
  }, [userSettings?.defaultLanguage, hasInitialized]);

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

  const [code, setCode] = useState(() => getStarterCode(defaultLang));

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
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setTimeout(() => setIsSubmitting(false), 1000);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      {/* Header */}
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
        sprintMode={sprintMode}
        onFinishSprint={onFinishSprint}
      />

      {/* Resizable Editor and Results Split */}
      <Split
        direction="vertical"
        sizes={[65, 35]}
        minSize={80}
        gutterSize={8}
        className="flex-1 flex flex-col h-full split-vertical"
      >
        {/* Code Editor */}
        <div className="h-full overflow-hidden">
          <CodeEditor
            language={monacoLanguageMap[language] || language}
            code={code}
            setCode={setCode}
          />
        </div>

        {/* Results Panel */}
        <div className="h-full overflow-hidden">
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
