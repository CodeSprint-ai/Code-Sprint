"use client";

import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

// Types for chart data
export interface ActivityChartData {
    day: string;
    problems: number;
}

export interface DifficultyChartData {
    name: string;
    value: number;
    color: string;
}

// Default data for empty state
const defaultActivityData: ActivityChartData[] = [
    { day: "Mon", problems: 0 },
    { day: "Tue", problems: 0 },
    { day: "Wed", problems: 0 },
    { day: "Thu", problems: 0 },
    { day: "Fri", problems: 0 },
    { day: "Sat", problems: 0 },
    { day: "Sun", problems: 0 },
];

const defaultDifficultyData: DifficultyChartData[] = [
    { name: "Easy", value: 0, color: "#10b981" },
    { name: "Medium", value: 0, color: "#3b82f6" },
    { name: "Hard", value: 0, color: "#a855f7" },
];

interface ActivityChartProps {
    data?: ActivityChartData[];
}

interface DifficultyChartProps {
    easy?: number;
    medium?: number;
    hard?: number;
}

export function ActivityChart({ data = defaultActivityData }: ActivityChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#71717a", fontSize: 12 }}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#71717a", fontSize: 12 }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#09090b",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "#fff",
                    }}
                    labelStyle={{ color: "#a1a1aa" }}
                />
                <Area
                    type="monotone"
                    dataKey="problems"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorProblems)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export function DifficultyChart({ easy = 0, medium = 0, hard = 0 }: DifficultyChartProps) {
    const data: DifficultyChartData[] = [
        { name: "Easy", value: easy, color: "#10b981" },
        { name: "Medium", value: medium, color: "#3b82f6" },
        { name: "Hard", value: hard, color: "#a855f7" },
    ];

    // If all values are 0, show a placeholder
    const total = easy + medium + hard;
    const displayData = total === 0
        ? [{ name: "No Data", value: 1, color: "#27272a" }]
        : data;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={displayData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={total > 0 ? 5 : 0}
                    dataKey="value"
                >
                    {displayData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="transparent"
                        />
                    ))}
                </Pie>
                {total > 0 && (
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#09090b",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            color: "#fff",
                        }}
                    />
                )}
            </PieChart>
        </ResponsiveContainer>
    );
}
