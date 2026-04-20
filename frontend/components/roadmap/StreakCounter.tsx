'use client';

import { StreakData } from '@/types/roadmap';

interface Props {
    streak: StreakData;
}

export function StreakCounter({ streak }: Props) {
    const { current, longest, todayActive } = streak;

    return (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden group">
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
                            <p className="text-2xl font-black text-white tracking-tight">
                                {current}-day streak!
                            </p>
                            <p className="text-xs text-slate-400">
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
                            <p className="text-lg font-bold text-slate-300">
                                Start your streak!
                            </p>
                            <p className="text-xs text-slate-500">
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
                                        : 'bg-white/[0.02] text-slate-600 border-white/5'
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
