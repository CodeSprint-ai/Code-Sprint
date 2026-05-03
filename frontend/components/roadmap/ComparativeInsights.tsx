'use client';

import { ComparativeInsight } from '@/types/roadmap';

interface Props {
    insights: ComparativeInsight[];
}

export function ComparativeInsights({ insights }: Props) {
    if (!insights || insights.length === 0) {
        return (
            <div className="dark:bg-white/[0.03] bg-white border dark:border-white/[0.06] border-zinc-200 rounded-2xl p-5 shadow-sm dark:shadow-none">
                <h3 className="text-sm font-semibold dark:text-slate-400 text-zinc-500 mb-3">Speed Insights</h3>
                <p className="text-xs dark:text-slate-500 text-zinc-500">Solve more problems to unlock speed comparisons.</p>
            </div>
        );
    }

    return (
        <div className="dark:bg-white/[0.03] bg-white border dark:border-white/[0.06] border-zinc-200 rounded-2xl p-5 shadow-sm dark:shadow-none">
            <h3 className="text-sm font-semibold dark:text-slate-400 text-zinc-500 mb-4 flex items-center gap-2">
                <span>📊</span> Speed Insights
            </h3>
            <div className="space-y-3">
                {insights.slice(0, 5).map((insight) => {
                    const pct = Math.round(parseFloat(String(insight.speed_percentile)));
                    const color = pct >= 70
                        ? 'bg-green-500'
                        : pct >= 40
                            ? 'bg-yellow-500'
                            : 'bg-red-400';
                    const textColor = pct >= 70
                        ? 'text-green-400'
                        : pct >= 40
                            ? 'text-yellow-400'
                            : 'text-red-400';

                    return (
                        <div key={insight.topic_name} className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs dark:text-slate-300 text-zinc-700 font-medium">
                                    {insight.topic_name.replace(/_/g, ' ')}
                                </span>
                                <span className={`text-xs font-bold ${textColor}`}>
                                    Top {100 - pct}%
                                </span>
                            </div>
                            <div className="h-1.5 dark:bg-white/5 bg-zinc-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <p className="text-[10px] dark:text-slate-500 text-zinc-500">
                                Faster than {pct}% of users
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
