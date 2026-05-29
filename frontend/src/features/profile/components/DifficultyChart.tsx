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
    colorClass,
    glowColor,
}: {
    label: string;
    solved: number;
    total: number;
    colorClass: string;
    glowColor: string;
}) {
    const percentage = total > 0 ? (solved / total) * 100 : 0;

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs">
                <span className={`font-bold ${colorClass}`}>{label}</span>
                <span className="font-mono text-zinc-400">
                    <span className="dark:text-white text-zinc-900">{solved}</span> / {total}
                </span>
            </div>
            <div className="h-2 w-full dark:bg-zinc-900 bg-zinc-200 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: glowColor,
                        boxShadow: percentage > 0 ? `0 0 10px ${glowColor}` : 'none',
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
        <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-end mb-2">
                <div className="text-sm font-medium dark:text-white text-zinc-900">Solved Problems</div>
                <div className="text-sm font-mono font-bold text-zinc-400">
                    <span className="dark:text-white text-zinc-900 text-lg">{totalSolved}</span>{' '}
                    <span className="text-zinc-600">/</span> {totalProblems}
                </div>
            </div>

            {/* Easy */}
            <ProgressBar
                label="Easy"
                solved={distribution.easy.solved}
                total={distribution.easy.total}
                colorClass="text-emerald-500"
                glowColor="#10b981"
            />

            {/* Medium */}
            <ProgressBar
                label="Medium"
                solved={distribution.medium.solved}
                total={distribution.medium.total}
                colorClass="text-yellow-500"
                glowColor="#eab308"
            />

            {/* Hard */}
            <ProgressBar
                label="Hard"
                solved={distribution.hard.solved}
                total={distribution.hard.total}
                colorClass="text-red-500"
                glowColor="#ef4444"
            />
        </div>
    );
}

export default DifficultyChart;
