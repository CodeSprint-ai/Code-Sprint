'use client';

import { useRoadmap } from '@/hooks/useRoadmap';
import { MasteryRadarChart } from '@/components/roadmap/MasteryRadarChart';
import { WeeklyGoalRing } from '@/components/roadmap/WeeklyGoalRing';
import { BadgeCollection } from '@/components/roadmap/BadgeCollection';
import { StreakCounter } from '@/components/roadmap/StreakCounter';
import { ComparativeInsights } from '@/components/roadmap/ComparativeInsights';
import { ProgressTimeline } from '@/components/roadmap/ProgressTimeline';
import { useAuthStore } from '@/store/authStore';
import { DailySuggestion } from '@/types/roadmap';
import Link from 'next/link';

/* ───── Skeleton loader ───── */
function SkeletonRoadmap() {
    return (
        <div className="animate-pulse grid grid-cols-12 gap-6 p-6">
            <div className="col-span-12 lg:col-span-8 space-y-6">
                <div className="space-y-4">
                    <div className="h-4 dark:bg-white/5 bg-zinc-200 rounded w-24" />
                    <div className="h-10 dark:bg-white/5 bg-zinc-200 rounded w-1/2" />
                    <div className="h-4 dark:bg-white/5 bg-zinc-200 rounded w-full" />
                </div>
                <div className="space-y-3">
                    <div className="h-6 dark:bg-white/5 bg-zinc-200 rounded w-32 mb-4" />
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 dark:bg-white/5 bg-zinc-200 rounded-2xl border dark:border-white/5 border-zinc-200" />
                    ))}
                </div>
            </div>
            <div className="col-span-12 lg:col-span-4 space-y-6">
                <div className="h-20 dark:bg-white/5 bg-zinc-200 rounded-2xl" />
                <div className="h-48 dark:bg-white/5 bg-zinc-200 rounded-2xl" />
                <div className="h-72 dark:bg-white/5 bg-zinc-200 rounded-2xl" />
                <div className="h-32 dark:bg-white/5 bg-zinc-200 rounded-2xl" />
            </div>
        </div>
    );
}

/* ───── Daily Challenge Card (highlighted) ───── */
function DailyChallengeCard({ problem }: { problem: DailySuggestion }) {
    return (
        <Link
            href={`/problems/${problem.problemId}`}
            className="group block relative rounded-2xl p-5 transition-all border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/[0.06] via-transparent to-transparent hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]"
        >
            {/* Daily Challenge badge */}
            <div className="absolute -top-3 left-5 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <span>🎯</span> Challenge of the Day
            </div>

            <div className="flex items-start justify-between gap-4 mt-2">
                <div className="space-y-1">
                    <h3 className="font-bold dark:text-amber-200 text-amber-700 group-hover:text-amber-300 transition-colors text-lg">
                        {problem.title}
                    </h3>
                    <p className="text-xs dark:text-slate-400 text-zinc-500 leading-relaxed">
                        {problem.reason}
                    </p>
                    <p className="text-[10px] dark:text-amber-500/70 text-amber-600 font-semibold mt-1">
                        ⭐ Bonus XP for completing the daily challenge!
                    </p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider shrink-0 ${problem.difficulty === 'Hard'
                        ? 'text-red-400 bg-red-400/10 border-red-400/20'
                        : problem.difficulty === 'Medium'
                            ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                            : 'text-green-400 bg-green-400/10 border-green-400/20'
                    }`}>
                    {problem.difficulty}
                </span>
            </div>
        </Link>
    );
}

/* ───── Regular Problem Card ───── */
function ProblemCard({ problem }: { problem: DailySuggestion }) {
    const diffColors: Record<string, string> = {
        Easy: 'text-green-400 bg-green-400/10 border-green-400/20',
        Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
        Hard: 'text-red-400 bg-red-400/10 border-red-400/20',
    };
    const diffColor = diffColors[problem.difficulty] ?? 'text-slate-400 bg-slate-400/10 border-slate-400/20';

    return (
        <Link
            href={`/problems/${problem.problemId}`}
            className={`group block relative rounded-2xl p-5 transition-all border ${problem.solved
                ? 'bg-green-500/[0.04] border-green-500/20 hover:border-green-500/40'
                : 'dark:bg-white/[0.02] bg-zinc-50 dark:border-white/[0.06] border-zinc-200 hover:border-green-500/30 dark:hover:bg-white/[0.04] hover:bg-zinc-100'
                }`}
        >
            {problem.solved && (
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500 rounded-l-2xl" />
            )}
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className={`font-semibold transition-colors ${problem.solved
                            ? 'text-green-400'
                            : 'dark:text-slate-100 text-zinc-800 group-hover:text-green-400'
                            }`}>
                            {problem.title}
                        </h3>
                        {problem.solved && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/25 uppercase tracking-wider flex items-center gap-1">
                                ✓ Solved
                            </span>
                        )}
                    </div>
                    <p className="text-xs dark:text-slate-400 text-zinc-500 leading-relaxed">
                        {problem.reason}
                    </p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider shrink-0 ${diffColor}`}>
                    {problem.difficulty}
                </span>
            </div>
        </Link>
    );
}

