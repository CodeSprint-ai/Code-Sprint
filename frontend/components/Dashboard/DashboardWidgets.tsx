"use client";

import React from "react";
import {
    Trophy,
    Calendar,
    ChevronRight,
    BookOpen,
    Target,
    Code2,
    ArrowRight,
    Cpu,
    MoreHorizontal,
    TrendingUp,
    TrendingDown,
    Activity,
    Flame,
} from "lucide-react";
import { ActivityChart, DifficultyChart, ActivityChartData } from "./StatsCharts";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

// Types for widget props
interface RankPanelProps {
    totalSolved?: number;
    currentStreak?: number;
}

interface RecentActivityItem {
    title: string;
    status: "Passed" | "Failed";
    lang: string;
    problemUuid?: string;
}

interface RecentActivityProps {
    activities?: RecentActivityItem[];
    isLoading?: boolean;
}

interface MasteryCardProps {
    easy?: number;
    medium?: number;
    hard?: number;
    isLoading?: boolean;
}

interface WeeklyVelocityCardProps {
    weeklyData?: ActivityChartData[];
    total?: number;
    percentChange?: number;
    isLoading?: boolean;
}

interface ChallengeCardProps {
    problem?: {
        title: string;
        description: string;
        difficulty: "EASY" | "MEDIUM" | "HARD";
        slug: string;
        tags?: string[];
    };
}

