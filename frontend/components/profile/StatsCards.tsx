'use client';

import React from 'react';
import { Code2, CheckCircle2, Flame, Trophy, Target, Zap } from 'lucide-react';
import { PublicUserStats } from '@/types/profile';

interface StatsCardsProps {
    stats: PublicUserStats;
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    colorClass: string;
    bgClass: string;
    subValue?: string;
}

function StatCard({ icon, label, value, colorClass, bgClass, subValue }: StatCardProps) {
    return (
        <div className="bg-[#09090b] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors group">
            <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider leading-snug max-w-[60%]">
                    {label}
                </span>
                <div className={`p-1.5 rounded-lg border border-white/5 ${colorClass} ${bgClass}`}>
                    {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-4 h-4' })}
                </div>
            </div>
            <div className="text-2xl font-black text-white tracking-tight">{value}</div>
            {subValue && (
                <div className="text-[10px] text-zinc-600 font-mono mt-1 font-medium">{subValue}</div>
            )}
        </div>
    );
}

export function StatsCards({ stats }: StatsCardsProps) {
    const statItems = [
        {
            icon: <Code2 />,
            label: 'Total Solved',
            value: stats.totalSolved,
            colorClass: 'text-emerald-400',
            bgClass: 'bg-emerald-500/10',
            subValue: `${stats.easySolved}E / ${stats.mediumSolved}M / ${stats.hardSolved}H`,
        },
        {
            icon: <CheckCircle2 />,
            label: 'Success Rate',
            value: `${stats.submissionSuccessRate}%`,
            colorClass: 'text-blue-400',
            bgClass: 'bg-blue-500/10',
        },
        {
            icon: <Flame />,
            label: 'Current Streak',
            value: stats.currentStreak,
            colorClass: 'text-orange-400',
            bgClass: 'bg-orange-500/10',
            subValue: 'days',
        },
        {
            icon: <Trophy />,
            label: 'Max Streak',
            value: stats.maxStreak,
            colorClass: 'text-yellow-400',
            bgClass: 'bg-yellow-500/10',
            subValue: 'days',
        },
        // {
        //     icon: <Target />,
        //     label: 'Rating',
        //     value: stats.rating,
        //     colorClass: 'text-purple-400',
        //     bgClass: 'bg-purple-500/10',
        // },
    ];

    // Add rank if available
    if (stats.rank !== undefined) {
        statItems.push({
            icon: <Zap />,
            label: 'Global Rank',
            value: `#${stats.rank}`,
            colorClass: 'text-pink-400',
            bgClass: 'bg-pink-500/10',
        });
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statItems.map((stat, i) => (
                <StatCard
                    key={i}
                    icon={stat.icon}
                    label={stat.label}
                    value={stat.value}
                    colorClass={stat.colorClass}
                    bgClass={stat.bgClass}
                    subValue={stat.subValue}
                />
            ))}
        </div>
    );
}

export default StatsCards;
