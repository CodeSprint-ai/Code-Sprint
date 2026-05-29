"use client";

import React from "react";
import { Clock, Cpu, Play, CheckCircle2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SubmissionPhase, getPhaseLabel } from "@/types/realtime";
import { cn } from "@/lib/utils";

interface SubmissionProgressProps {
  phase: SubmissionPhase;
  currentTestCase: number;
  totalTestCases: number;
}

export default function SubmissionProgress({
  phase,
  currentTestCase,
  totalTestCases,
}: SubmissionProgressProps) {
  const progress = totalTestCases > 0 
    ? Math.round((currentTestCase / totalTestCases) * 100) 
    : 0;

  const getPhaseIcon = () => {
    switch (phase) {
      case "created":
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case "queued":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "compiling":
        return <Cpu className="h-4 w-4 text-purple-500 animate-pulse" />;
      case "running":
        return <Play className="h-4 w-4 text-green-500 animate-pulse" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Skeleton className="h-4 w-4 rounded-full" />;
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "created":
        return "bg-blue-500";
      case "queued":
        return "bg-yellow-500";
      case "compiling":
        return "bg-purple-500";
      case "running":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="px-4 py-3 bg-muted/50 border-b border-border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getPhaseIcon()}
          <span className="text-sm font-medium">{getPhaseLabel(phase)}</span>
        </div>
        
        {phase === "running" && totalTestCases > 0 && (
          <span className="text-sm text-muted-foreground">
            Running test case {currentTestCase} / {totalTestCases}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-300 ease-out rounded-full",
            getPhaseColor(),
            phase === "running" && "animate-pulse"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Phase Steps */}
      <div className="flex justify-between mt-2">
        {["created", "queued", "compiling", "running"].map((step, index) => {
          const phases: SubmissionPhase[] = ["created", "queued", "compiling", "running"];
          const currentIndex = phases.indexOf(phase);
          const stepIndex = phases.indexOf(step as SubmissionPhase);
          const isCompleted = stepIndex < currentIndex;
          const isCurrent = stepIndex === currentIndex;

          return (
            <div
              key={step}
              className={cn(
                "flex items-center gap-1 text-xs",
                isCompleted && "text-green-500",
                isCurrent && "text-primary font-medium",
                !isCompleted && !isCurrent && "text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  isCompleted && "bg-green-500",
                  isCurrent && "bg-primary animate-pulse",
                  !isCompleted && !isCurrent && "bg-muted-foreground/30"
                )}
              />
              <span className="hidden sm:inline capitalize">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

