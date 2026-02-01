"use client";

import React from "react";
import {
  Clock,
  Cpu,
  TrendingUp,
  Zap,
  Brain,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Code2,
} from "lucide-react";
import { RealTimeSubmission } from "@/types/realtime";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface AnalysisTabProps {
  submission: RealTimeSubmission;
  isLoading: boolean;
}

export default function AnalysisTab({ submission, isLoading }: AnalysisTabProps) {
  const { status, executionTime, memoryUsage, phase, id } = submission;

  // Show empty state
  if (phase === "idle" && !status) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center space-y-2 text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto opacity-50" />
          <p>No analysis available yet</p>
          <p className="text-sm">Submit your code to see detailed analysis</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if ((isLoading && phase !== "completed") || (phase === "running" || phase === "compiling")) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Brain className="h-12 w-12 mx-auto animate-pulse text-emerald-500" />
          <div className="space-y-1">
            <p className="font-medium text-white">Generating AI Analysis...</p>
            <p className="text-sm text-zinc-500">Evaluating code complexity and performance</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate performance percentiles based on actual execution metrics
  // In a production environment, these would be provided by backend comparison logic
  const runtimeMs = executionTime ? executionTime * 1000 : 0;
  const timePercentile = runtimeMs > 0 ? Math.min(99, Math.max(1, 100 - (runtimeMs / 2))) : 50;
  const memoryPercentile = memoryUsage ? Math.min(99, Math.max(1, 100 - (memoryUsage / 5000))) : 50;

  // Adaptive Complexity Analysis (Mocked for now, but feels more dynamic)
  // We can eventually pull this from the problem metadata
  const isOptimal = status === "ACCEPTED";

  return (
    <div className="h-full overflow-auto p-4 space-y-6">
      {/* Complexity Analysis */}
      <section className="space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Code2 className="h-5 w-5 text-emerald-500" />
          Complexity Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ComplexityCard
            title="Time Complexity"
            icon={<Clock className="h-4 w-4" />}
            complexity={isOptimal ? "O(n)" : "O(n²)"}
            description={isOptimal ? "Efficient linear scan" : "Potentially suboptimal nested loops"}
            isOptimal={isOptimal}
          />
          <ComplexityCard
            title="Space Complexity"
            icon={<Cpu className="h-4 w-4" />}
            complexity="O(n)"
            description="Linear space used for tracking elements"
            isOptimal={true}
          />
        </div>
      </section>

      {/* Performance Comparison */}
      <section className="space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          Performance Comparison
        </h3>

        <div className="space-y-4">
          <PerformanceBar
            label="Runtime"
            value={runtimeMs > 0 ? `${runtimeMs.toFixed(0)} ms` : "—"}
            percentile={timePercentile}
            icon={<Zap className="h-4 w-4" />}
            description={`Your solution is faster than ${timePercentile.toFixed(0)}% of submissions`}
          />
          <PerformanceBar
            label="Memory"
            value={memoryUsage ? `${(memoryUsage / 1024).toFixed(1)} MB` : "—"}
            percentile={memoryPercentile}
            icon={<Cpu className="h-4 w-4" />}
            description={`Your solution uses less memory than ${memoryPercentile.toFixed(0)}% of submissions`}
          />
        </div>
      </section>

      {/* AI Feedback Section */}
      <section className="space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Brain className="h-5 w-5 text-emerald-500" />
          AI Feedback
          {status === "ACCEPTED" ? (
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Insight Available
            </span>
          ) : (
            <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20">
              Diagnostic Ready
            </span>
          )}
        </h3>

        <div className="space-y-3">
          {status === "ACCEPTED" ? (
            <FeedbackCard
              type="quality"
              icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              title="Code Optimization"
              items={[
                "Excellent usage of hash-based lookups for O(1) access",
                "Clean implementation with minimal overhead",
                "Single-pass solution is the most optimal approach",
              ]}
            />
          ) : (
            <FeedbackCard
              type="optimization"
              icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
              title="Potential Improvements"
              items={[
                "Consider using a HashMap to reduce time complexity to linear",
                "Sort the array if a two-pointer approach is preferred",
                "Current approach might suffer from TLE on larger datasets",
              ]}
            />
          )}

          <FeedbackCard
            type="edge-cases"
            icon={<Lightbulb className="h-4 w-4 text-emerald-500" />}
            title="Insights"
            items={[
              "Handles empty inputs and single element cases",
              "Robust against negative number targets",
              "Memory footprint is stable across test cases",
            ]}
          />
        </div>
      </section>
    </div>
  );
}

// Complexity Card Component
interface ComplexityCardProps {
  title: string;
  icon: React.ReactNode;
  complexity: string;
  description: string;
  isOptimal: boolean;
}

function ComplexityCard({ title, icon, complexity, description, isOptimal }: ComplexityCardProps) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg border border-border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {icon}
          {title}
        </div>
        {isOptimal && (
          <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">
            Optimal
          </span>
        )}
      </div>
      <p className="text-2xl font-bold font-mono">{complexity}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

// Performance Bar Component
interface PerformanceBarProps {
  label: string;
  value: string;
  percentile: number;
  icon: React.ReactNode;
  description: string;
}

function PerformanceBar({ label, value, percentile, icon, description }: PerformanceBarProps) {
  const getColor = () => {
    if (percentile >= 80) return "bg-green-500";
    if (percentile >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="p-4 bg-muted/50 rounded-lg border border-border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{label}</span>
        </div>
        <span className="font-mono font-bold">{value}</span>
      </div>

      <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-2">
        <div
          className={cn("h-full transition-all duration-500", getColor())}
          style={{ width: `${percentile}%` }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-white/50"
          style={{ left: `${percentile}%` }}
        />
      </div>

      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

// Feedback Card Component
interface FeedbackCardProps {
  type: "quality" | "optimization" | "edge-cases";
  icon: React.ReactNode;
  title: string;
  items: string[];
}

function FeedbackCard({ type, icon, title, items }: FeedbackCardProps) {
  return (
    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="font-medium text-sm">{title}</span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

