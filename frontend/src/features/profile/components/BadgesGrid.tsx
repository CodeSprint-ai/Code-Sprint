'use client';

import React from 'react';
import { Badge } from '@/types/profile';
import { Award, Shield, Star, Trophy } from 'lucide-react';

interface BadgesGridProps {
    badges: Badge[];
    showAll?: boolean;
}

const tierConfig = {
    BRONZE: {
        bgColor: 'dark:from-amber-900/40 dark:to-amber-950/40 from-amber-50 to-amber-100/50',
        borderColor: 'dark:border-amber-700/50 border-amber-200/60',
        iconColor: 'dark:text-amber-500 text-amber-600',
        icon: Award,
    },
    SILVER: {
        bgColor: 'dark:from-slate-400/20 dark:to-slate-500/20 from-slate-50 to-slate-100/50',
        borderColor: 'dark:border-slate-400/50 border-slate-200/60',
        iconColor: 'dark:text-slate-300 text-slate-500',
        icon: Shield,
    },
    GOLD: {
        bgColor: 'dark:from-yellow-500/30 dark:to-amber-600/30 from-yellow-50 to-amber-50',
        borderColor: 'dark:border-yellow-500/50 border-yellow-200/60',
        iconColor: 'dark:text-yellow-400 text-yellow-600',
        icon: Star,
    },
    PLATINUM: {
        bgColor: 'dark:from-blue-400/30 dark:to-purple-500/30 from-blue-50 to-purple-50',
        borderColor: 'dark:border-blue-400/50 border-blue-200/60',
        iconColor: 'dark:text-blue-400 text-blue-600',
        icon: Trophy,
    },
};

function BadgeCard({ badge }: { badge: Badge }) {
    const config = tierConfig[badge.tier] || tierConfig.BRONZE;
    const Icon = config.icon;

    return (
        <div className={`relative rounded-xl bg-gradient-to-br ${config.bgColor} border ${config.borderColor} p-4 hover:scale-105 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md dark:shadow-none`}>
            <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-full dark:bg-slate-900/50 bg-white/80 mb-3 ${config.iconColor} shadow-inner`}>
                    <Icon size={24} />
                </div>
                <h4 className="text-sm font-bold dark:text-white text-zinc-900 mb-1">{badge.name}</h4>
                <p className="text-[11px] dark:text-slate-400 text-zinc-500 line-clamp-2 leading-relaxed">{badge.description}</p>
                {badge.unlockedAt && (
                    <p className="text-[10px] dark:text-slate-500 text-zinc-400 mt-2 font-medium">
                        Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                    </p>
                )}
            </div>

            {/* Tier label */}
            <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${config.iconColor} dark:bg-slate-900/60 bg-white/90 border border-current/10 backdrop-blur-sm shadow-sm`}>
                {badge.tier}
            </div>
        </div>
    );
}

export function BadgesGrid({ badges, showAll = false }: BadgesGridProps) {
    const displayBadges = showAll ? badges : badges.slice(0, 6);

    if (badges.length === 0) {
        return (
            <div className="rounded-xl dark:bg-[#09090b] bg-white border dark:border-white/5 border-zinc-200 p-6 shadow-sm dark:shadow-none">
                <h3 className="text-lg font-bold dark:text-white text-zinc-900 mb-4 tracking-tight">Badges</h3>
                <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full dark:bg-zinc-800 bg-zinc-50 flex items-center justify-center mx-auto mb-4 border dark:border-white/5 border-zinc-200">
                        <Award size={32} className="text-zinc-400" />
                    </div>
                    <p className="dark:text-zinc-400 text-zinc-600 font-medium">No badges earned yet</p>
                    <p className="text-sm text-zinc-500 mt-1">Keep solving problems to unlock achievements!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl dark:bg-[#09090b] bg-white border dark:border-white/5 border-zinc-200 p-6 shadow-sm dark:shadow-none">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold dark:text-white text-zinc-900 tracking-tight">Badges</h3>
                <span className="text-xs font-bold dark:text-zinc-500 text-zinc-400 uppercase tracking-widest">{badges.length} earned</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {displayBadges.map((badge) => (
                    <BadgeCard key={badge.uuid} badge={badge} />
                ))}
            </div>

            {!showAll && badges.length > 6 && (
                <button className="mt-6 w-full py-2.5 rounded-lg dark:bg-white/5 bg-zinc-50 hover:dark:bg-white/10 hover:bg-zinc-100 border dark:border-white/10 border-zinc-200 dark:text-zinc-300 text-zinc-600 text-xs font-bold transition-all uppercase tracking-widest">
                    View all {badges.length} badges
                </button>
            )}
        </div>
    );
}

export default BadgesGrid;
