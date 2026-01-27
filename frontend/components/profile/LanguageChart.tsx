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
            <div className="rounded-xl bg-slate-900/50 border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Language Usage</h3>
                <p className="text-slate-400 text-center py-8">No submissions yet</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-slate-900/50 border border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Language Usage</h3>

            {/* Bar composition */}
            <div className="h-4 rounded-full overflow-hidden flex mb-6">
                {languages.map(([lang, percentage]) => (
                    <div
                        key={lang}
                        style={{
                            width: `${percentage}%`,
                            backgroundColor: languageColors[lang.toLowerCase()] || '#6366F1',
                        }}
                        className="first:rounded-l-full last:rounded-r-full transition-all hover:opacity-80"
                        title={`${lang}: ${percentage}%`}
                    />
                ))}
            </div>

            {/* Legend */}
            <div className="space-y-3">
                {languages.map(([lang, percentage]) => (
                    <div key={lang} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: languageColors[lang.toLowerCase()] || '#6366F1' }}
                            />
                            <span className="text-sm text-white capitalize">{lang}</span>
                        </div>
                        <span className="text-sm text-slate-400">{percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LanguageChart;
