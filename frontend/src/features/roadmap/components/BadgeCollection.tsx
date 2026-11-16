"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { RoadmapBadge } from "@/features/roadmap/types/roadmap.types";

interface Props {
  badges: RoadmapBadge[];
  newBadge?: RoadmapBadge;
}

export function BadgeCollection({ badges, newBadge }: Props) {
  const fired = useRef(new Set<string>());

  useEffect(() => {
    if (newBadge && !fired.current.has(newBadge.badge_key)) {
      fired.current.add(newBadge.badge_key);
      confetti({
        particleCount: 36,
        spread: 55,
        ticks: 90,
        colors: ["#226344", "#8bb79b", "#d7b86a"],
        origin: { y: 0.7 },
        disableForReducedMotion: true,
      });
    }
  }, [newBadge]);

  return (
    <div className="dark:bg-white/[0.03] bg-white border dark:border-white/[0.06] border-zinc-200 rounded-2xl p-5 shadow-sm dark:shadow-none">
      <h3 className="text-sm font-semibold dark:text-slate-400 text-zinc-500 mb-3">
        Badges
      </h3>
      <div className="flex flex-wrap gap-2">
        {badges.map((b) => (
          <div
            key={b.badge_key}
            title={b.badge_label}
            data-new-badge={b.badge_key === newBadge?.badge_key}
            className="dark:bg-green-950/40 bg-green-50 border dark:border-green-500/20 border-green-200 rounded-full px-3 py-1.5 text-xs dark:text-green-300 text-green-700 dark:hover:border-green-500/40 hover:border-green-400 transition-colors"
          >
            🏅 {b.badge_label}
          </div>
        ))}
        {badges.length === 0 && (
          <p className="text-xs dark:text-slate-500 text-zinc-500">
            Solve problems to earn badges!
          </p>
        )}
      </div>
    </div>
  );
}
