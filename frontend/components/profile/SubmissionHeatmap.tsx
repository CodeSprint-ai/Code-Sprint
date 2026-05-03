'use client';

import React, { useMemo } from 'react';
import { SubmissionHeatmapEntry } from '@/types/profile';

interface SubmissionHeatmapProps {
    data: SubmissionHeatmapEntry[];
}

function getColor(count: number): string {
    if (count === 0) return 'dark:bg-slate-800 bg-slate-200';
    if (count <= 2) return 'bg-green-900';
    if (count <= 5) return 'bg-green-700';
    if (count <= 10) return 'bg-green-500';
    return 'bg-green-400';
}

function getTooltipText(date: string, count: number): string {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
    return `${count} submission${count !== 1 ? 's' : ''} on ${formattedDate}`;
}

export function SubmissionHeatmap({ data }: SubmissionHeatmapProps) {
    // Create a map of dates to counts
    const countMap = useMemo(() => {
        const map = new Map<string, number>();
        data.forEach(entry => map.set(entry.date, entry.count));
        return map;
    }, [data]);

    // Generate all dates for the past year
    const dates = useMemo(() => {
        const result: { date: string; count: number; week: number; day: number }[] = [];
        const today = new Date();
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        // Start from the beginning of the week
        const startDate = new Date(oneYearAgo);
        startDate.setDate(startDate.getDate() - startDate.getDay());

        let currentDate = new Date(startDate);
        let weekIndex = 0;

        while (currentDate <= today) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayOfWeek = currentDate.getDay();

            result.push({
                date: dateStr,
                count: countMap.get(dateStr) || 0,
                week: weekIndex,
                day: dayOfWeek,
            });

            currentDate.setDate(currentDate.getDate() + 1);
            if (dayOfWeek === 6) weekIndex++;
        }

        return result;
    }, [countMap]);

    // Group by weeks
    const weeks = useMemo(() => {
        const weekMap = new Map<number, typeof dates>();
        dates.forEach(d => {
            if (!weekMap.has(d.week)) weekMap.set(d.week, []);
            weekMap.get(d.week)!.push(d);
        });
        return Array.from(weekMap.values());
    }, [dates]);

    const totalSubmissions = data.reduce((sum, d) => sum + d.count, 0);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', '', 'Tue', '', 'Thu', '', 'Sat'];

    return (
        <div className="rounded-xl dark:bg-slate-900/50 bg-white border dark:border-slate-700/50 border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold dark:text-white text-slate-900">Submission Activity</h3>
                <span className="text-sm text-slate-400">
                    <span className="dark:text-white text-slate-900 font-semibold">{totalSubmissions}</span> submissions in the last year
                </span>
            </div>

            <div className="overflow-x-auto">
                <div className="inline-flex flex-col gap-1 min-w-max">
                    {/* Month labels */}
                    <div className="flex ml-8 mb-1">
                        {weeks.map((week, i) => {
                            if (i % 4 === 0 && week[0]) {
                                const month = new Date(week[0].date).getMonth();
                                return (
                                    <span
                                        key={i}
                                        className="text-xs text-slate-500 w-[52px]"
                                    >
                                        {months[month]}
                                    </span>
                                );
                            }
                            return null;
                        })}
                    </div>

                    <div className="flex">
                        {/* Day labels */}
                        <div className="flex flex-col gap-[3px] mr-2">
                            {days.map((day, i) => (
                                <span key={i} className="text-xs text-slate-500 h-[12px] leading-[12px]">
                                    {day}
                                </span>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="flex gap-[3px]">
                            {weeks.map((week, weekIndex) => (
                                <div key={weekIndex} className="flex flex-col gap-[3px]">
                                    {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
                                        const cell = week.find(d => d.day === dayIndex);
                                        if (!cell) {
                                            return <div key={dayIndex} className="w-[12px] h-[12px]" />;
                                        }
                                        return (
                                            <div
                                                key={dayIndex}
                                                className={`w-[12px] h-[12px] rounded-sm ${getColor(cell.count)} hover:ring-2 hover:ring-slate-500 transition-all cursor-pointer group relative`}
                                                title={getTooltipText(cell.date, cell.count)}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-slate-400">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm dark:bg-slate-800 bg-slate-200" />
                    <div className="w-3 h-3 rounded-sm bg-green-900" />
                    <div className="w-3 h-3 rounded-sm bg-green-700" />
                    <div className="w-3 h-3 rounded-sm bg-green-500" />
                    <div className="w-3 h-3 rounded-sm bg-green-400" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
}

export default SubmissionHeatmap;
