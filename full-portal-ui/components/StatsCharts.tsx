import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const COLORS = {
    easy: '#10b981',   // Emerald 500
    medium: '#3b82f6', // Blue 500
    hard: '#a855f7',   // Purple 500
    grid: '#27272a',   // Zinc 800
    text: '#71717a',   // Zinc 500
    tooltipBg: '#09090b', // Zinc 950
    tooltipBorder: '#27272a' // Zinc 800
};

const difficultyData = [
  { name: 'Easy', value: 45, color: COLORS.easy },
  { name: 'Medium', value: 25, color: COLORS.medium },
  { name: 'Hard', value: 8, color: COLORS.hard },
];

const activityData = [
  { day: 'Mon', solved: 4 },
  { day: 'Tue', solved: 12 },
  { day: 'Wed', solved: 5 },
  { day: 'Thu', solved: 18 },
  { day: 'Fri', solved: 10 },
  { day: 'Sat', solved: 24 },
  { day: 'Sun', solved: 15 },
];

export const DifficultyChart = () => {
  return (
    <div className="h-full w-full relative">
       <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[{ value: 1 }]}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={75}
            dataKey="value"
            stroke="none"
            fill="#18181b" 
            isAnimationActive={false}
          />
          <Pie
            data={difficultyData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={75}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
            cornerRadius={4}
          >
            {difficultyData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-white font-mono tracking-tighter">78</span>
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mt-1">Total</span>
      </div>
    </div>
  );
};

export const ActivityChart = () => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={activityData} barSize={28}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="cursorGradient" x1="0" y1="0" x2="0" y2="1">
               <stop offset="0%" stopColor="#27272a" stopOpacity={0.5} />
               <stop offset="100%" stopColor="#27272a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} opacity={0.4} />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: COLORS.text, fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 500 }} 
            dy={10}
          />
          <Tooltip 
            cursor={{ fill: 'url(#cursorGradient)' }}
            contentStyle={{ 
                backgroundColor: COLORS.tooltipBg, 
                border: `1px solid ${COLORS.tooltipBorder}`, 
                borderRadius: '8px', 
                color: '#fff', 
                fontSize: '12px', 
                fontFamily: 'Inter, sans-serif',
                padding: '8px 12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}
            itemStyle={{ color: '#10b981' }}
            formatter={(value) => [`${value} Problems`, 'Solved']}
          />
          <Bar 
            dataKey="solved" 
            fill="url(#barGradient)" 
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};