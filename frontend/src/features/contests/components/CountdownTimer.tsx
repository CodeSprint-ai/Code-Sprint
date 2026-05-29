'use client';

import { useCountdown } from '../../hooks/useCountdown';
import { cn } from '../../lib/utils';

interface CountdownTimerProps {
    targetDate: string;
    className?: string;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function CountdownTimer({
    targetDate,
    className,
    showLabel = true,
    size = 'md'
}: CountdownTimerProps) {
    const countdown = useCountdown(targetDate);

    if (countdown.isExpired) {
        return (
            <span className={cn(
                'inline-flex items-center gap-1 font-mono font-bold text-emerald-400 animate-pulse',
                size === 'sm' && 'text-xs',
                size === 'md' && 'text-sm',
                size === 'lg' && 'text-lg',
                className
            )}>
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                LIVE
            </span>
        );
    }

    const isUrgent = countdown.totalSeconds < 3600; // Less than 1 hour

    return (
        <div className={cn(
            'font-mono font-semibold tabular-nums',
            isUrgent ? 'text-amber-400' : 'text-cyan-400',
            isUrgent && 'animate-pulse',
            size === 'sm' && 'text-xs',
            size === 'md' && 'text-sm',
            size === 'lg' && 'text-xl tracking-wider',
            className
        )}>
            {showLabel && (
                <span className="dark:text-zinc-400 text-zinc-500 text-xs font-normal mr-1">Starts in</span>
            )}
            <span className={cn(
                'inline-flex items-center gap-0.5',
                size === 'lg' && 'gap-1'
            )}>
                {countdown.days > 0 && (
                    <>
                        <span className="dark:bg-zinc-800/80 bg-zinc-200 rounded px-1.5 py-0.5">{countdown.days}</span>
                        <span className="dark:text-zinc-500 text-zinc-400">d</span>
                    </>
                )}
                <span className="dark:bg-zinc-800/80 bg-zinc-200 rounded px-1.5 py-0.5">
                    {countdown.hours.toString().padStart(2, '0')}
                </span>
                <span className="dark:text-zinc-500 text-zinc-400">:</span>
                <span className="dark:bg-zinc-800/80 bg-zinc-200 rounded px-1.5 py-0.5">
                    {countdown.minutes.toString().padStart(2, '0')}
                </span>
                <span className="dark:text-zinc-500 text-zinc-400">:</span>
                <span className="dark:bg-zinc-800/80 bg-zinc-200 rounded px-1.5 py-0.5">
                    {countdown.seconds.toString().padStart(2, '0')}
                </span>
            </span>
        </div>
    );
}
