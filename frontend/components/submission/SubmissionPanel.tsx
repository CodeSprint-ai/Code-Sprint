"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSubmissionSocket } from "@/hooks/useSubmissionSocket";
import {
  RealTimeSubmission,
  initialSubmissionState,
  SubmissionPhase,
  TestCaseResult,
} from "@/types/realtime";
import ResultsTab from "./ResultsTab";
import TestCasesTab from "./TestCasesTab";
import AnalysisTab from "./AnalysisTab";
import SubmissionProgress from "./SubmissionProgress";

interface SubmissionPanelProps {
  problemId: string;
  isSubmitting: boolean;
  isRunning: boolean;
}

export default function SubmissionPanel({
  problemId,
  isSubmitting,
  isRunning,
}: SubmissionPanelProps) {
  const [activeTab, setActiveTab] = useState("results");
  const [submission, setSubmission] = useState<RealTimeSubmission>(initialSubmissionState);
  const [testCaseFilter, setTestCaseFilter] = useState<"all" | "passed" | "failed">("all");

  // Reset submission state when starting new submission
  useEffect(() => {
    if (isSubmitting) {
      setSubmission({
        ...initialSubmissionState,
        phase: "created",
      });
    }
  }, [isSubmitting]);

  // Handle real-time socket updates
  const handleSocketUpdate = useCallback((data: any) => {
    console.log("📡 Socket update received:", data);

    setSubmission((prev) => {
      if (data.status) {
        const phase: SubmissionPhase =
          data.status === "ACCEPTED" ||
            data.status === "WRONG_ANSWER" ||
            data.status === "TIME_LIMIT_EXCEEDED" ||
            data.status === "RUNTIME_ERROR" ||
            data.status === "COMPILATION_ERROR"
            ? "completed"
            : data.status === "PROCESSING"
              ? "running"
              : data.status === "QUEUED"
                ? "queued"
                : prev.phase;

        const testResults: TestCaseResult[] = (data.testResults || []).map(
          (tr: any, index: number) => ({
            index,
            input: tr.input || {},
            expected: tr.expected,
            got: tr.got,
            verdict: tr.verdict,
            time: tr.time || 0,
            memory: tr.memory || 0,
            isHidden: tr.isHidden || false,
            passed: tr.verdict === "ACCEPTED",
          })
        );

        const passedCount = testResults.filter((tr) => tr.passed).length;

        return {
          ...prev,
          id: data.id || prev.id,
          phase,
          status: data.status,
          language: data.language || prev.language,
          executionTime: data.executionTime || prev.executionTime,
          memoryUsage: data.memoryUsage || prev.memoryUsage,
          testResults,
          passedCount,
          totalTestCases: testResults.length || prev.totalTestCases,
          currentTestCase: testResults.length,
          completedAt: phase === "completed" ? new Date() : prev.completedAt,
        };
      }

      if (data.phase) {
        return {
          ...prev,
          phase: data.phase,
          currentTestCase: data.currentTestCase || prev.currentTestCase,
          totalTestCases: data.totalTestCases || prev.totalTestCases,
        };
      }

      if (data.testCaseResult) {
        const newResult: TestCaseResult = {
          index: data.testCaseIndex,
          ...data.testCaseResult,
          passed: data.testCaseResult.verdict === "ACCEPTED",
        };

        const updatedResults = [...prev.testResults];
        updatedResults[data.testCaseIndex] = newResult;

        return {
          ...prev,
          testResults: updatedResults,
          currentTestCase: data.testCaseIndex + 1,
          passedCount: updatedResults.filter((tr) => tr.passed).length,
        };
      }

      if (data.error) {
        return {
          ...prev,
          phase: "error",
          status: "INTERNAL_ERROR",
          error: data.error,
          language: data.language || prev.language,
          compileOutput: data.compileOutput,
        };
      }

      return prev;
    });
  }, []);

  useSubmissionSocket(handleSocketUpdate);

  const isActive = isSubmitting || isRunning || submission.phase === "running";
  const showProgress = submission.phase !== "idle" && submission.phase !== "completed";

  // Tab styling
  const tabClasses = (tab: string) => {
    const isActiveTab = activeTab === tab;
    return `h-full px-4 text-xs font-bold transition-colors flex items-center gap-2 ${isActiveTab
      ? "text-white border-b-2 border-emerald-500 bg-white/5"
      : "text-zinc-500 hover:text-white"
      }`;
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] border-t border-white/5 overflow-hidden">
      {/* Progress Bar */}
      {showProgress && (
        <SubmissionProgress
          phase={submission.phase}
          currentTestCase={submission.currentTestCase}
          totalTestCases={submission.totalTestCases}
        />
      )}

      {/* Custom Tabs */}
      <div className="h-10 border-b border-white/5 flex items-center px-2 bg-white/[0.02] shrink-0">
        <button
          onClick={() => setActiveTab("results")}
          className={tabClasses("results")}
        >
          Results
          {submission.status && (
            <span className={`w-1.5 h-1.5 rounded-full ${submission.status === "ACCEPTED" ? "bg-emerald-500" : "bg-red-500"
              }`} />
          )}
        </button>
        <button
          onClick={() => setActiveTab("testcases")}
          className={tabClasses("testcases")}
        >
          Test Cases
          {submission.testResults.length > 0 && (
            <span className="text-[10px] bg-white/10 px-1.5 rounded-full">
              {submission.passedCount}/{submission.testResults.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("analysis")}
          className={tabClasses("analysis")}
        >
          Analysis
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "results" && (
          <ResultsTab submission={submission} isLoading={isActive} />
        )}
        {activeTab === "testcases" && (
          <TestCasesTab
            testResults={submission.testResults}
            filter={testCaseFilter}
            onFilterChange={setTestCaseFilter}
            isLoading={isActive}
            currentTestCase={submission.currentTestCase}
          />
        )}
        {activeTab === "analysis" && (
          <AnalysisTab submission={submission} isLoading={isActive} />
        )}
      </div>
    </div>
  );
}
