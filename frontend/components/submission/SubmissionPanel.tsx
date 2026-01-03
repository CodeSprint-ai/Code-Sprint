"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      // Handle different event types
      if (data.status) {
        // Completed submission update
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

      // Handle phase updates
      if (data.phase) {
        return {
          ...prev,
          phase: data.phase,
          currentTestCase: data.currentTestCase || prev.currentTestCase,
          totalTestCases: data.totalTestCases || prev.totalTestCases,
        };
      }

      // Handle test case result streaming
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

      // Handle error
      if (data.error) {
        return {
          ...prev,
          phase: "error",
          error: data.error,
          compileOutput: data.compileOutput,
        };
      }

      return prev;
    });
  }, []);

  useSubmissionSocket(handleSocketUpdate);

  const isActive = isSubmitting || isRunning || submission.phase === "running";
  const showProgress = submission.phase !== "idle" && submission.phase !== "completed";

  return (
    <div className="flex flex-col h-full bg-background border-t border-border overflow-scroll">
      {/* Progress Bar */}
      {showProgress && (
        <SubmissionProgress
          phase={submission.phase}
          currentTestCase={submission.currentTestCase}
          totalTestCases={submission.totalTestCases}
        />
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-muted/30 px-2">
          <TabsTrigger
            value="results"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Results
            {submission.status && (
              <span
                className={`ml-2 w-2 h-2 rounded-full ${submission.status === "ACCEPTED" ? "bg-green-500" : "bg-red-500"
                  }`}
              />
            )}
          </TabsTrigger>
          <TabsTrigger
            value="testcases"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Test Cases
            {submission.testResults.length > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({submission.passedCount}/{submission.testResults.length})
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="analysis"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Analysis
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="results" className="h-full m-0 p-0">
            <ResultsTab
              submission={submission}
              isLoading={isActive}
            />
          </TabsContent>

          <TabsContent value="testcases" className="h-full m-0 p-0">
            <TestCasesTab
              testResults={submission.testResults}
              filter={testCaseFilter}
              onFilterChange={setTestCaseFilter}
              isLoading={isActive}
              currentTestCase={submission.currentTestCase}
            />
          </TabsContent>

          <TabsContent value="analysis" className="h-full m-0 p-0">
            <AnalysisTab
              submission={submission}
              isLoading={isActive}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

