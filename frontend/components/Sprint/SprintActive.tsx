"use client";
import React, { useState, useEffect } from "react";
import Split from "react-split";
import ProblemPanel from "@/components/layout/ProblemPanel";
import EditorPanel from "@/components/layout/EditorPanel";
import { SprintSession } from "@/hooks/useSprint";
import { Clock, Zap, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SprintActiveProps {
    session: SprintSession;
    onFinish: () => void;
}

export default function SprintActive({ session, onFinish }: SprintActiveProps) {
    const [activeProblemIndex, setActiveProblemIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set());

    // Current problem
    const currentSprintProblem = session.sprintProblems[activeProblemIndex];
    const currentProblem = currentSprintProblem?.problem;

    useEffect(() => {
        // Timer Logic
        const end = new Date(session.endTime).getTime();
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const diff = end - now;
            if (diff <= 0) {
                setTimeLeft(0);
                clearInterval(interval);
                onFinish(); // Auto finish
            } else {
                setTimeLeft(Math.floor(diff / 1000));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [session, onFinish]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handlePrevProblem = () => {
        if (activeProblemIndex > 0) {
            setActiveProblemIndex(activeProblemIndex - 1);
        }
    };

    const handleNextProblem = () => {
        if (activeProblemIndex < session.sprintProblems.length - 1) {
            setActiveProblemIndex(activeProblemIndex + 1);
        }
    };

    if (!currentProblem) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-zinc-500">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                    <span className="text-sm font-medium">Loading sprint...</span>
                </div>
            </div>
        );
    }

    const SprintHeaderBar = (
        <div className="h-12 border-b dark:border-white/5 border-zinc-200 flex items-center justify-between px-4 dark:bg-white/[0.02] bg-zinc-50 shrink-0">
            {/* Left: Sprint Mode Label + Timer */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold dark:text-white text-zinc-900 hidden sm:inline">Sprint Mode</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs font-mono font-bold">{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* Center: Problem Navigation Dots */}
            <div className="flex items-center gap-1 sm:gap-2">
                {session.sprintProblems.map((sp, idx) => {
                    const isSolved = solvedProblems.has(sp.problem?.uuid);
                    const isActive = activeProblemIndex === idx;
                    return (
                        <button
                            key={sp.order}
                            onClick={() => setActiveProblemIndex(idx)}
                            className={cn(
                                "w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all border",
                                isActive
                                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                    : isSolved
                                        ? "bg-emerald-500 text-black border-emerald-400"
                                        : "dark:bg-white/5 bg-zinc-100 dark:text-zinc-500 text-zinc-600 dark:border-white/10 border-zinc-200 dark:hover:text-white hover:text-zinc-900 dark:hover:bg-white/10 hover:bg-zinc-200"
                            )}
                        >
                            {sp.order}
                        </button>
                    );
                })}
            </div>

            {/* Right: Navigation Arrows */}
            <div className="flex items-center gap-1">
                <button
                    onClick={handlePrevProblem}
                    disabled={activeProblemIndex === 0}
                    className="p-1 sm:p-1.5 dark:hover:bg-white/10 hover:bg-zinc-200 rounded-lg dark:text-zinc-500 text-zinc-600 dark:hover:text-white hover:text-zinc-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={handleNextProblem}
                    disabled={activeProblemIndex === session.sprintProblems.length - 1}
                    className="p-1 sm:p-1.5 dark:hover:bg-white/10 hover:bg-zinc-200 rounded-lg dark:text-zinc-500 text-zinc-600 dark:hover:text-white hover:text-zinc-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="h-[calc(100vh-4rem)] w-full flex flex-col dark:text-zinc-100 text-zinc-900 overflow-hidden p-3 sm:p-4 gap-3 sm:gap-4">
            {/* Mobile Layout: Stacked vertically */}
            <div className="flex lg:hidden flex-col flex-1 gap-4 overflow-y-auto pb-4">
                <div className="min-h-[50vh] flex flex-col dark:bg-[#09090b] bg-white rounded-xl border dark:border-white/5 border-zinc-200 overflow-hidden">
                    {SprintHeaderBar}
                    <div className="flex-1 overflow-hidden">
                        <SprintProblemContent problem={currentProblem} />
                    </div>
                </div>

                <div className="min-h-[70vh] flex flex-col dark:bg-[#09090b] bg-white rounded-xl border dark:border-white/5 border-zinc-200 overflow-hidden">
                    <EditorPanel
                        problem={currentProblem}
                        hideSubmit={true}
                        onNext={() => {
                            if (activeProblemIndex < session.sprintProblems.length - 1) {
                                setActiveProblemIndex(activeProblemIndex + 1);
                            }
                        }}
                        isLastQuestion={activeProblemIndex === session.sprintProblems.length - 1}
                        sprintMode={true}
                        onFinishSprint={onFinish}
                    />
                </div>
            </div>

            {/* Desktop Layout: Split view */}
            <div className="hidden lg:flex flex-1 h-full overflow-hidden">
                <Split
                    sizes={[50, 50]}
                    minSize={300}
                    gutterSize={8}
                    direction="horizontal"
                    className="flex flex-1 w-full h-full overflow-hidden split-horizontal"
                >
                    {/* Left Panel - Problem Description with Sprint Header */}
                    <div className="h-full overflow-hidden flex flex-col dark:bg-[#09090b] bg-white rounded-xl border dark:border-white/5 border-zinc-200">
                        {SprintHeaderBar}

                        {/* Problem Content */}
                        <div className="flex-1 overflow-hidden">
                            <SprintProblemContent problem={currentProblem} />
                        </div>
                    </div>

                    {/* Right Panel - Editor & Results with Finish Button */}
                    <div className="h-full overflow-hidden flex flex-col dark:bg-[#09090b] bg-white rounded-xl border dark:border-white/5 border-zinc-200">
                        <EditorPanel
                            problem={currentProblem}
                            hideSubmit={true}
                            onNext={() => {
                                if (activeProblemIndex < session.sprintProblems.length - 1) {
                                    setActiveProblemIndex(activeProblemIndex + 1);
                                }
                            }}
                            isLastQuestion={activeProblemIndex === session.sprintProblems.length - 1}
                            sprintMode={true}
                            onFinishSprint={onFinish}
                        />
                    </div>
                </Split>
            </div>
        </div>
    );
}

// Separate component for problem content without the back link header
function SprintProblemContent({ problem }: { problem: any }) {
    // Difficulty color mapping
    const difficultyStyles: Record<string, string> = {
        EASY: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
        MEDIUM: "bg-amber-500/10 border-amber-500/20 text-amber-400",
        HARD: "bg-red-500/10 border-red-500/20 text-red-400",
    };

    const difficultyClass = difficultyStyles[problem.difficulty?.toUpperCase()] || difficultyStyles.MEDIUM;

    return (
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {/* Title */}
            <h1 className="text-2xl font-bold dark:text-white text-zinc-900 mb-4">{problem.title}</h1>

            {/* Difficulty & Tags */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wide ${difficultyClass}`}>
                    {problem.difficulty || "Medium"}
                </span>
                {Array.isArray(problem.tags) && problem.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                        {problem.tags.map((tag: string) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 rounded dark:bg-white/5 bg-zinc-100 dark:text-zinc-500 text-zinc-600 text-[10px] font-mono border dark:border-white/5 border-zinc-200"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Description */}
            <div className="space-y-6 text-sm dark:text-zinc-300 text-zinc-700 leading-relaxed mb-8">
                <p>{problem.description}</p>
            </div>

            {/* Examples */}
            {Array.isArray(problem.examples) && problem.examples.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold dark:text-white text-zinc-900 mb-3">Example:</h3>
                    {problem.examples.map((example: any, idx: number) => (
                        <div key={idx} className="dark:bg-white/[0.02] bg-zinc-50 rounded-lg p-4 border dark:border-white/5 border-zinc-200 font-mono text-xs space-y-1">
                            <div><span className="dark:text-zinc-500 text-zinc-600">Input:</span> <span className="dark:text-zinc-300 text-zinc-800">{example.input}</span></div>
                            <div><span className="dark:text-zinc-500 text-zinc-600">Output:</span> <span className="dark:text-zinc-300 text-zinc-800">{example.output}</span></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Constraints */}
            {Array.isArray(problem.constraints) && problem.constraints.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold dark:text-white text-zinc-900 mb-3">Constraints:</h3>
                    <ul className="space-y-1 text-xs dark:text-zinc-400 text-zinc-600">
                        {problem.constraints.map((constraint: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="text-emerald-500">•</span>
                                <span className="font-mono">{constraint}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Companies */}
            {Array.isArray(problem.companies) && problem.companies.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold dark:text-white text-zinc-900 mb-3">Companies:</h3>
                    <div className="flex gap-2 flex-wrap">
                        {problem.companies.map((company: string) => (
                            <span
                                key={company}
                                className="px-3 py-1.5 rounded-lg dark:bg-white/5 bg-zinc-100 dark:text-zinc-400 text-zinc-600 text-xs font-medium border dark:border-white/5 border-zinc-200 dark:hover:border-white/10 hover:border-zinc-300 transition-colors"
                            >
                                {company}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
