'use client';

import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis,
    PolarRadiusAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { TopicMastery } from '@/types/roadmap';

interface Props {
    data: TopicMastery[];
}

const LEVEL_COLORS: Record<string, string> = {
    Master: '#f59e0b',
    Expert: '#8b5cf6',
    Proficient: '#3b82f6',
    Apprentice: '#22c55e',
    Novice: '#64748b',
};

export function MasteryRadarChart({ data }: Props) {
    const chartData = data.map(d => ({
        subject: d.topic_name.replace(/_/g, ' '),
        score: Math.round(d.mastery_score),
        level: d.level || 'Novice',
    }));

    if (chartData.length === 0) {
        return (
            <div className="dark:bg-white/[0.03] bg-white border dark:border-white/[0.06] border-zinc-200 rounded-2xl p-5 shadow-sm dark:shadow-none">
                <h3 className="text-sm font-semibold dark:text-slate-400 text-zinc-500 mb-3">Skill Radar</h3>
                <p className="text-xs dark:text-slate-500 text-zinc-500">Solve problems to see your skill radar.</p>
            </div>
        );
    }

    return (
        <div className="dark:bg-white/[0.03] bg-white border dark:border-white/[0.06] border-zinc-200 rounded-2xl p-5 shadow-sm dark:shadow-none">
            <h3 className="text-sm font-semibold dark:text-slate-400 text-zinc-500 mb-3">Skill Radar</h3>
            <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={chartData}>
                    <PolarGrid className="dark:stroke-white/[0.06] stroke-zinc-200" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                    />
                    <Radar
                        name="Mastery"
                        dataKey="score"
                        stroke="#22c55e"
                        fill="#22c55e"
                        fillOpacity={0.2}
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'rgba(15,15,15,0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 12,
                            fontSize: 12,
                        }}
                        labelStyle={{ color: '#f8fafc' }}
                        formatter={(value: number, _name: string, props: any) => {
                            const level = props.payload?.level || 'Novice';
                            return [`${value} — ${level}`, 'Mastery'];
                        }}
                    />
                </RadarChart>
            </ResponsiveContainer>

            {/* Mastery level labels per topic */}
            <div className="flex flex-wrap gap-2 mt-3">
                {chartData.map((d) => (
                    <div
                        key={d.subject}
                        className="flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full border"
                        style={{
                            color: LEVEL_COLORS[d.level] || '#64748b',
                            borderColor: `${LEVEL_COLORS[d.level] || '#64748b'}33`,
                            backgroundColor: `${LEVEL_COLORS[d.level] || '#64748b'}0d`,
                        }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LEVEL_COLORS[d.level] || '#64748b' }} />
                        {d.subject}: {d.level}
                    </div>
                ))}
            </div>
        </div>
    );
}
