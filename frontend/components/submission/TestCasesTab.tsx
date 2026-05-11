"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Cpu,
  Eye,
  EyeOff,
  Filter,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TestCaseResult, getStatusColorClass } from "@/types/realtime";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TestCasesTabProps {
  testResults: TestCaseResult[];
  filter: "all" | "passed" | "failed";
  onFilterChange: (filter: "all" | "passed" | "failed") => void;
  isLoading: boolean;
  currentTestCase: number;
}

export default function TestCasesTab({
  testResults,
  filter,
  onFilterChange,
  isLoading,
  currentTestCase,
}: TestCasesTabProps) {
  const [expandedCases, setExpandedCases] = useState<Set<number>>(new Set());

  // Filter test results
  const filteredResults = testResults.filter((tr) => {
    if (filter === "passed") return tr.passed;
    if (filter === "failed") return !tr.passed;
    return true;
  });

  const toggleExpanded = (index: number) => {
    setExpandedCases((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedCases(new Set(filteredResults.map((_, i) => i)));
  };

  const collapseAll = () => {
    setExpandedCases(new Set());
  };

  // Show empty state
  if (testResults.length === 0 && !isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center space-y-2 text-muted-foreground">
          <CheckCircle2 className="h-12 w-12 mx-auto opacity-50" />
          <p>No test case results yet</p>
          <p className="text-sm">Submit your code to see test results</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-4">
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="h-3.5 w-3.5 mr-2" />
                {filter === "all" ? "All" : filter === "passed" ? "Passed" : "Failed"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onFilterChange("all")}>
                All ({testResults.length})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange("passed")}>
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                Passed ({testResults.filter((t) => t.passed).length})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange("failed")}>
                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                Failed ({testResults.filter((t) => !t.passed).length})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Summary */}
          <span className="text-sm text-muted-foreground">
            {filteredResults.length} test case{filteredResults.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Expand/Collapse */}
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={expandAll} className="h-8 text-xs">
            Expand All
          </Button>
          <Button variant="ghost" size="sm" onClick={collapseAll} className="h-8 text-xs">
            Collapse All
          </Button>
        </div>
      </div>

      {/* Test Cases List */}
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {filteredResults.map((testCase, displayIndex) => {
          const isExpanded = expandedCases.has(displayIndex);
          const isRunning = isLoading && testCase.index === currentTestCase - 1;

          return (
            <TestCaseCard
              key={testCase.index}
              testCase={testCase}
              displayIndex={displayIndex}
              isExpanded={isExpanded}
              isRunning={isRunning}
              onToggle={() => toggleExpanded(displayIndex)}
            />
          );
        })}

        {/* Show loading placeholder for remaining tests */}
        {isLoading && currentTestCase < testResults.length && (
          <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
            <Skeleton className="h-4 w-4 rounded-full" />
            <span>Running remaining test cases...</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Individual Test Case Card
interface TestCaseCardProps {
  testCase: TestCaseResult;
  displayIndex: number;
  isExpanded: boolean;
  isRunning: boolean;
  onToggle: () => void;
}

function TestCaseCard({
  testCase,
  displayIndex,
  isExpanded,
  isRunning,
  onToggle,
}: TestCaseCardProps) {
  const { input, expected, got, verdict, time, memory, isHidden, passed } = testCase;

  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden transition-colors",
        passed ? "border-green-500/20" : "border-red-500/20",
        isRunning && "border-blue-500/50 animate-pulse"
      )}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between p-3 text-left transition-colors",
          passed ? "bg-green-500/5 hover:bg-green-500/10" : "bg-red-500/5 hover:bg-red-500/10"
        )}
      >
        <div className="flex items-center gap-3">
          {isRunning ? (
            <Skeleton className="h-5 w-5 rounded-full" />
          ) : passed ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}

          <span className="font-medium">
            Test Case {testCase.index + 1}
            {isHidden && (
              <span className="ml-2 text-xs text-muted-foreground">(Hidden)</span>
            )}
          </span>

          <span className={cn("text-sm", getStatusColorClass(verdict))}>
            {verdict.replace(/_/g, " ")}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Time & Memory */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {(time * 1000).toFixed(0)}ms
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              {(memory / 1024).toFixed(1)}MB
            </span>
          </div>

          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-3 border-t border-border bg-muted/30 space-y-3">
          {isHidden ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <EyeOff className="h-4 w-4" />
              <span className="text-sm">This test case is hidden for scoring purposes</span>
            </div>
          ) : (
            <>
              {/* Input */}
              <div>
                <h4 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Input
                </h4>
                <pre className="bg-background p-2 rounded text-sm font-mono overflow-x-auto">
                  {formatValue(input)}
                </pre>
              </div>

              {/* Expected vs Got */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h4 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Expected Output
                  </h4>
                  <pre className="bg-background p-2 rounded text-sm font-mono overflow-x-auto text-green-400">
                    {formatValue(expected)}
                  </pre>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Your Output
                  </h4>
                  <pre
                    className={cn(
                      "bg-background p-2 rounded text-sm font-mono overflow-x-auto",
                      passed ? "text-green-400" : "text-red-400"
                    )}
                  >
                    {formatValue(got)}
                  </pre>
                </div>
              </div>

              {/* Diff View for Failed Cases */}
              {!passed && (
                <DiffView expected={expected} got={got} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Diff View Component
function DiffView({ expected, got }: { expected: unknown; got: unknown }) {
  const expectedStr = formatValue(expected);
  const gotStr = formatValue(got);

  if (expectedStr === gotStr) return null;

  return (
    <div className="border-t border-border pt-3">
      <h4 className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
        Difference
      </h4>
      <div className="bg-background rounded p-2 font-mono text-sm space-y-1">
        <div className="flex items-start gap-2">
          <span className="text-green-500 font-bold">−</span>
          <span className="text-green-400 line-through opacity-70">{expectedStr}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-red-500 font-bold">+</span>
          <span className="text-red-400">{gotStr}</span>
        </div>
      </div>
    </div>
  );
}

// Helper to format values for display
function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