/* ───── Coach Insight Icons ───── */
function getCoachIcon(): { emoji: string; label: string } {
    const hour = new Date().getHours();
    if (hour < 12) return { emoji: '☀️', label: 'Morning Motivation' };
    if (hour < 17) return { emoji: '🚀', label: 'Afternoon Push' };
    return { emoji: '🌙', label: 'Evening Reflection' };
}

/* ───── Main Page ───── */
export default function RoadmapPage() {
    const { user } = useAuthStore();
    const { roadmap, loading, error, refetch } = useRoadmap(user?.userUuid);

    if (loading) return <SkeletonRoadmap />;

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">⚠️</span>
                </div>
                <h2 className="text-xl font-bold dark:text-slate-100 text-zinc-800 mb-2">Something Went Wrong</h2>
                <p className="dark:text-slate-400 text-zinc-500 max-w-sm mb-4">
                    We couldn&apos;t load your roadmap. Please try again.
                </p>
                <button
                    onClick={() => refetch()}
                    className="px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold transition-all"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!roadmap) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">⚡</span>
                </div>
                <h2 className="text-xl font-bold dark:text-slate-100 text-zinc-800 mb-2">No Roadmap Yet</h2>
                <p className="dark:text-slate-400 text-zinc-500 max-w-sm">
                    Solve a few problems first! I need some data to build your personalized learning path.
                </p>
                <Link
                    href="/problems"
                    className="mt-6 px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold transition-all"
                >
                    Explore Problems
                </Link>
            </div>
        );
    }

    const tier = roadmap.masteryTier;
    const dailyChallenge = roadmap.dailySuggestions?.find((s) => s.isDailyChallenge);
    const regularSuggestions = roadmap.dailySuggestions?.filter((s) => !s.isDailyChallenge) || [];
    const coachMeta = getCoachIcon();

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* ─── Header section with tier theming ─── */}
            <div
                className="relative overflow-hidden border rounded-3xl p-8 transition-all duration-500"
                style={{
                    borderColor: tier ? `${tier.color}33` : 'rgba(255,255,255,0.06)',
                    background: tier
                        ? `linear-gradient(135deg, ${tier.glowColor} 0%, transparent 60%)`
                        : 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, transparent 60%)',
                }}
            >
                <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: tier?.color || '#22c55e' }}>
                            Weekly Focus
                        </p>
                        {tier && (
                            <span
                                className="text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wider"
                                style={{
                                    color: tier.color,
                                    borderColor: `${tier.color}40`,
                                    backgroundColor: `${tier.color}15`,
                                }}
                            >
                                {tier.level} · {roadmap.overallMastery}%
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl font-black dark:text-white text-zinc-900 tracking-tight">
                        {roadmap.themeOfWeek}
                    </h1>
                    <p className="dark:text-slate-400 text-zinc-500 mt-3 max-w-2xl text-lg leading-relaxed">
                        {roadmap.weeklyGoalSummary}
                    </p>
                </div>

                {/* Background abstract shape with tier color */}
                <div
                    className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 blur-[100px] rounded-full"
                    style={{ backgroundColor: tier?.glowColor || 'rgba(34,197,94,0.1)' }}
                />
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* ─── Left Column ─── */}
                <div className="col-span-12 lg:col-span-8 space-y-8">

                    {/* Daily Challenge (highlighted) */}
                    {dailyChallenge && !dailyChallenge.solved && (
                        <section className="space-y-4">
                            <DailyChallengeCard problem={dailyChallenge} />
                        </section>
                    )}

                    {/* Today's Mission */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold dark:text-slate-100 text-zinc-800 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-green-500 rounded-full" />
                            Today&apos;s Mission
                        </h2>
                        <div className="grid gap-4">
                            {regularSuggestions.map((problem) => (
                                <ProblemCard key={problem.problemId} problem={problem} />
                            ))}
                            {/* Show solved daily challenge among regular cards */}
                            {dailyChallenge && dailyChallenge.solved && (
                                <ProblemCard problem={dailyChallenge} />
                            )}
                        </div>
                    </section>

                    {/* AI Coach Insight Card with dynamic icons */}
                    <section className="bg-green-500/5 border border-green-500/10 rounded-3xl p-6 relative overflow-hidden group">
                        <div className="absolute top-4 right-6 text-4xl opacity-10 group-hover:scale-110 transition-transform duration-500">
                            {coachMeta.emoji}
                        </div>
                        <div className="relative z-10 space-y-2">
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] text-green-400 font-black uppercase tracking-widest">
                                    AI Coach Insight
                                </p>
                                <span className="text-[9px] dark:text-slate-600 text-zinc-400 font-medium">
                                    · {coachMeta.label}
                                </span>
                            </div>
                            <p className="dark:text-slate-200 text-zinc-700 text-base leading-relaxed italic">
                                &ldquo;{roadmap.coachInsight}&rdquo;
                            </p>
                            {roadmap.streak?.current > 0 && (
                                <p className="text-xs dark:text-green-400/60 text-green-600/70 mt-2">
                                    🔥 Streak-aware coaching — your {roadmap.streak.current}-day streak influences these recommendations.
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Next Week Preview */}
                    {roadmap.nextWeekPreview?.length > 0 && (
                        <section className="dark:bg-white/[0.02] bg-zinc-50 border dark:border-white/[0.06] border-zinc-200 rounded-2xl p-6">
                            <p className="text-xs dark:text-slate-500 text-zinc-500 font-bold uppercase tracking-widest mb-4">
                                Coming Next Week
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {roadmap.nextWeekPreview.map((topic: string) => (
                                    <span key={topic} className="dark:bg-white/5 bg-zinc-100 dark:text-slate-300 text-zinc-700 text-[10px] font-bold px-3 py-1.5 rounded-full border dark:border-white/5 border-zinc-200 uppercase tracking-wide">
                                        {topic.replace(/_/g, ' ')}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* ─── Right Column: Analytics & Gamification ─── */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    {/* Streak Counter */}
                    <StreakCounter streak={roadmap.streak || { current: 0, longest: 0, todayActive: false }} />

                    {/* Weekly Goal Ring with confetti */}
                    <WeeklyGoalRing
                        completed={roadmap.dailySuggestions?.filter((p) => p.solved)?.length ?? 0}
                        total={roadmap.dailySuggestions?.length ?? 3}
                        label="Weekly Challenge"
                    />

                    {/* Mastery Radar with topic levels */}
                    <MasteryRadarChart data={roadmap.topicMastery ?? []} />

                    {/* Progress Timeline */}
                    <ProgressTimeline history={roadmap.masteryHistory ?? []} />

                    {/* Comparative Insights */}
                    <ComparativeInsights insights={roadmap.comparativeInsights ?? []} />

                    {/* Badges */}
                    <BadgeCollection badges={roadmap.badges ?? []} />
                </div>
            </div>
        </div>
    );
}
