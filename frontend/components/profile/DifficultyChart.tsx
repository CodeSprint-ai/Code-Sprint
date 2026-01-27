'use client';

import React from 'react';
import { DifficultyDistribution } from '@/types/profile';

interface DifficultyChartProps {
    distribution: DifficultyDistribution;
}

function ProgressBar({
    label,
    solved,
    total,
    color,
    bgColor
}: {
    label: string;
    solved: number;
    total: number;
    color: string;
    bgColor: string;
}) {
    const percentage = total > 0 ? (solved / total) * 100 : 0;

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${color}`}>{label}</span>
                <span className="text-sm text-slate-400">
                    <span className="text-white font-semibold">{solved}</span> / {total}
                </span>
            </div>
            <div className={`h-3 rounded-full ${bgColor} overflow-hidden`}>
                <div
                    className={`h-full rounded-full transition-all duration-500 ease-out`}
                    style={{
                        width: `${percentage}%`,
                        background: color.includes('green')
                            ? 'linear-gradient(90deg, #22C55E, #34D399)'
                            : color.includes('yellow')
                                ? 'linear-gradient(90deg, #EAB308, #FBBF24)'
                                : 'linear-gradient(90deg, #EF4444, #F87171)'
                    }}
                />
            </div>
        </div>
    );
}

export function DifficultyChart({ distribution }: DifficultyChartProps) {
    const totalSolved = distribution.easy.solved + distribution.medium.solved + distribution.hard.solved;
    const totalProblems = distribution.easy.total + distribution.medium.total + distribution.hard.total;

    return (
        <div className="rounded-xl bg-slate-900/50 border border-slate-700/50 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Solved Problems</h3>
                <div className="text-right">
                    <span className="text-2xl font-bold text-white">{totalSolved}</span>
                    <span className="text-slate-400 text-sm ml-1">/ {totalProblems}</span>
                </div>
            </div>

            <div className="space-y-4">
                <ProgressBar
                    label="Easy"
                    solved={distribution.easy.solved}
                    total={distribution.easy.total}
                    color="text-green-400"
                    bgColor="bg-green-500/10"
                />

                <ProgressBar
                    label="Medium"
                    solved={distribution.medium.solved}
                    total={distribution.medium.total}
                    color="text-yellow-400"
                    bgColor="bg-yellow-500/10"
                />

                <ProgressBar
                    label="Hard"
                    solved={distribution.hard.solved}
                    total={distribution.hard.total}
                    color="text-red-400"
                    bgColor="bg-red-500/10"
                />
            </div>

            {/* Donut chart visualization */}
            <div className="mt-6 flex justify-center">
                <div className="relative w-40 h-40">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="rgba(100, 116, 139, 0.2)"
                            strokeWidth="12"
                        />

                        {/* Easy segment */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#22C55E"
                            strokeWidth="12"
                            strokeDasharray={`${(distribution.easy.solved / (totalSolved || 1)) * 251.2} 251.2`}
                            strokeDashoffset="0"
                            className="transition-all duration-500"
                        />

                        {/* Medium segment */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#EAB308"
                            strokeWidth="12"
                            strokeDasharray={`${(distribution.medium.solved / (totalSolved || 1)) * 251.2} 251.2`}
                            strokeDashoffset={`${-(distribution.easy.solved / (totalSolved || 1)) * 251.2}`}
                            className="transition-all duration-500"
                        />

                        {/* Hard segment */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#EF4444"
                            strokeWidth="12"
                            strokeDasharray={`${(distribution.hard.solved / (totalSolved || 1)) * 251.2} 251.2`}
                            strokeDashoffset={`${-((distribution.easy.solved + distribution.medium.solved) / (totalSolved || 1)) * 251.2}`}
                            className="transition-all duration-500"
                        />
                    </svg>

                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-white">{totalSolved}</span>
                        <span className="text-xs text-slate-400">solved</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DifficultyChart;