// Rank Panel Component - Shows streak instead of rank for now
export function RankPanel({ totalSolved = 0, currentStreak = 0 }: RankPanelProps) {
    return (
        <div className="bg-gradient-to-b dark:from-[#09090b] dark:to-black from-white to-zinc-50 border dark:border-white/5 border-zinc-200 rounded-xl p-6 relative overflow-hidden group shadow-sm dark:shadow-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 dark:text-zinc-400 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                    <Flame className="w-3.5 h-3.5 text-orange-500" /> Current Streak
                </div>
                <div className="text-5xl font-black dark:text-white text-zinc-900 tracking-tight mb-2">
                    {currentStreak} <span className="text-2xl dark:text-zinc-500 text-zinc-400">days</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-xs dark:text-zinc-500 text-zinc-500">
                        Total Solved: <span className="text-emerald-400 font-bold">{totalSolved}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Recent Activity Component
export function RecentActivity({ activities = [], isLoading = false }: RecentActivityProps) {
    return (
        <div className="dark:bg-[#09090b] bg-white border dark:border-white/5 border-zinc-200 rounded-xl flex flex-col shadow-sm dark:shadow-none">
            <div className="px-5 py-4 border-b dark:border-white/5 border-zinc-200 flex justify-between items-center">
                <h3 className="text-xs font-bold dark:text-white text-zinc-800 uppercase tracking-wider">
                    Recent Activity
                </h3>
                <Calendar className="w-3.5 h-3.5 dark:text-zinc-500 text-zinc-400" />
            </div>
            <div className="divide-y dark:divide-white/5 divide-zinc-100">
                {isLoading ? (
                    <div className="p-5 space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                                <Skeleton className="h-5 w-12 rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : activities.length === 0 ? (
                    <div className="px-5 py-8 text-center dark:text-zinc-500 text-zinc-400 text-sm">
                        No recent submissions
                    </div>
                ) : (
                    activities.map((item, i) => (
                        <div
                            key={i}
                            className="px-5 py-4 dark:hover:bg-white/[0.02] hover:bg-zinc-50 transition-colors cursor-pointer group"
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm font-medium dark:text-zinc-300 text-zinc-700 group-hover:text-emerald-400 transition-colors">
                                    {item.title}
                                </span>
                                <span
                                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.status === "Passed"
                                        ? "bg-emerald-500/10 text-emerald-400"
                                        : "bg-red-500/10 text-red-400"
                                        }`}
                                >
                                    {item.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] dark:text-zinc-500 text-zinc-400">
                                <span className="font-mono">{item.lang}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="p-3">
                <Link href="/submission">
                    <button className="w-full py-2 text-xs font-bold dark:text-zinc-500 text-zinc-500 dark:hover:text-white hover:text-zinc-800 dark:hover:bg-white/5 hover:bg-zinc-50 rounded-lg transition-colors border border-transparent dark:hover:border-white/5 hover:border-zinc-200">
                        View All History
                    </button>
                </Link>
            </div>
        </div>
    );
}

// Learning Path Component (Placeholder for future implementation)
export function LearningPath() {
    return (
        <div className="dark:bg-[#09090b] bg-white border dark:border-white/5 border-zinc-200 rounded-xl p-6 relative overflow-hidden shadow-sm dark:shadow-none">
            <div className="absolute top-0 right-0 p-6 opacity-5">
                <BookOpen className="w-20 h-20 dark:text-white text-zinc-900" />
            </div>

            <div className="relative z-10 mb-6">
                <div className="flex items-center gap-2 mb-3 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                    <BookOpen className="w-3.5 h-3.5" /> Current Path
                </div>
                <h4 className="text-lg font-bold dark:text-white text-zinc-800 mb-1">Data Structures II</h4>
                <p className="text-xs dark:text-zinc-500 text-zinc-500">
                    Advanced trees and graph algorithms.
                </p>
            </div>

            <div className="relative z-10">
                <div className="flex justify-between text-[10px] font-bold dark:text-zinc-400 text-zinc-500 mb-2 uppercase">
                    <span>Progress</span>
                    <span className="dark:text-white text-zinc-800">75%</span>
                </div>
                <div className="w-full h-1 dark:bg-zinc-800 bg-zinc-200 rounded-full overflow-hidden mb-6">
                    <div className="h-full w-3/4 bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                </div>

                <button className="w-full py-3 dark:bg-white/5 bg-zinc-50 dark:hover:bg-white/10 hover:bg-zinc-100 border dark:border-white/5 border-zinc-200 dark:hover:border-white/10 hover:border-zinc-300 text-xs font-bold dark:text-white text-zinc-800 rounded-lg transition-all flex items-center justify-center gap-2 group">
                    Continue
                    <ChevronRight className="w-3.5 h-3.5 dark:text-zinc-500 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                </button>
            </div>
        </div>
    );
}

// Weekly Velocity Card Component
export function WeeklyVelocityCard({
    weeklyData = [],
    total = 0,
    percentChange = 0,
    isLoading = false
}: WeeklyVelocityCardProps) {
    const isPositive = percentChange >= 0;

    return (
        <div className="dark:bg-[#09090b] bg-white border dark:border-white/5 border-zinc-200 rounded-xl overflow-hidden dark:hover:border-emerald-500/20 hover:border-emerald-300 transition-all shadow-sm dark:shadow-lg">
            <div className="px-6 py-5 border-b dark:border-white/5 border-zinc-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <Activity className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold dark:text-white text-zinc-800 tracking-wide">
                            Weekly Velocity
                        </h3>
                        <p className="text-[10px] dark:text-zinc-500 text-zinc-400 font-mono">
                            Problems solved over last 7 days
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <span className="text-2xl font-bold dark:text-white text-zinc-800 leading-none">{total}</span>
                        <span className="text-[10px] dark:text-zinc-500 text-zinc-400 ml-1">Total</span>
                    </div>
                    {percentChange !== 0 && (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold border ${isPositive
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
                                : "bg-red-500/10 text-red-400 border-red-500/10"
                            }`}>
                            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {isPositive ? '+' : ''}{percentChange}%
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 h-[300px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Skeleton className="h-full w-full rounded-lg" />
                    </div>
                ) : (
                    <ActivityChart data={weeklyData.length > 0 ? weeklyData : undefined} />
                )}
            </div>
        </div>
    );
}

// Mastery Card Component
export function MasteryCard({ easy = 0, medium = 0, hard = 0, isLoading = false }: MasteryCardProps) {
    return (
        <div className="dark:bg-[#09090b] bg-white border dark:border-white/5 border-zinc-200 rounded-xl p-6 flex flex-col dark:hover:border-white/10 hover:border-zinc-300 transition-all shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-bold dark:text-white text-zinc-800">Mastery Level</h3>
                </div>
                <MoreHorizontal className="w-4 h-4 dark:text-zinc-600 text-zinc-400 cursor-pointer dark:hover:text-white hover:text-zinc-800" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-48 h-48 relative">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Skeleton className="w-40 h-40 rounded-full" />
                        </div>
                    ) : (
                        <DifficultyChart easy={easy} medium={medium} hard={hard} />
                    )}
                </div>

                <div className="flex justify-center gap-4 w-full mt-2">
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-emerald-400">{easy}</span>
                        <span className="text-[10px] dark:text-zinc-500 text-zinc-400 uppercase">Easy</span>
                    </div>
                    <div className="w-px h-8 dark:bg-white/10 bg-zinc-200" />
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-blue-400">{medium}</span>
                        <span className="text-[10px] dark:text-zinc-500 text-zinc-400 uppercase">Med</span>
                    </div>
                    <div className="w-px h-8 dark:bg-white/10 bg-zinc-200" />
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-purple-400">{hard}</span>
                        <span className="text-[10px] dark:text-zinc-500 text-zinc-400 uppercase">Hard</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Challenge Card Component
export function ChallengeCard({ problem }: ChallengeCardProps) {
    const defaultProblem = {
        title: "Start Solving",
        description: "Head to the problems page to start your coding journey!",
        difficulty: "EASY" as const,
        slug: "",
        tags: ["Getting Started"],
    };

    const displayProblem = problem || defaultProblem;
    const difficultyColors = {
        EASY: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        MEDIUM: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        HARD: "bg-red-500/10 text-red-400 border-red-500/20",
    };

    return (
        <Link href={displayProblem.slug ? `/problem/${displayProblem.slug}` : "/problem"}>
            <div className="dark:bg-[#09090b] bg-white border dark:border-white/5 border-zinc-200 rounded-xl p-6 flex flex-col relative overflow-hidden group dark:hover:border-emerald-500/30 hover:border-emerald-300 transition-all cursor-pointer h-full shadow-sm dark:shadow-none">
                <div className="absolute top-0 right-0 p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${difficultyColors[displayProblem.difficulty]}`}>
                        {displayProblem.difficulty}
                    </span>
                </div>

                <div className="mb-4">
                    <div className="w-10 h-10 dark:bg-white/5 bg-zinc-100 rounded-lg flex items-center justify-center mb-4 border dark:border-white/5 border-zinc-200 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                        <Target className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold dark:text-white text-zinc-800 mb-2">{displayProblem.title}</h4>
                    <p className="text-xs dark:text-zinc-500 text-zinc-500 line-clamp-2">
                        {displayProblem.description}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {displayProblem.tags?.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="text-[10px] dark:text-zinc-400 text-zinc-500 dark:bg-white/5 bg-zinc-100 px-2 py-1 rounded border dark:border-white/5 border-zinc-200"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="mt-auto pt-4 border-t dark:border-white/5 border-zinc-200 flex items-center justify-between">
                    <span className="text-xs dark:text-zinc-500 text-zinc-500 font-mono flex items-center gap-1">
                        <Code2 className="w-3 h-3" /> Any Language
                    </span>
                    <div className="flex items-center text-emerald-400 text-xs font-bold gap-1 group-hover:gap-2 transition-all">
                        Solve Now <ArrowRight className="w-3 h-3" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
