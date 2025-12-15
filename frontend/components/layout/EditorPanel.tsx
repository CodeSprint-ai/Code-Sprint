// components/layout/EditorPanel.tsx
"use client";

import React, { useState } from "react";
import ResultTabs from "../editor/ResultTabs";
import EditorHeader from "../editor/EditorHeader";
import CodeEditor from "../editor/CodeEditor";
import { useSubmission } from "@/hooks/useSubmission";

export default function EditorPanel({ problem }: any) {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("// Write your code here");

  // State for submission/run status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null); // To store results

  const { createSubmission } = useSubmission(problem?.uuid);
  // --- Core Logic Functions ---

  /**
   * Handles running the code against simple test cases (usually one example).
   * Note: You will need to replace this with your actual API call.
   */
  const handleRunCode = async () => {
    console.log("Attempting to run code...");
    setIsRunning(true);
    setSubmissionResult(null); // Clear previous results

    // --- Placeholder API Call ---
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Replace this with a real fetch call to your "run code" endpoint
      const mockResult = {
        status: "Accepted",
        message: "Code ran successfully against the example test case.",
        output: "0 1", // Example output
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
   * Handles submitting the code against all test cases.
   * Note: You will need to replace this with your actual API call.
   */
  const handleSubmitCode = async () => {
    console.log("Attempting to submit code...");
    setIsSubmitting(true);
    setSubmissionResult(null); // Clear previous results

    // Data structure to send to your backend
    const submissionData = {
      problemUuid: problem.uuid,
      language: language,
      code: code,
    };
    // console.log("Submitting data:", resp);

    // --- Placeholder API Call ---
    try {
      // Simulate API call delay
      const resp = await createSubmission({
        code,
        language,
        problemUuid: problem.uuid,
        slug: problem.slug,
      });

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
    <div className="flex flex-col h-full ">
      {/* Header (Pass handlers and loading state) */}
      <EditorHeader
        language={language}
        setLanguage={setLanguage}
        problem={problem}
        code={code}
        onRun={handleRunCode} // New prop
        onSubmit={handleSubmitCode} // New prop
        isSubmitting={isSubmitting} // New prop
        isRunning={isRunning} // New prop
      />

      {/* Code Editor */}
      {/* <div className=""> */}
      <CodeEditor language={language} code={code} setCode={setCode} />
      {/* </div> */}

      {/* Tabs (Pass results) */}
      <div className="h-50 border-t border-gray-800 overflow-hidden">
        <ResultTabs
          initialResult={submissionResult} // New prop
          isLoading={isSubmitting || isRunning} // New prop
        />
      </div>
    </div>
  );
}
