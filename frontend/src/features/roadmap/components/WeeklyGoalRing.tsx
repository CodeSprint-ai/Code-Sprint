'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface Props {
    completed: number;
    total: number;
    label: string;
}

export function WeeklyGoalRing({ completed, total, label }: Props) {
    const pct = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;
    const firedRef = useRef(false);

    // Confetti celebration when all daily suggestions are completed!
    useEffect(() => {
        if (pct === 100 && total > 0 && !firedRef.current) {
            firedRef.current = true;
            // Big celebration burst
            const duration = 2000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.7 },
                    colors: ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6'],
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.7 },
                    colors: ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6'],
                });
                if (Date.now() < end) requestAnimationFrame(frame);
            };
            frame();
        }
    }, [pct, total]);

    const strokeColor = pct === 100 ? '#f59e0b' : '#22c55e';

    return (
        <div className={`dark:bg-white/[0.03] bg-white border rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-500 shadow-sm dark:shadow-none ${pct === 100
                ? 'border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)]'
                : 'dark:border-white/[0.06] border-zinc-200'
            }`}>
            <h3 className="text-sm font-semibold dark:text-slate-400 text-zinc-500">Weekly Progress</h3>
            <div className="relative">
                <svg width={100} height={100} viewBox="0 0 100 100">
                    <circle
                        cx={50} cy={50} r={radius}
                        fill="none"
                        className="dark:stroke-white/[0.06] stroke-zinc-200"
                        strokeWidth={8}
                    />
                    <circle
                        cx={50} cy={50} r={radius}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={8}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                    <text
                        x={50} y={54}
                        textAnchor="middle"
                        className="dark:fill-slate-100 fill-zinc-800"
                        fontSize={18}
                        fontWeight="bold"
                    >
                        {pct}%
                    </text>
                </svg>
                {pct === 100 && (
                    <span className="absolute -top-2 -right-2 text-xl animate-bounce">🎉</span>
                )}
            </div>
            <p className="text-xs dark:text-slate-500 text-zinc-500 text-center">{label}</p>
            <p className="text-xs dark:text-slate-400 text-zinc-500">
                {completed}/{total} completed
                {pct === 100 && (
                    <span className="ml-1 text-amber-400 font-bold">— All done!</span>
                )}
            </p>
        </div>
    );
}
