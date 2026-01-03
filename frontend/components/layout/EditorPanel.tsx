// components/layout/EditorPanel.tsx
"use client";

import React, { useState, useEffect } from "react";
import ResultTabs from "../editor/ResultTabs";
import EditorHeader from "../editor/EditorHeader";
import CodeEditor from "../editor/CodeEditor";
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
  isLastQuestion = false 
}: EditorPanelProps) {
  const [language, setLanguage] = useState("python");
  
  // Get starter code based on selected language
  const getStarterCode = (lang: string): string => {
    const langKey = languageMap[lang.toLowerCase()] || "python";
    
    // Use problem's starter code if available
    if (problem?.starterCode && problem.starterCode[langKey]) {
      return problem.starterCode[langKey];
    }
    
    // Fallback to default
    return defaultStarterCode[langKey];
  };

  const [code, setCode] = useState(() => getStarterCode("python"));

  // Update code when language changes
  useEffect(() => {
    setCode(getStarterCode(language));
  }, [language, problem?.starterCode]);

  // State for submission/run status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  const { createSubmission } = useSubmission(problem?.uuid);

  /**
   * Handles running the code against simple test cases
   */
  const handleRunCode = async () => {
    console.log("Attempting to run code...");
    setIsRunning(true);
    setSubmissionResult(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockResult = {
        status: "Accepted",
        message: "Code ran successfully against the example test case.",
        output: "0 1",
      };

      setSubmissionResult(mockResult);
      console.log("Run finished:", mockResult);
    } catch (error) {
      setSubmissionResult({
        status: "Error",
        message: "Failed to connect to the runner service.",
      });
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
    setSubmissionResult(null);

    try {
      const resp = await createSubmission({
        code,
        language: languageMap[language.toLowerCase()] || language,
        problemUuid: problem.uuid,
        slug: problem.slug,
      });

      console.log({ resp });
      setSubmissionResult(resp);
      console.log("Submission finished:", resp);
    } catch (error) {
      setSubmissionResult({
        status: "Error",
        message: "Submission failed due to server error.",
      });
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
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
      />

      {/* Code Editor */}
      <CodeEditor 
        language={monacoLanguageMap[language] || language} 
        code={code} 
        setCode={setCode} 
      />

      {/* Tabs */}
      <div className="h-50 border-t border-gray-800 overflow-hidden">
        <ResultTabs
          initialResult={submissionResult}
          isLoading={isSubmitting || isRunning}
        />
      </div>
    </div>
  );
}
