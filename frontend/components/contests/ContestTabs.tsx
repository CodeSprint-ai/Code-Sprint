'use client';

import { ContestTab } from '../../types/contest';
import { cn } from '../../lib/utils';
import { Zap, Clock, Calendar } from 'lucide-react';

interface ContestTabsProps {
    activeTab: ContestTab;
    onTabChange: (tab: ContestTab) => void;
    counts?: {
        ongoing: number;
        next24h: number;
        upcoming: number;
    };
}

const TABS = [
    {
        id: 'ongoing' as const,
        label: 'Ongoing',
        icon: Zap,
        color: 'emerald',
        description: 'Live now'
    },
    {
        id: 'next24h' as const,
        label: 'Next 24h',
        icon: Clock,
        color: 'amber',
        description: 'Starting soon'
    },
    {
        id: 'upcoming' as const,
        label: 'Upcoming',
        icon: Calendar,
        color: 'cyan',
        description: 'Future contests'
    },
] as const;

export function ContestTabs({ activeTab, onTabChange, counts }: ContestTabsProps) {
    return (
        <div className="flex flex-wrap gap-2 p-1 rounded-xl dark:bg-zinc-900/50 bg-white border dark:border-zinc-800 border-zinc-200">
            {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const count = counts?.[tab.id];

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            'flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg',
                            'text-sm font-medium transition-all duration-200',
                            isActive
                                ? cn(
                                    'bg-gradient-to-r shadow-lg',
                                    tab.color === 'emerald' && 'from-emerald-600/30 to-emerald-500/10 text-emerald-400 shadow-emerald-500/10',
                                    tab.color === 'amber' && 'from-amber-600/30 to-amber-500/10 text-amber-400 shadow-amber-500/10',
                                    tab.color === 'cyan' && 'from-cyan-600/30 to-cyan-500/10 text-cyan-400 shadow-cyan-500/10',
                                )
                                : 'dark:text-zinc-400 text-zinc-500 dark:hover:text-white hover:text-zinc-900 dark:hover:bg-zinc-800/50 hover:bg-zinc-100'
                        )}
                    >
                        <Icon className={cn(
                            'w-4 h-4',
                            isActive && tab.id === 'ongoing' && 'animate-pulse'
                        )} />
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                        {count !== undefined && count > 0 && (
                            <span className={cn(
                                'px-1.5 py-0.5 rounded-full text-xs font-bold',
                                isActive
                                    ? cn(
                                        tab.color === 'emerald' && 'bg-emerald-500/30 text-emerald-300',
                                        tab.color === 'amber' && 'bg-amber-500/30 text-amber-300',
                                        tab.color === 'cyan' && 'bg-cyan-500/30 text-cyan-300',
                                    )
                                    : 'dark:bg-zinc-700/50 bg-zinc-200 dark:text-zinc-400 text-zinc-600'
                            )}>
                                {count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
