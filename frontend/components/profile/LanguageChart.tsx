'use client';

import React from 'react';
import { LanguageUsage } from '@/types/profile';

interface LanguageChartProps {
    usage: LanguageUsage;
}

const languageColors: Record<string, string> = {
    python: '#3572A5',
    java: '#B07219',
    cpp: '#f34b7d',
    javascript: '#f1e05a',
    typescript: '#2b7489',
    csharp: '#178600',
    go: '#00ADD8',
    rust: '#dea584',
    ruby: '#701516',
};

export function LanguageChart({ usage }: LanguageChartProps) {
    const languages = Object.entries(usage)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Top 5 languages

    if (languages.length === 0) {
        return (
            <div className="bg-[#111] rounded-xl p-6 border border-white/5">
                <h4 className="text-xs font-bold text-white mb-6">Language Usage</h4>
                <p className="text-zinc-500 text-center py-8">No submissions yet</p>
            </div>
        );
    }

    // Get dominant language color for glow
    const dominantColor = languageColors[languages[0]?.[0]?.toLowerCase()] || '#2563eb';

    return (
        <div className="dark:bg-[#111] bg-white rounded-xl p-6 border dark:border-white/5 border-zinc-200">
            <h4 className="text-xs font-bold dark:text-white text-zinc-900 mb-6">Language Usage</h4>

            {/* Bar composition */}
            <div className="h-2 w-full dark:bg-zinc-800 bg-zinc-200 rounded-full overflow-hidden flex mb-4">
                {languages.map(([lang, percentage]) => {
                    const color = languageColors[lang.toLowerCase()] || '#6366F1';
                    return (
                        <div
                            key={lang}
                            style={{
                                width: `${percentage}%`,
                                backgroundColor: color,
                                boxShadow: `0 0 10px ${color}`,
                            }}
                            className="h-full first:rounded-l-full last:rounded-r-full transition-all"
                            title={`${lang}: ${percentage}%`}
                        />
                    );
                })}
            </div>

            {/* Legend */}
            <div className="space-y-2">
                {languages.map(([lang, percentage]) => (
                    <div key={lang} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: languageColors[lang.toLowerCase()] || '#6366F1' }}
                            />
                            <span className="dark:text-zinc-300 text-zinc-700 font-medium capitalize">{lang}</span>
                        </div>
                        <span className="dark:text-zinc-500 text-zinc-400 font-mono">{percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LanguageChart;
