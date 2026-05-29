'use client';

import { useState } from 'react';
import { Calendar, Bell, ExternalLink, Clock, Timer } from 'lucide-react';
import { Contest } from '../../types/contest';
import { CountdownTimer } from './CountdownTimer';
import { downloadICSFile, getGoogleCalendarUrl } from '../../services/contestApi';
import { formatDuration } from '../../hooks/useCountdown';
import { cn } from '../../lib/utils';

interface ContestCardProps {
    contest: Contest;
    onRemindMe?: (contest: Contest) => void;
}

export function ContestCard({ contest, onRemindMe }: ContestCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const isOngoing = contest.status === 'ongoing';

    const handleAddToCalendar = (e: React.MouseEvent) => {
        e.preventDefault();
        downloadICSFile(contest);
    };

    const handleGoogleCalendar = (e: React.MouseEvent) => {
        e.preventDefault();
        window.open(getGoogleCalendarUrl(contest), '_blank');
    };

    const handleRemindMe = (e: React.MouseEvent) => {
        e.preventDefault();
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    onRemindMe?.(contest);
                    new Notification('Reminder Set!', {
                        body: `You'll be notified before ${contest.event} starts`,
                        icon: contest.platform.icon,
                    });
                }
            });
        }
    };

    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-xl border transition-all duration-300',
                'bg-gradient-to-br dark:from-zinc-900/80 dark:to-zinc-950/90 from-white to-zinc-50 backdrop-blur-sm',
                isOngoing
                    ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                    : 'dark:border-zinc-700/50 border-zinc-200 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10',
                'hover:-translate-y-1'
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Gradient overlay */}
            <div className={cn(
                'absolute inset-0 opacity-0 transition-opacity duration-300',
                'bg-gradient-to-br',
                isOngoing
                    ? 'from-emerald-500/5 to-transparent'
                    : 'from-cyan-500/5 to-transparent',
                isHovered && 'opacity-100'
            )} />

            {/* Ongoing badge */}
            {isOngoing && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500 text-zinc-900 text-xs font-bold rounded-bl-lg">
                    LIVE
                </div>
            )}

            <div className="relative p-5">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                    {/* Platform icon */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg dark:bg-zinc-800 bg-zinc-100 border dark:border-zinc-700 border-zinc-200 flex items-center justify-center overflow-hidden">
                        <img
                            src={contest.platform.icon}
                            alt={contest.platform.name}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${contest.platform.name[0]}&background=1f2937&color=fff&size=48`;
                            }}
                        />
                    </div>

                    {/* Title and platform */}
                    <div className="flex-1 min-w-0">
                        <a
                            href={contest.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link flex items-center gap-1.5"
                        >
                            <h3 className="font-semibold dark:text-white text-zinc-900 truncate dark:group-hover/link:text-cyan-400 group-hover/link:text-cyan-600 transition-colors">
                                {contest.event}
                            </h3>
                            <ExternalLink className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </a>
                        <p className="text-sm dark:text-zinc-400 text-zinc-500">{contest.platform.name}</p>
                    </div>
                </div>

                {/* Time info */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm dark:text-zinc-400 text-zinc-500">
                        <Clock className="w-4 h-4" />
                        <span>
                            {new Date(contest.start).toLocaleString(undefined, {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm dark:text-zinc-400 text-zinc-500">
                        <Timer className="w-4 h-4" />
                        <span>Duration: {formatDuration(contest.duration)}</span>
                    </div>
                </div>

                {/* Countdown */}
                <div className="mb-4">
                    <CountdownTimer
                        targetDate={contest.start}
                        size={isOngoing ? 'md' : 'lg'}
                        showLabel={!isOngoing}
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleAddToCalendar}
                        className={cn(
                            'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                            'dark:bg-zinc-800 bg-zinc-100 dark:hover:bg-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 text-zinc-700 dark:hover:text-white hover:text-zinc-900',
                            'border dark:border-zinc-700 border-zinc-200 dark:hover:border-zinc-600 hover:border-zinc-300'
                        )}
                    >
                        <Calendar className="w-4 h-4" />
                        <span className="hidden sm:inline">Add to Cal</span>
                    </button>

                    <button
                        onClick={handleGoogleCalendar}
                        className={cn(
                            'flex items-center justify-center px-3 py-2 rounded-lg text-sm transition-all',
                            'dark:bg-zinc-800 bg-zinc-100 hover:bg-cyan-600/20 dark:text-zinc-300 text-zinc-700 dark:hover:text-cyan-400 hover:text-cyan-600',
                            'border dark:border-zinc-700 border-zinc-200 hover:border-cyan-500/50'
                        )}
                        title="Add to Google Calendar"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.5 4h-3V2.5a.5.5 0 0 0-1 0V4h-7V2.5a.5.5 0 0 0-1 0V4h-3A2.5 2.5 0 0 0 2 6.5v13A2.5 2.5 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-13A2.5 2.5 0 0 0 19.5 4zM21 19.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5V9h18v10.5z" />
                        </svg>
                    </button>

                    <button
                        onClick={handleRemindMe}
                        className={cn(
                            'flex items-center justify-center px-3 py-2 rounded-lg text-sm transition-all',
                            'dark:bg-zinc-800 bg-zinc-100 hover:bg-amber-600/20 dark:text-zinc-300 text-zinc-700 dark:hover:text-amber-400 hover:text-amber-600',
                            'border dark:border-zinc-700 border-zinc-200 hover:border-amber-500/50'
                        )}
                        title="Remind me"
                    >
                        <Bell className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
