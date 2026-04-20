'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { RoadmapBadge } from '@/types/roadmap';

interface Props {
    badges: RoadmapBadge[];
    newBadge?: RoadmapBadge;
}

export function BadgeCollection({ badges, newBadge }: Props) {
    const fired = useRef(false);

    useEffect(() => {
        if (newBadge && !fired.current) {
            fired.current = true;
            confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        }
    }, [newBadge]);

    return (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Badges</h3>
            <div className="flex flex-wrap gap-2">
                {badges.map(b => (
                    <div
                        key={b.badge_key}
                        title={b.badge_label}
                        className="bg-green-950/40 border border-green-500/20 rounded-full px-3 py-1.5 text-xs text-green-300 hover:border-green-500/40 transition-colors"
                    >
                        🏅 {b.badge_label}
                    </div>
                ))}
                {badges.length === 0 && (
                    <p className="text-xs text-slate-500">Solve problems to earn badges!</p>
                )}
            </div>
        </div>
    );
}
