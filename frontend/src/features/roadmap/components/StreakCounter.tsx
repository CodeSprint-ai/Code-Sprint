'use client';

import { StreakData } from '@/types/roadmap';

interface Props {
    streak: StreakData;
}

export function StreakCounter({ streak }: Props) {
    const { current, longest, todayActive } = streak;

    return (
        <div className="dark:bg-white/[0.03] bg-white border dark:border-white/[0.06] border-zinc-200 rounded-2xl p-5 relative overflow-hidden group shadow-sm dark:shadow-none">
            {/* Background fire glow for active streaks */}
            {current >= 3 && (
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 blur-[60px] rounded-full group-hover:bg-orange-500/20 transition-all duration-700" />
            )}

            <div className="relative z-10 flex items-center gap-4">
                {/* Fire icon with pulse animation */}
                <div className="relative">
                    <span
                        className={`text-4xl transition-transform duration-300 inline-block ${current > 0
                                ? 'animate-bounce'
                                : 'opacity-40 grayscale'
                            }`}
                        style={{
                            animationDuration: '2s',
                            animationIterationCount: current > 0 ? 'infinite' : '0',
                        }}
                    >
                        🔥
                    </span>
                    {current >= 7 && (
                        <span className="absolute -top-1 -right-1 text-xs">⚡</span>
                    )}
                </div>

                <div className="space-y-1 flex-1">
                    {current > 0 ? (
                        <>
                            <p className="text-2xl font-black dark:text-white text-zinc-900 tracking-tight">
                                {current}-day streak!
                            </p>
                            <p className="text-xs dark:text-slate-400 text-zinc-500">
                                {todayActive ? (
                                    <span className="text-green-400 font-semibold">✓ Active today</span>
                                ) : (
                                    <span className="text-amber-400 font-semibold">⏳ Solve today to keep it!</span>
                                )}
                                {' · '}
                                Best: {longest} days
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-lg font-bold dark:text-slate-300 text-zinc-700">
                                Start your streak!
                            </p>
                            <p className="text-xs dark:text-slate-500 text-zinc-500">
                                Solve a problem today to begin
                                {longest > 0 && ` · Best ever: ${longest} days`}
                            </p>
                        </>
                    )}
                </div>

                {/* Streak milestones */}
                {current > 0 && (
                    <div className="hidden sm:flex flex-col items-end gap-0.5">
                        {[3, 7, 14, 30].map((milestone) => (
                            <div
                                key={milestone}
                                className={`text-[9px] font-bold px-2 py-0.5 rounded-full border tracking-wider ${current >= milestone
                                        ? 'bg-orange-500/15 text-orange-400 border-orange-500/25'
                                        : 'dark:bg-white/[0.02] bg-zinc-100 dark:text-slate-600 text-zinc-400 dark:border-white/5 border-zinc-200'
                                    }`}
                            >
                                {milestone}d{current >= milestone ? ' ✓' : ''}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
