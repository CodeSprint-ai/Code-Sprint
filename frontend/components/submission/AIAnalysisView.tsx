"use client";

import React from "react";
import {
    BrainCircuit,
    AlertTriangle,
    Copy,
    CheckCircle2,
    Lightbulb,
    ShieldAlert,
} from "lucide-react";
import type { AIAnalysisResult, AIJobState } from "@/types/ai-analysis";

interface AIAnalysisViewProps {
    data: AIAnalysisResult | null;
    status: AIJobState | null;
    error: string | null;
}

// ─── Loading Skeleton ───────────────────────────────────────────────────────
function AIAnalysisSkeleton() {
    return (
        <div className="p-4 space-y-6 animate-pulse">
            {/* Summary Header skeleton */}
            <div className="border-l-4 border-zinc-700 bg-zinc-800/50 p-4 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded bg-zinc-700" />
                    <div className="h-4 w-32 rounded bg-zinc-700" />
                </div>
                <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-zinc-700/60" />
                    <div className="h-3 w-3/4 rounded bg-zinc-700/60" />
                </div>
            </div>

            {/* 2-column grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="dark:bg-[#1e1e1e] bg-zinc-50 border dark:border-gray-800 border-zinc-200 rounded-lg p-4">
                    <div className="h-3 w-24 rounded bg-zinc-700 mb-3" />
                    <div className="space-y-2 ml-4">
                        <div className="h-3 w-full rounded bg-zinc-700/60" />
                        <div className="h-3 w-5/6 rounded bg-zinc-700/60" />
                        <div className="h-3 w-4/6 rounded bg-zinc-700/60" />
                    </div>
                </div>
                <div className="dark:bg-[#1e1e1e] bg-zinc-50 border dark:border-gray-800 border-zinc-200 rounded-lg p-4">
                    <div className="h-3 w-20 rounded bg-zinc-700 mb-3" />
                    <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-2">
                        <div className="h-3 w-28 rounded bg-zinc-700/60" />
                        <div className="h-3 w-16 rounded bg-zinc-700/60" />
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="h-3 w-28 rounded bg-zinc-700/60" />
                        <div className="h-3 w-12 rounded bg-zinc-700/60" />
                    </div>
                </div>
            </div>

            {/* Edge cases skeleton */}
            <div className="bg-[#1e1e1e] border border-gray-800 rounded-lg p-4">
                <div className="h-3 w-24 rounded bg-zinc-700 mb-3" />
                <div className="space-y-2 ml-4">
                    <div className="h-3 w-full rounded bg-zinc-700/60" />
                    <div className="h-3 w-3/4 rounded bg-zinc-700/60" />
                </div>
            </div>

            {/* Code block skeleton */}
            <div className="rounded-lg overflow-hidden border dark:border-gray-800 border-zinc-200">
                <div className="dark:bg-[#252525] bg-zinc-100 px-4 py-2">
                    <div className="h-3 w-40 rounded bg-zinc-700" />
                </div>
                <div className="p-4 dark:bg-[#0d0d0d] bg-white space-y-2">
                    <div className="h-3 w-full rounded bg-zinc-700/40" />
                    <div className="h-3 w-5/6 rounded bg-zinc-700/40" />
                    <div className="h-3 w-4/6 rounded bg-zinc-700/40" />
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function AIAnalysisView({
    data,
    status,
    error,
}: AIAnalysisViewProps) {
    const [copied, setCopied] = React.useState(false);

    // Loading / polling state
    if (status === "waiting" || status === "active") {
        return <AIAnalysisSkeleton />;
    }

    // Error state
    if (status === "failed" || status === "not_found") {
        return (
            <div className="p-4 space-y-6 animate-in fade-in duration-500">
                <div className="border-l-4 border-red-500 bg-red-500/10 p-4 rounded-r-lg">
                    <h3 className="text-red-400 font-semibold mb-1 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> Analysis Failed
                    </h3>
                    <p className="dark:text-gray-300 text-zinc-700 text-sm">
                        {error || "An unexpected error occurred during AI analysis."}
                    </p>
                </div>
            </div>
        );
    }

    // No data yet (not triggered)
    if (!data) {
        return null;
    }

    // Copy approach text to clipboard
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(data.approach);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Silently fail if clipboard API is unavailable
        }
    };

    return (
        <div className="p-4 space-y-6 animate-in fade-in duration-500">
            {/* Summary Header */}
            <div
                className={`border-l-4 p-4 rounded-r-lg ${data.isOptimal
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-amber-500 bg-amber-500/10"
                    }`}
            >
                <h3
                    className={`font-semibold mb-1 flex items-center gap-2 ${data.isOptimal ? "text-emerald-400" : "text-amber-400"
                        }`}
                >
                    <BrainCircuit className="w-5 h-5" /> AI Diagnostic
                    {data.isOptimal && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            Optimal
                        </span>
                    )}
                </h3>
                <p className="dark:text-gray-300 text-zinc-700 text-sm">{data.feedback}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Optimizations */}
                <div className="dark:bg-[#1e1e1e] bg-zinc-50 border dark:border-gray-800 border-zinc-200 rounded-lg p-4">
                    <h4 className="dark:text-gray-400 text-zinc-500 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5" />
                        {data.isOptimal ? "Strengths" : "Potential Improvements"}
                    </h4>
                    <ul className="text-sm dark:text-gray-300 text-zinc-700 space-y-2 list-disc ml-4">
                        {data.optimizations.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Complexity Analysis */}
                <div className="dark:bg-[#1e1e1e] bg-zinc-50 border dark:border-gray-800 border-zinc-200 rounded-lg p-4">
                    <h4 className="dark:text-gray-400 text-zinc-500 text-xs uppercase tracking-wider mb-3">
                        Efficiency
                    </h4>
                    <div className="flex justify-between items-center border-b dark:border-gray-800 border-zinc-200 pb-2 mb-2">
                        <span className="text-sm dark:text-gray-400 text-zinc-500">Time Complexity</span>
                        <span className="text-sm text-emerald-400 font-mono">
                            {data.timeComplexity}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm dark:text-gray-400 text-zinc-500">Space Complexity</span>
                        <span className="text-sm text-emerald-400 font-mono">
                            {data.spaceComplexity}
                        </span>
                    </div>
                </div>
            </div>

            {/* Edge Cases */}
            {data.edgeCases.length > 0 && (
                <div className="dark:bg-[#1e1e1e] bg-zinc-50 border dark:border-gray-800 border-zinc-200 rounded-lg p-4">
                    <h4 className="dark:text-gray-400 text-zinc-500 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Edge Cases to Watch
                    </h4>
                    <ul className="text-sm dark:text-gray-300 text-zinc-700 space-y-2 list-disc ml-4">
                        {data.edgeCases.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Approach / Code Suggestion */}
            <div className="rounded-lg overflow-hidden border dark:border-gray-800 border-zinc-200">
                <div className="dark:bg-[#252525] bg-zinc-100 px-4 py-2 text-xs dark:text-gray-400 text-zinc-500 flex justify-between">
                    <span>AI Approach Analysis</span>
                    <button
                        onClick={handleCopy}
                        className="hover:text-white flex items-center gap-1 transition-colors"
                    >
                        {copied ? (
                            <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Copied
                            </>
                        ) : (
                            <>
                                <Copy className="w-3 h-3" /> Copy
                            </>
                        )}
                    </button>
                </div>
                <pre className="p-4 dark:bg-[#0d0d0d] bg-white text-sm dark:text-emerald-50/80 text-zinc-800 font-mono overflow-x-auto whitespace-pre-wrap">
                    {data.approach}
                </pre>
            </div>
        </div>
    );
}
