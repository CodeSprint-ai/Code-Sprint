"use client";

import React, { useEffect, useState } from "react";
import { SprintCompletionResult } from "@/hooks/useSprint";
import {
    Trophy,
    Zap,
    Award,
    Flame,
    ArrowUp,
    Star,
    TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

interface SprintCompletionModalProps {
    result: SprintCompletionResult;
    onClose: () => void;
}

const levelStyles: Record<string, { color: string; gradient: string }> = {
    BEGINNER: { color: "text-zinc-400", gradient: "from-zinc-500 to-zinc-600" },
    INTERMEDIATE: { color: "text-blue-400", gradient: "from-blue-500 to-blue-600" },
    ADVANCED: { color: "text-purple-400", gradient: "from-purple-500 to-purple-600" },
    EXPERT: { color: "text-yellow-400", gradient: "from-yellow-500 to-amber-500" },
};

export default function SprintCompletionModal({ result, onClose }: SprintCompletionModalProps) {
    const [showBadges, setShowBadges] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setShowBadges(true), 600);
        return () => clearTimeout(t);
    }, []);

    const scorePercent = result.totalQuestions > 0
        ? Math.round((result.correctAnswers / result.totalQuestions) * 100)
        : 0;

    const lvl = result.newLevel
        ? levelStyles[result.newLevel] || levelStyles.BEGINNER
        : null;

    return (
        <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent
                showCloseButton={true}
                className={cn(
                    "sm:max-w-lg p-0 gap-0 overflow-hidden",
                    "dark:bg-[#0a0a0c] bg-white",
                    "dark:border-white/10 border-zinc-200",
                    "shadow-2xl shadow-emerald-500/10",
                )}
            >
                {/* Header with gradient */}
                <DialogHeader className="relative px-8 pt-10 pb-6 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent" />

                    {/* Trophy icon with glow */}
                    <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 mx-auto shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                        <Trophy className="w-10 h-10 text-emerald-400" />
                    </div>

                    <DialogTitle className="text-2xl font-black dark:text-white text-zinc-900 tracking-tight mb-1">
                        Sprint Complete!
                    </DialogTitle>
                    <DialogDescription className="dark:text-zinc-500 text-zinc-500 text-sm font-mono">
                        Session terminated successfully
                    </DialogDescription>
                </DialogHeader>

                {/* Score Section */}
                <div className="px-8 pb-6">
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {/* Points Earned */}
                        <div className="rounded-xl dark:bg-white/[0.03] bg-zinc-50 border dark:border-white/5 border-zinc-200 p-4 text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Zap className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="text-2xl font-black dark:text-white text-zinc-900 font-mono">
                                +{result.pointsEarned}
                            </div>
                            <div className="text-[10px] dark:text-zinc-500 text-zinc-400 font-bold uppercase tracking-wider mt-1">
                                Points
                            </div>
                        </div>

                        {/* Score */}
                        <div className="rounded-xl dark:bg-white/[0.03] bg-zinc-50 border dark:border-white/5 border-zinc-200 p-4 text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Star className="w-4 h-4 text-amber-400" />
                            </div>
                            <div className="text-2xl font-black dark:text-white text-zinc-900 font-mono">
                                {result.correctAnswers}/{result.totalQuestions}
                            </div>
                            <div className="text-[10px] dark:text-zinc-500 text-zinc-400 font-bold uppercase tracking-wider mt-1">
                                Solved
                            </div>
                        </div>

                        {/* Streak */}
                        <div className="rounded-xl dark:bg-white/[0.03] bg-zinc-50 border dark:border-white/5 border-zinc-200 p-4 text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Flame className="w-4 h-4 text-orange-400" />
                            </div>
                            <div className="text-2xl font-black dark:text-white text-zinc-900 font-mono">
                                {result.updatedStreak}
                            </div>
                            <div className="text-[10px] dark:text-zinc-500 text-zinc-400 font-bold uppercase tracking-wider mt-1">
                                Day Streak
                            </div>
                        </div>
                    </div>

                    {/* Difficulty Breakdown */}
                    <div className="rounded-xl dark:bg-white/[0.03] bg-zinc-50 border dark:border-white/5 border-zinc-200 p-4 mb-6">
                        <div className="text-[10px] dark:text-zinc-500 text-zinc-400 font-bold uppercase tracking-wider mb-3">
                            Difficulty Breakdown
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-xs dark:text-zinc-300 text-zinc-700 font-mono">
                                    Easy: {result.difficultyBreakdown.easy}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                <span className="text-xs dark:text-zinc-300 text-zinc-700 font-mono">
                                    Medium: {result.difficultyBreakdown.medium}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                <span className="text-xs dark:text-zinc-300 text-zinc-700 font-mono">
                                    Hard: {result.difficultyBreakdown.hard}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Total Rating */}
                    <div className="rounded-xl dark:bg-white/[0.03] bg-zinc-50 border dark:border-white/5 border-zinc-200 p-4 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                            <div>
                                <div className="text-xs dark:text-zinc-400 text-zinc-500 font-medium">Total Rating</div>
                                <div className="text-lg font-bold dark:text-white text-zinc-900 font-mono">{result.totalPoints}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs dark:text-zinc-400 text-zinc-500 font-medium">Accuracy</div>
                            <div className="text-lg font-bold text-emerald-400 font-mono">{scorePercent}%</div>
                        </div>
                    </div>

                    {/* Level Up Banner */}
                    {result.newLevel && lvl && (
                        <div className={cn(
                            "rounded-xl border p-4 mb-6 flex items-center gap-4",
                            "bg-gradient-to-r", lvl.gradient, "bg-opacity-10",
                            "border-current/20",
                            "animate-in slide-in-from-bottom-4 fade-in duration-500"
                        )}>
                            <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center">
                                <ArrowUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-white font-bold text-sm">Level Up!</div>
                                <div className="text-white/70 text-xs font-mono">
                                    You are now {result.newLevel}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* New Badges */}
                    {showBadges && result.newBadges.length > 0 && (
                        <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <div className="text-[10px] dark:text-zinc-500 text-zinc-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Award className="w-3 h-3" />
                                New Badges Unlocked
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {result.newBadges.map((badge) => (
                                    <div
                                        key={badge.uuid}
                                        className="rounded-xl dark:bg-amber-500/5 bg-amber-50 border dark:border-amber-500/20 border-amber-200 p-3 text-center"
                                    >
                                        <Award className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                                        <div className="text-xs font-bold dark:text-white text-zinc-900">{badge.name}</div>
                                        <div className="text-[10px] dark:text-zinc-500 text-zinc-500 mt-0.5">{badge.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="px-8 pb-8 sm:justify-center">
                    <button
                        onClick={onClose}
                        className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] font-mono uppercase tracking-wider"
                    >
                        Continue
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
