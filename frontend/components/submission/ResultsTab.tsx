"use client";

import React from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  FileCode,
  Calendar,
  Hash,
  Loader2,
  AlertTriangle,
  Code2,
} from "lucide-react";
import { RealTimeSubmission, getStatusColorClass } from "@/types/realtime";

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
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-500" />
          <div>
            <p className="font-medium text-white">Processing your submission...</p>
            <p className="text-sm text-zinc-500 mt-1">
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
        <div className="text-center space-y-2 text-zinc-500">
          <Code2 className="h-12 w-12 mx-auto opacity-50" />
          <p className="text-zinc-400">Submit your code to see results</p>
          <p className="text-sm text-zinc-600">Results will appear here after submission</p>
        </div>
      </div>
    );
  }

  // Show error state (Compilation or Internal)
  if (phase === "error" || status === "COMPILATION_ERROR" || status === "INTERNAL_ERROR") {
    const isCompilationError = status === "COMPILATION_ERROR";
    const isInternalError = status === "INTERNAL_ERROR" || phase === "error";

    return (
      <div className="h-full overflow-auto p-4 space-y-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-4">
          <div className="p-2 bg-red-500/20 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-red-500 font-bold text-lg tracking-tight">
              {isCompilationError ? "Compilation Error" : isInternalError ? "Internal System Error" : "Error"}
            </h3>
            <p className="text-red-400 text-sm mt-1">
              {error || (isCompilationError ? "Your code failed to compile" : "An unexpected error occurred during processing")}
            </p>
            {isInternalError && !error && (
              <p className="text-red-400/60 text-xs mt-1 italic">
                This might be due to system capacity or connection issues. Please try again in a moment.
              </p>
            )}
          </div>
        </div>

        {compileOutput && isCompilationError && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-zinc-300">Compiler Output:</h4>
            <pre className="bg-black/40 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap font-mono text-red-400 border border-white/5">
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
      {/* Status Banner */}
      <div className={`rounded-lg p-4 flex items-center gap-4 ${isAccepted
        ? "bg-emerald-500/10 border border-emerald-500/20"
        : "bg-red-500/10 border border-red-500/20"
        }`}>
        <div className={`p-2 rounded-full ${isAccepted ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
          {isAccepted ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500" />
          )}
        </div>
        <div>
          <h3 className={`font-bold text-lg tracking-tight ${isAccepted ? "text-emerald-500" : "text-red-500"}`}>
            {status?.replace(/_/g, " ")}
          </h3>
          <p className={`text-xs font-mono ${isAccepted ? "text-emerald-400/60" : "text-red-400/60"}`}>
            {isAccepted
              ? "Congratulations! All test cases passed."
              : `${passedCount} / ${totalTestCases} test cases passed`}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-black/40 p-3 rounded-lg border border-white/5">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> Runtime
          </div>
          <div className="text-lg font-mono text-zinc-300 font-bold">
            {executionTime ? `${(executionTime * 1000).toFixed(0)} ms` : "---"}
          </div>
        </div>
        <div className="bg-black/40 p-3 rounded-lg border border-white/5">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Cpu className="w-3 h-3" /> Memory
          </div>
          <div className="text-lg font-mono text-zinc-300 font-bold">
            {memoryUsage ? `${(memoryUsage / 1024).toFixed(1)} MB` : "---"}
          </div>
        </div>
        <div className="bg-black/40 p-3 rounded-lg border border-white/5">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" /> Passed
          </div>
          <div className="text-lg font-mono font-bold">
            <span className={isAccepted ? "text-emerald-400" : "text-red-400"}>
              {passedCount}
            </span>
            <span className="text-zinc-600 text-sm"> / {totalTestCases}</span>
          </div>
        </div>
        <div className="bg-black/40 p-3 rounded-lg border border-white/5">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <FileCode className="w-3 h-3" /> Language
          </div>
          <div className="text-lg font-mono text-zinc-300 font-bold capitalize">
            {language || "---"}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      {(id || completedAt) && (
        <div className="flex flex-wrap gap-4 text-xs text-zinc-500 pt-2">
          {id && (
            <div className="flex items-center gap-1">
              <Hash className="h-3 w-3" />
              <span>ID: {id.slice(0, 8)}...</span>
            </div>
          )}
          {completedAt && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(completedAt).toLocaleString()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
