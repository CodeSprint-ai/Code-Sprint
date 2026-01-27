'use client';

import React from 'react';
import { Code2, CheckCircle, Flame, Trophy, Target, Zap } from 'lucide-react';
import { PublicUserStats } from '@/types/profile';

interface StatsCardsProps {
    stats: PublicUserStats;
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string; // Tailwind color class prefix e.g. "cyan", "emerald"
    subValue?: string;
}

function StatCard({ icon, label, value, color, subValue }: StatCardProps) {
    // Map color names to hex/classes logic manually for now to keep it simple with existing inline styles or switch to classes
    // Utilizing inline styles for dynamic RGBA opacity

    return (
        <div className="relative overflow-hidden rounded-xl bg-zinc-900/50 border border-zinc-800 p-5 hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300 group backdrop-blur-sm">
            {/* Hover Glow */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at top right, ${color}15, transparent 70%)` }}
            />

            <div className="relative flex items-start justify-between z-10">
                <div>
                    <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
                    {subValue && (
                        <p className="text-xs text-zinc-500 mt-1 font-medium">{subValue}</p>
                    )}
                </div>
                <div
                    className="p-2.5 rounded-lg border border-white/5 shadow-inner"
                    style={{ backgroundColor: `${color}15`, color: color }}
                >
                    {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 20 })}
                </div>
            </div>
        </div>
    );
}

export function StatsCards({ stats }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard
                icon={<Code2 />}
                label="Total Solved"
                value={stats.totalSolved}
                color="#22d3ee" // Cyan-400
                subValue={`${stats.easySolved}E / ${stats.mediumSolved}M / ${stats.hardSolved}H`}
            />

            <StatCard
                icon={<CheckCircle />}
                label="Success Rate"
                value={`${stats.submissionSuccessRate}%`}
                color="#34d399" // Emerald-400
            />

            <StatCard
                icon={<Flame />}
                label="Current Streak"
                value={stats.currentStreak}
                color="#fbbf24" // Amber-400
                subValue="days"
            />

            <StatCard
                icon={<Trophy />}
                label="Max Streak"
                value={stats.maxStreak}
                color="#facc15" // Yellow-400
                subValue="days"
            />

            <StatCard
                icon={<Target />}
                label="Rating"
                value={stats.rating}
                color="#a78bfa" // Violet-400
            />

            {stats.rank !== undefined && (
                <StatCard
                    icon={<Zap />}
                    label="Global Rank"
                    value={`#${stats.rank}`}
                    color="#f472b6" // Pink-400
                />
            )}
        </div>
    );
}

export default StatsCards;
