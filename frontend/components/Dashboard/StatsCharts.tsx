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

// Weekly Activity Data
const activityData = [
    { day: "Mon", problems: 4 },
    { day: "Tue", problems: 7 },
    { day: "Wed", problems: 3 },
    { day: "Thu", problems: 8 },
    { day: "Fri", problems: 5 },
    { day: "Sat", problems: 4 },
    { day: "Sun", problems: 3 },
];

// Difficulty Distribution Data
const difficultyData = [
    { name: "Easy", value: 45, color: "#10b981" },
    { name: "Medium", value: 25, color: "#3b82f6" },
    { name: "Hard", value: 8, color: "#a855f7" },
];

export function ActivityChart() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
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

export function DifficultyChart() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {difficultyData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="transparent"
                        />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#09090b",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "#fff",
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
