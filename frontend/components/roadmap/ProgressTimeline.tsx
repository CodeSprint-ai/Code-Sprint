'use client';

import {
    LineChart, Line, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid
} from 'recharts';
import { MasteryHistoryPoint } from '@/types/roadmap';

interface Props {
    history: MasteryHistoryPoint[];
}

const TOPIC_COLORS = [
    '#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#ef4444', '#10b981',
];

export function ProgressTimeline({ history }: Props) {
    if (!history || history.length === 0) {
        return (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-slate-400 mb-3">📈 Progress Timeline</h3>
                <p className="text-xs text-slate-500">Keep solving — your mastery history will appear here.</p>
            </div>
        );
    }

    // Group by date, with each topic as a key
    const topics = [...new Set(history.map(h => h.topic_name))];
    const dateMap = new Map<string, Record<string, number>>();

    for (const point of history) {
        const dateKey = new Date(point.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!dateMap.has(dateKey)) dateMap.set(dateKey, {});
        dateMap.get(dateKey)![point.topic_name] = Math.round(parseFloat(String(point.mastery_score)));
    }

    const chartData = Array.from(dateMap.entries()).map(([date, scores]) => ({
        date,
        ...scores,
    }));

    return (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
                <span>📈</span> Progress Timeline
            </h3>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: '#64748b', fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        domain={[0, 100]}
                        tick={{ fill: '#64748b', fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        width={30}
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'rgba(15,15,15,0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 12,
                            fontSize: 11,
                        }}
                        labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                    />
                    {topics.map((topic, i) => (
                        <Line
                            key={topic}
                            type="monotone"
                            dataKey={topic}
                            name={topic.replace(/_/g, ' ')}
                            stroke={TOPIC_COLORS[i % TOPIC_COLORS.length]}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 0 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
                {topics.map((topic, i) => (
                    <div key={topic} className="flex items-center gap-1.5">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: TOPIC_COLORS[i % TOPIC_COLORS.length] }}
                        />
                        <span className="text-[10px] text-slate-500">
                            {topic.replace(/_/g, ' ')}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
