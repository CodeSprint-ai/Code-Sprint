"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Lightbulb,
    Lock,
    ThumbsUp,
    ThumbsDown,
    AlertCircle,
    Check,
    Loader2,
} from "lucide-react";
import { useHints } from "@/hooks/useHints";
import { toast } from "sonner";

/**
 * Penalty amounts per level — must match backend HINT_PENALTIES.
 */
const HINT_PENALTIES: Record<number, number> = {
    1: 5,
    2: 10,
    3: 15,
    4: 20,
};

const LEVEL_LABELS: Record<number, string> = {
    1: "Thinking Direction",
    2: "Approach",
    3: "Pseudocode",
    4: "Solution",
};

interface HintSystemProps {
    problemUuid: string;
}

export default function HintSystem({ problemUuid }: HintSystemProps) {
    const {
        hints,
        levelReached,
        totalPenalty,
        hintsRemaining,
        isLoadingUsage,
        isUnlocking,
        error,
        unlockNextHint,
        submitFeedback,
    } = useHints(problemUuid);

    // Track which hints have received feedback (local UI state)
    const [feedbackGiven, setFeedbackGiven] = useState<
        Record<string, "up" | "down">
    >({});

    const handleFeedback = (hintUuid: string, isUseful: boolean) => {
        submitFeedback(hintUuid, isUseful);
        setFeedbackGiven((prev) => ({
            ...prev,
            [hintUuid]: isUseful ? "up" : "down",
        }));
        toast.success(isUseful ? "Thanks for the feedback!" : "We'll improve this hint.");
    };

    const handleUnlock = () => {
        unlockNextHint();
    };

    if (isLoadingUsage) {
        return (
            <div className="mt-8 border-t border-white/5 pt-6">
                <div className="flex items-center gap-2 text-zinc-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading hints...
                </div>
            </div>
        );
    }

    const nextLevel = levelReached + 1;
    const nextPenalty = HINT_PENALTIES[nextLevel] || 0;

    return (
        <div className="mt-8 border-t border-white/5 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-emerald-400 font-semibold text-sm flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Problem Hints
                </h3>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                    {levelReached} / 4 Unlocked
                </span>
            </div>

            {/* Progress Steps */}
            <div className="flex gap-1.5 mb-4">
                {[1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-500 ${level <= levelReached
                                ? "bg-emerald-500"
                                : "bg-white/5"
                            }`}
                    />
                ))}
            </div>

            {/* Penalty Indicator */}
            {totalPenalty > 0 && (
                <div className="mb-4 px-3 py-1.5 bg-red-500/5 border border-red-500/10 rounded-md inline-flex items-center gap-1.5">
                    <span className="text-[10px] text-red-400/70 font-mono">
                        Score Penalty: -{totalPenalty} pts
                    </span>
                </div>
            )}

            {/* Revealed Hints */}
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {hints.map((hint) => (
                        <motion.div
                            key={hint.uuid}
                            initial={{ opacity: 0, y: 12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="bg-black/40 border border-emerald-500/10 rounded-lg overflow-hidden"
                        >
                            {/* Card Header */}
                            <div className="bg-emerald-500/5 px-4 py-2 border-b border-emerald-500/10 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                                        Level {hint.level}
                                    </span>
                                    <span className="text-[10px] text-zinc-600">
                                        · {LEVEL_LABELS[hint.level]}
                                    </span>
                                </div>

                                {/* Feedback Buttons */}
                                {feedbackGiven[hint.uuid] ? (
                                    <span className="flex items-center gap-1 text-[10px] text-zinc-600">
                                        <Check className="w-3 h-3 text-emerald-500" />
                                        Feedback sent
                                    </span>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleFeedback(hint.uuid, true)}
                                            className="hover:text-emerald-400 text-zinc-600 transition-colors p-0.5"
                                            title="Helpful"
                                        >
                                            <ThumbsUp className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() => handleFeedback(hint.uuid, false)}
                                            className="hover:text-red-400 text-zinc-600 transition-colors p-0.5"
                                            title="Not helpful"
                                        >
                                            <ThumbsDown className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="p-4 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                {hint.content}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-xs text-red-300"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Unlock Next Hint Button */}
                {hintsRemaining > 0 && (
                    <motion.button
                        onClick={handleUnlock}
                        disabled={isUnlocking}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full group relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-white/5 hover:border-emerald-500/30 rounded-lg transition-all bg-transparent hover:bg-emerald-500/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-center gap-2 text-zinc-500 group-hover:text-emerald-400 font-medium text-sm transition-colors">
                            {isUnlocking ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <Lock className="w-3.5 h-3.5" />
                                    <span>
                                        Reveal Hint {nextLevel}
                                        <span className="text-zinc-600 font-normal ml-1.5">
                                            · {LEVEL_LABELS[nextLevel]}
                                        </span>
                                    </span>
                                </>
                            )}
                        </div>
                        <p className="text-[10px] text-zinc-600 group-hover:text-emerald-600/60 mt-1 uppercase tracking-wider transition-colors">
                            Will deduct {nextPenalty} points from score
                        </p>
                    </motion.button>
                )}

                {/* All Hints Exhausted State */}
                {hintsRemaining === 0 && levelReached > 0 && (
                    <div className="text-center py-3">
                        <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
                            All hints revealed · Total penalty: -{totalPenalty} pts
                        </span>
                    </div>
                )}
            </div>

            {/* Level 3+ Warning */}
            {levelReached >= 2 && hintsRemaining > 0 && nextLevel >= 3 && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex gap-2 p-3 bg-amber-500/5 border border-amber-500/10 rounded-md"
                >
                    <AlertCircle className="w-4 h-4 text-amber-500/60 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-200/50 leading-relaxed">
                        {nextLevel === 3
                            ? "The next hint provides pseudocode. Try solving it with just the approach first!"
                            : "Level 4 reveals the full solution. Are you sure you want to see it?"}
                    </p>
                </motion.div>
            )}
        </div>
    );
}
