import React, { useState } from 'react';
import { Search, Filter, Calendar, Clock, ExternalLink, Bell, Zap, ArrowUpRight, Trophy } from 'lucide-react';

interface Contest {
  id: number;
  title: string;
  platform: string;
  startTime: string;
  duration: string;
  startsIn: { d: number; h: number; m: number; s: number };
  status: 'ongoing' | 'upcoming';
}

const ContestMode: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'ongoing' | '24h' | 'upcoming'>('ongoing');

    const contests: Contest[] = [
        {
            id: 1,
            title: "Codeforces Round (Demo)",
            platform: "Codeforces",
            startTime: "Wed, Jan 28, 07:50 PM",
            duration: "2h",
            startsIn: { d: 0, h: 1, m: 49, s: 34 },
            status: 'ongoing',
        },
        {
            id: 2,
            title: "LeetCode Weekly Contest (Demo)",
            platform: "LeetCode",
            startTime: "Thu, Jan 29, 05:50 PM",
            duration: "1h 30m",
            startsIn: { d: 0, h: 23, m: 49, s: 34 },
            status: 'upcoming',
        },
        {
            id: 3,
            title: "AtCoder Beginner Contest (Demo)",
            platform: "AtCoder",
            startTime: "Fri, Jan 30, 05:50 PM",
            duration: "1h 30m",
            startsIn: { d: 1, h: 23, m: 49, s: 34 },
            status: 'upcoming',
        }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-white tracking-tight">Programming Contests</h1>
                <p className="text-zinc-400 text-sm">Discover and track coding competitions worldwide.</p>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-3 bg-[#09090b] p-1 rounded-xl border border-white/5">
                {['ongoing', '24h', 'upcoming'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 capitalize ${
                            activeTab === tab 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm' 
                            : 'text-zinc-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {tab === 'ongoing' && <Zap className="w-4 h-4" />}
                        {tab === '24h' && <Clock className="w-4 h-4" />}
                        {tab === 'upcoming' && <Calendar className="w-4 h-4" />}
                        {tab === '24h' ? 'Next 24h' : tab}
                    </button>
                ))}
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search contests..." 
                        className="w-full bg-[#09090b] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-600"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 bg-[#09090b] border border-white/5 rounded-xl text-zinc-400 text-sm font-bold hover:text-white hover:border-white/10 transition-all">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {/* Contest List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contests.map((contest) => (
                    <div key={contest.id} className="bg-[#09090b] border border-white/5 rounded-xl p-6 flex flex-col gap-6 group hover:border-emerald-500/20 transition-all duration-300 hover:shadow-lg">
                            
                            {/* Card Header */}
                            <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                                    <Trophy className="w-5 h-5 text-zinc-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-base leading-tight group-hover:text-emerald-400 transition-colors">{contest.title}</h3>
                                    <p className="text-zinc-500 text-xs mt-1 font-medium">{contest.platform}</p>
                                </div>
                            </div>
                            </div>

                            {/* Time Info */}
                            <div className="space-y-3 py-4 border-t border-b border-white/5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-500">Start Time</span>
                                <span className="text-zinc-300 font-mono flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                                    {contest.startTime}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-500">Duration</span>
                                <span className="text-zinc-300 font-mono flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-zinc-600" />
                                    {contest.duration}
                                </span>
                            </div>
                            </div>

                            {/* Countdown */}
                            <div>
                                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-bold">Starts in</div>
                                <div className="flex items-center gap-1.5 font-mono text-xl font-bold text-white">
                                    {contest.startsIn.d > 0 && (
                                        <>
                                            <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-md border border-emerald-500/20">{contest.startsIn.d}d</span>
                                            <span className="text-zinc-700">:</span>
                                        </>
                                    )}
                                    <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-md border border-emerald-500/20">{String(contest.startsIn.h).padStart(2, '0')}</span>
                                    <span className="text-zinc-700">:</span>
                                    <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-md border border-emerald-500/20">{String(contest.startsIn.m).padStart(2, '0')}</span>
                                    <span className="text-zinc-700">:</span>
                                    <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-md border border-emerald-500/20">{String(contest.startsIn.s).padStart(2, '0')}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 mt-auto">
                            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300 transition-colors border border-white/5 hover:border-white/20 hover:text-white">
                                <Calendar className="w-3.5 h-3.5" />
                                Add to Calendar
                            </button>
                            <button className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-white/5">
                                <ExternalLink className="w-4 h-4" />
                            </button>
                            </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContestMode;