"use client";

import React from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  Code2,
  Calendar,
  Hash,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { RealTimeSubmission, getStatusColorClass, getStatusBgClass } from "@/types/realtime";
import { cn } from "@/lib/utils";

interface ResultsTabProps {
  submission: RealTimeSubmission;
  isLoading: boolean;
}

export default function ResultsTab({ submission, isLoading }: ResultsTabProps) {
  const { status, phase, executionTime, memoryUsage, passedCount, totalTestCases, language, id, completedAt, error, compileOutput } = submission;

  // Show loading state
  if (isLoading && phase !== "completed" && phase !== "error") {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <div>
            <p className="font-medium">Processing your submission...</p>
            <p className="text-sm text-muted-foreground mt-1">
              {phase === "compiling" && "Compiling your code..."}
              {phase === "running" && `Running test cases...`}
              {phase === "queued" && "Waiting in queue..."}
              {phase === "created" && "Initializing..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (phase === "idle" && !status) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center space-y-2 text-muted-foreground">
          <Code2 className="h-12 w-12 mx-auto opacity-50" />
          <p>Submit your code to see results</p>
          <p className="text-sm">Results will appear here after submission</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (phase === "error" || status === "COMPILATION_ERROR") {
    return (
      <div className="h-full overflow-auto p-4 space-y-4">
        <div className={cn("p-4 rounded-lg border", getStatusBgClass(status || "error"))}>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div>
              <h3 className={cn("text-lg font-bold", getStatusColorClass(status))}>
                {status === "COMPILATION_ERROR" ? "Compilation Error" : "Error"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {error || "Your code failed to compile"}
              </p>
            </div>
          </div>
        </div>

        {compileOutput && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Compiler Output:</h4>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap font-mono text-red-400">
              {compileOutput}
            </pre>
          </div>
        )}
      </div>
    );
  }

  // Show results
  const isAccepted = status === "ACCEPTED";

  return (
    <div className="h-full overflow-auto p-4 space-y-4">
      {/* Main Status Card */}
      <div className={cn("p-4 rounded-lg border", getStatusBgClass(status))}>
        <div className="flex items-center gap-4">
          {isAccepted ? (
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          ) : (
            <XCircle className="h-10 w-10 text-red-500" />
          )}
          <div className="flex-1">
            <h3 className={cn("text-xl font-bold", getStatusColorClass(status))}>
              {status?.replace(/_/g, " ")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isAccepted
                ? "Congratulations! All test cases passed."
                : `${passedCount} / ${totalTestCases} test cases passed`}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Execution Time */}
        <div className="p-3 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wide">Runtime</span>
          </div>
          <p className="text-lg font-semibold">
            {executionTime ? `${(executionTime * 1000).toFixed(0)} ms` : "—"}
          </p>
        </div>

        {/* Memory Usage */}
        <div className="p-3 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Cpu className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wide">Memory</span>
          </div>
          <p className="text-lg font-semibold">
            {memoryUsage ? `${(memoryUsage / 1024).toFixed(1)} MB` : "—"}
          </p>
        </div>

        {/* Test Cases */}
        <div className="p-3 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wide">Passed</span>
          </div>
          <p className="text-lg font-semibold">
            <span className={isAccepted ? "text-green-500" : "text-red-500"}>
              {passedCount}
            </span>
            <span className="text-muted-foreground"> / {totalTestCases}</span>
          </p>
        </div>

        {/* Language */}
        <div className="p-3 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Code2 className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wide">Language</span>
          </div>
          <p className="text-lg font-semibold capitalize">
            {language || "—"}
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        {id && (
          <div className="flex items-center gap-1">
            <Hash className="h-3.5 w-3.5" />
            <span>ID: {id.slice(0, 8)}...</span>
          </div>
        )}
        {completedAt && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(completedAt).toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}

