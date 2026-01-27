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
        bgColor: 'from-amber-900/40 to-amber-950/40',
        borderColor: 'border-amber-700/50',
        iconColor: 'text-amber-500',
        icon: Award,
    },
    SILVER: {
        bgColor: 'from-slate-400/20 to-slate-500/20',
        borderColor: 'border-slate-400/50',
        iconColor: 'text-slate-300',
        icon: Shield,
    },
    GOLD: {
        bgColor: 'from-yellow-500/30 to-amber-600/30',
        borderColor: 'border-yellow-500/50',
        iconColor: 'text-yellow-400',
        icon: Star,
    },
    PLATINUM: {
        bgColor: 'from-blue-400/30 to-purple-500/30',
        borderColor: 'border-blue-400/50',
        iconColor: 'text-blue-400',
        icon: Trophy,
    },
};

function BadgeCard({ badge }: { badge: Badge }) {
    const config = tierConfig[badge.tier] || tierConfig.BRONZE;
    const Icon = config.icon;

    return (
        <div className={`relative rounded-xl bg-gradient-to-br ${config.bgColor} border ${config.borderColor} p-4 hover:scale-105 transition-transform cursor-pointer group`}>
            <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-full bg-slate-900/50 mb-3 ${config.iconColor}`}>
                    <Icon size={24} />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">{badge.name}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{badge.description}</p>
                {badge.unlockedAt && (
                    <p className="text-xs text-slate-500 mt-2">
                        Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                    </p>
                )}
            </div>

            {/* Tier label */}
            <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${config.iconColor} bg-slate-900/60`}>
                {badge.tier}
            </div>
        </div>
    );
}

export function BadgesGrid({ badges, showAll = false }: BadgesGridProps) {
    const displayBadges = showAll ? badges : badges.slice(0, 6);

    if (badges.length === 0) {
        return (
            <div className="rounded-xl bg-slate-900/50 border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Badges</h3>
                <div className="text-center py-8">
                    <Award size={48} className="mx-auto text-slate-600 mb-3" />
                    <p className="text-slate-400">No badges earned yet</p>
                    <p className="text-sm text-slate-500">Keep solving problems to unlock achievements!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-slate-900/50 border border-slate-700/50 p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Badges</h3>
                <span className="text-sm text-slate-400">{badges.length} earned</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {displayBadges.map((badge) => (
                    <BadgeCard key={badge.uuid} badge={badge} />
                ))}
            </div>

            {!showAll && badges.length > 6 && (
                <button className="mt-4 w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition-colors">
                    View all {badges.length} badges
                </button>
            )}
        </div>
    );
}

export default BadgesGrid;
