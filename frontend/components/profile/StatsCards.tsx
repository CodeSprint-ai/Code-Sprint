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
    color: string;
    subValue?: string;
}

function StatCard({ icon, label, value, color, subValue }: StatCardProps) {
    return (
        <div className="relative overflow-hidden rounded-xl bg-slate-900/50 border border-slate-700/50 p-5 hover:border-slate-600/50 transition-all group">
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(135deg, ${color}10 0%, transparent 50%)` }} />

            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-slate-400 text-sm mb-1">{label}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                    {subValue && (
                        <p className="text-xs text-slate-500 mt-1">{subValue}</p>
                    )}
                </div>
                <div className={`p-2 rounded-lg`} style={{ backgroundColor: `${color}20` }}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

export function StatsCards({ stats }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard
                icon={<Code2 size={20} style={{ color: '#3B82F6' }} />}
                label="Total Solved"
                value={stats.totalSolved}
                color="#3B82F6"
                subValue={`${stats.easySolved}E / ${stats.mediumSolved}M / ${stats.hardSolved}H`}
            />

            <StatCard
                icon={<CheckCircle size={20} style={{ color: '#22C55E' }} />}
                label="Success Rate"
                value={`${stats.submissionSuccessRate}%`}
                color="#22C55E"
            />

            <StatCard
                icon={<Flame size={20} style={{ color: '#F97316' }} />}
                label="Current Streak"
                value={stats.currentStreak}
                color="#F97316"
                subValue="days"
            />

            <StatCard
                icon={<Trophy size={20} style={{ color: '#EAB308' }} />}
                label="Max Streak"
                value={stats.maxStreak}
                color="#EAB308"
                subValue="days"
            />

            <StatCard
                icon={<Target size={20} style={{ color: '#8B5CF6' }} />}
                label="Rating"
                value={stats.rating}
                color="#8B5CF6"
            />

            {stats.rank && (
                <StatCard
                    icon={<Zap size={20} style={{ color: '#EC4899' }} />}
                    label="Global Rank"
                    value={`#${stats.rank}`}
                    color="#EC4899"
                />
            )}
        </div>
    );
}

export default StatsCards;
