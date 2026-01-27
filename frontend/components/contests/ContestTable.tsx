'use client';

import { Contest } from '../../types/contest';
import { formatDuration, useCountdown } from '../../hooks/useCountdown';
import { downloadICSFile, getGoogleCalendarUrl } from '../../services/contestApi';
import { Calendar, ExternalLink, Bell } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ContestTableProps {
    contests: Contest[];
    onRemindMe?: (contest: Contest) => void;
}

function TableCountdown({ targetDate }: { targetDate: string }) {
    const countdown = useCountdown(targetDate);

    if (countdown.isExpired) {
        return (
            <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-xs font-bold">
                <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                LIVE
            </span>
        );
    }

    return (
        <span className={cn(
            'font-mono text-xs tabular-nums',
            countdown.totalSeconds < 3600 ? 'text-amber-400' : 'text-cyan-400'
        )}>
            {countdown.shortFormatted}
        </span>
    );
}

export function ContestTable({ contests, onRemindMe }: ContestTableProps) {
    const handleRemindMe = (contest: Contest) => {
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

    if (contests.length === 0) {
        return null;
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/50">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/80">
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Contest</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider hidden sm:table-cell">Platform</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Start Time</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider hidden md:table-cell">Duration</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {contests.map((contest) => (
                        <tr
                            key={contest.id}
                            className="hover:bg-zinc-800/30 transition-colors"
                        >
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2 min-w-0">
                                    <img
                                        src={contest.platform.icon}
                                        alt=""
                                        className="w-5 h-5 flex-shrink-0 rounded sm:hidden"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                    <a
                                        href={contest.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-white hover:text-cyan-400 transition-colors truncate max-w-[200px] md:max-w-[300px]"
                                        title={contest.event}
                                    >
                                        {contest.event}
                                    </a>
                                </div>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={contest.platform.icon}
                                        alt=""
                                        className="w-4 h-4 rounded"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                    <span className="text-zinc-400 text-xs">{contest.platform.name}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-zinc-300 text-xs whitespace-nowrap">
                                {new Date(contest.start).toLocaleString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </td>
                            <td className="px-4 py-3 text-zinc-400 text-xs hidden md:table-cell">
                                {formatDuration(contest.duration)}
                            </td>
                            <td className="px-4 py-3">
                                <TableCountdown targetDate={contest.start} />
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-1">
                                    <a
                                        href={contest.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 rounded hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-colors"
                                        title="Open contest"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => downloadICSFile(contest)}
                                        className="p-1.5 rounded hover:bg-zinc-700/50 text-zinc-400 hover:text-cyan-400 transition-colors"
                                        title="Download ICS"
                                    >
                                        <Calendar className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleRemindMe(contest)}
                                        className="p-1.5 rounded hover:bg-zinc-700/50 text-zinc-400 hover:text-amber-400 transition-colors"
                                        title="Set reminder"
                                    >
                                        <Bell className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
