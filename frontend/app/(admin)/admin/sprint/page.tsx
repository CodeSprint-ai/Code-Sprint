"use client";

import React, { useState } from "react";
import {
    Zap, Play, Terminal, Activity, Clock, Trophy,
    Target, Flame, ArrowRight, Award, TrendingUp, Shield,
} from "lucide-react";
import { useSprint, SprintSession, SprintCompletionResult } from "@/hooks/useSprint";
import { useAuthStore } from "@/store/authStore";
import SprintActive from "@/components/Sprint/SprintActive";
import SprintCompletionModal from "@/components/Sprint/SprintCompletionModal";
import { toast } from "sonner";

export default function AdminSprintPage() {
    const { createSprint, finishSprint, isCreating } = useSprint();
    const user = useAuthStore((state) => state.user);
    const [activeSession, setActiveSession] = useState<SprintSession | null>(null);
    const [completionResult, setCompletionResult] = useState<SprintCompletionResult | null>(null);

    const handleStartSprint = async () => {
        if (!user?.userUuid) {
            toast.error("Please log in to start a sprint");
            return;
        }
        try {
            const session = await createSprint({ userId: user.userUuid });
            setActiveSession(session);
        } catch (error) {
            console.error("Failed to start sprint:", error);
            toast.error("Failed to start sprint");
        }
    };

    const handleFinish = async (solutions: import("@/hooks/useSprint").SprintSolution[] = []) => {
        if (!activeSession) return;
        try {
            const result = await finishSprint({ sprintId: activeSession.uuid, solutions });
            setActiveSession(null);
            setCompletionResult(result);
        } catch (e) {
            console.error("Failed to finish sprint:", e);
            toast.error("Failed to finish sprint");
        }
    };

    if (activeSession) {
        return <SprintActive session={activeSession} onFinish={handleFinish} />;
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-4 md:py-6 animate-fade-in">
            {/* Sprint Completion Modal */}
            {completionResult && (
                <SprintCompletionModal
                    result={completionResult}
                    onClose={() => setCompletionResult(null)}
                />
            )}

            {/* Compact Header — icon + title inline */}
            <div className="relative z-10 flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl dark:bg-[#09090b] bg-white border dark:border-emerald-500/20 border-emerald-500/30 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] shrink-0">
                    <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black dark:text-white text-zinc-900 tracking-tighter font-mono leading-none">
                        SPRINT_MODE<span className="animate-pulse text-emerald-500">_</span>
                    </h1>
                    <p className="dark:text-zinc-500 text-zinc-500 text-xs font-mono mt-1">
                        5 challenges • 60 minutes • Earn points & badges
                    </p>
                </div>
            </div>

            {/* Main Layout — fits in viewport */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">

                {/* Launch Card (7 cols on desktop) */}
                <div className="lg:col-span-7 group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/30 to-emerald-900/30 rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-500" />
                    <div className="relative h-full dark:bg-[#09090b] bg-white border dark:border-white/5 border-zinc-200 rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-sm dark:shadow-none">
                        {/* Decor */}
                        <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Terminal className="w-24 h-24 text-emerald-500" />
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded dark:bg-emerald-950/50 bg-emerald-50 border dark:border-emerald-500/20 border-emerald-500/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                    <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase font-mono">
                                        System Ready
                                    </span>
                                </div>
                                <Activity className="w-4 h-4 dark:text-zinc-700 text-zinc-400" />
                            </div>

                            <div>
                                <h3 className="text-xl font-bold dark:text-white text-zinc-900 mb-4 tracking-tight font-mono">
                                    Initialize Session
                                </h3>
                                <div className="font-mono text-xs space-y-2.5 dark:text-zinc-500 text-zinc-500 dark:bg-black/40 bg-zinc-50 p-4 rounded-lg border dark:border-white/5 border-zinc-200">
                                    <div className="flex items-center gap-3">
                                        <span className="text-emerald-500">➜</span>
                                        <span className="dark:text-zinc-400 text-zinc-600">Loading problem pool...</span>
                                        <span className="text-emerald-500 ml-auto font-bold">OK</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-emerald-500">➜</span>
                                        <span className="dark:text-zinc-400 text-zinc-600">Selecting 5 challenges (1E + 2M + 2H)...</span>
                                        <span className="text-emerald-500 ml-auto font-bold">OK</span>
                                    </div>
                                    <div className="flex items-center gap-3 border-t dark:border-white/5 border-zinc-200 pt-2.5 mt-1">
                                        <span className="text-emerald-500 animate-pulse">➜</span>
                                        <span className="dark:text-zinc-200 text-zinc-800">Ready to begin sequence.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleStartSprint}
                            disabled={isCreating}
                            className="mt-5 w-full group/btn relative flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-black font-bold py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                            <Play className="w-5 h-5 fill-black" />
                            <span className="tracking-widest uppercase text-sm font-mono">
                                {isCreating ? "INITIALIZING..." : "START SPRINT"}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Right Column: Scoring + How It Works (5 cols on desktop) */}
                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">

                    {/* Scoring Rules Card */}
                    <div className="dark:bg-[#09090b] bg-white border dark:border-white/5 border-zinc-200 rounded-2xl p-5 shadow-sm dark:shadow-none">
                        <div className="flex items-center gap-2 mb-4">
                            <Target className="w-4 h-4 text-emerald-400" />
                            <h3 className="text-xs font-bold dark:text-white text-zinc-900 font-mono uppercase tracking-wider">
                                Points per Solve
                            </h3>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: "Easy", pts: 10, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                                { label: "Medium", pts: 20, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
                                { label: "Hard", pts: 30, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
                            ].map((r) => (
                                <div key={r.label} className={`text-center py-2.5 px-2 rounded-lg ${r.bg} border ${r.border}`}>
                                    <div className={`text-lg font-black font-mono ${r.color}`}>+{r.pts}</div>
                                    <div className={`text-[10px] font-bold uppercase tracking-wide ${r.color}`}>{r.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-3 pt-3 border-t dark:border-white/5 border-zinc-200">
                            <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className="dark:text-zinc-500 text-zinc-400 uppercase tracking-wider">Mix: 1E + 2M + 2H</span>
                                <span className="dark:text-white text-zinc-900 font-black">Max 110 pts</span>
                            </div>
                        </div>
                    </div>

                    {/* Levels + How it Works — combined compact card */}
                    <div className="dark:bg-[#09090b] bg-white border dark:border-white/5 border-zinc-200 rounded-2xl p-5 shadow-sm dark:shadow-none">
                        {/* Levels */}
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-4 h-4 text-purple-400" />
                            <h3 className="text-xs font-bold dark:text-white text-zinc-900 font-mono uppercase tracking-wider">
                                Rank Progression
                            </h3>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {[
                                { level: "Beginner", color: "dark:text-zinc-400 text-zinc-500 dark:bg-zinc-800/50 bg-zinc-100 dark:border-zinc-700 border-zinc-200" },
                                { level: "Intermediate", color: "dark:text-blue-400 text-blue-500 dark:bg-blue-500/10 bg-blue-50 dark:border-blue-500/20 border-blue-200" },
                                { level: "Advanced", color: "dark:text-purple-400 text-purple-500 dark:bg-purple-500/10 bg-purple-50 dark:border-purple-500/20 border-purple-200" },
                                { level: "Expert", color: "dark:text-yellow-400 text-yellow-600 dark:bg-yellow-500/10 bg-yellow-50 dark:border-yellow-500/20 border-yellow-200" },
                            ].map((l) => (
                                <span key={l.level} className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md border ${l.color}`}>
                                    {l.level}
                                </span>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="border-t dark:border-white/5 border-zinc-200 pt-4 mt-1">
                            <div className="flex items-center gap-2 mb-3">
                                <Shield className="w-4 h-4 text-cyan-400" />
                                <h3 className="text-xs font-bold dark:text-white text-zinc-900 font-mono uppercase tracking-wider">
                                    How It Works
                                </h3>
                            </div>
                            <div className="space-y-2">
                                {[
                                    { icon: Clock, text: "60 min timer starts on launch" },
                                    { icon: Target, text: "Solve in any order" },
                                    { icon: Flame, text: "Daily sprints build streaks" },
                                    { icon: Award, text: "Unlock badges as you level up" },
                                ].map(({ icon: Icon, text }, i) => (
                                    <div key={i} className="flex items-center gap-2.5">
                                        <Icon className="w-3 h-3 dark:text-zinc-500 text-zinc-400 shrink-0" />
                                        <span className="text-[11px] dark:text-zinc-400 text-zinc-600">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Last Result Banner */}
            {completionResult && (
                <div className="mt-4 relative z-10 dark:bg-[#09090b] bg-white border dark:border-emerald-500/20 border-emerald-200 rounded-2xl p-4 shadow-sm dark:shadow-none">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <div className="text-sm font-bold dark:text-white text-zinc-900">
                                    Last Sprint: <span className="text-emerald-400 font-mono">+{completionResult.pointsEarned} pts</span>
                                </div>
                                <div className="text-xs dark:text-zinc-500 text-zinc-400 font-mono">
                                    {completionResult.correctAnswers}/{completionResult.totalQuestions} solved • Streak: {completionResult.updatedStreak}🔥
                                    {completionResult.newLevel && ` • ${completionResult.newLevel}!`}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleStartSprint}
                            disabled={isCreating}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black text-xs font-bold font-mono uppercase tracking-wider transition-all disabled:opacity-50"
                        >
                            Again <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
