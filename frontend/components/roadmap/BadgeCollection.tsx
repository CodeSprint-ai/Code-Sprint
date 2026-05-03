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
        <div className="dark:bg-white/[0.03] bg-white border dark:border-white/[0.06] border-zinc-200 rounded-2xl p-5 shadow-sm dark:shadow-none">
            <h3 className="text-sm font-semibold dark:text-slate-400 text-zinc-500 mb-3">Badges</h3>
            <div className="flex flex-wrap gap-2">
                {badges.map(b => (
                    <div
                        key={b.badge_key}
                        title={b.badge_label}
                        className="dark:bg-green-950/40 bg-green-50 border dark:border-green-500/20 border-green-200 rounded-full px-3 py-1.5 text-xs dark:text-green-300 text-green-700 dark:hover:border-green-500/40 hover:border-green-400 transition-colors"
                    >
                        🏅 {b.badge_label}
                    </div>
                ))}
                {badges.length === 0 && (
                    <p className="text-xs dark:text-slate-500 text-zinc-500">Solve problems to earn badges!</p>
                )}
            </div>
        </div>
    );
}
