import React from 'react';
import { MapPin, Calendar, CheckCircle2, Award, Bookmark, Settings, Activity, Code2, Flame, Trophy, Target, Share2 } from 'lucide-react';
import { User } from '../types';

interface ProfileModeProps {
    user?: User; 
}

const ProfileMode: React.FC<ProfileModeProps> = ({ user }) => {
    // Mock data
    const profile = {
        name: "Kabir",
        handle: "@kabir",
        joined: "Joined January 2026",
        status: "Verified Developer",
        stats: {
            totalSolved: 0,
            breakdown: "OE / OM / OH",
            successRate: "33.3%",
            currentStreak: 0,
            maxStreak: 0,
            rating: 0
        },
        difficulty: {
            total: 1,
            solved: 1,
            easy: { solved: 1, total: 1 },
            medium: { solved: 0, total: 0 },
            hard: { solved: 0, total: 0 }
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">
            {/* Profile Header Card */}
            <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-[#09090b] group">
                <div className="h-48 bg-gradient-to-r from-emerald-900/10 via-black to-emerald-900/10 relative">
                     <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
                </div>
                
                <div className="px-8 pb-8">
                    <div className="relative flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-2xl bg-[#09090b] border-4 border-[#09090b] shadow-2xl flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                    <span className="text-4xl">🧑‍💻</span>
                                </div>
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-500/20 backdrop-blur-md uppercase tracking-wide">
                                Unranked
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 mb-2 space-y-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black text-white tracking-tight">{profile.name}</h1>
                                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">PRO</span>
                            </div>
                            <div className="text-zinc-500 text-sm font-medium">{profile.handle}</div>
                            
                            <div className="flex items-center gap-4 text-xs text-zinc-400 mt-3 font-mono">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                                    {profile.joined}
                                </div>
                                <div className="flex items-center gap-1.5 text-emerald-500">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    {profile.status}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-8 border-b border-white/5 px-2 overflow-x-auto">
                <button className="flex items-center gap-2 pb-4 text-sm font-bold text-emerald-400 border-b-2 border-emerald-500 px-4 transition-all">
                    <Activity className="w-4 h-4" /> Overview
                </button>
                <button className="flex items-center gap-2 pb-4 text-sm font-bold text-zinc-500 hover:text-white transition-colors px-4">
                    <Award className="w-4 h-4" /> Badges
                </button>
                 <button className="flex items-center gap-2 pb-4 text-sm font-bold text-zinc-500 hover:text-white transition-colors px-4">
                    <Bookmark className="w-4 h-4" /> Saved Problems
                </button>
                 <button className="flex items-center gap-2 pb-4 text-sm font-bold text-zinc-500 hover:text-white transition-colors px-4">
                    <Settings className="w-4 h-4" /> Settings
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: 'Total Solved', value: profile.stats.totalSolved, sub: 'OE / OM / OH', icon: Code2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Success Rate', value: profile.stats.successRate, sub: null, icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Current Streak', value: profile.stats.currentStreak, sub: 'days', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                    { label: 'Max Streak', value: profile.stats.maxStreak, sub: 'days', icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                    { label: 'Rating', value: profile.stats.rating, sub: null, icon: Target, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#09090b] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors group">
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider leading-snug max-w-[60%]">{stat.label}</span>
                            <div className={`p-1.5 rounded-lg border border-white/5 ${stat.color} ${stat.bg}`}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-white tracking-tight">{stat.value}</div>
                        {stat.sub && <div className="text-[10px] text-zinc-600 font-mono mt-1 font-medium">{stat.sub}</div>}
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Problem Difficulty */}
                <div className="bg-[#09090b] border border-white/5 rounded-xl p-6 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-8 relative z-10">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <h3 className="font-bold text-white text-sm">Problem Difficulty</h3>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-end mb-2">
                             <div className="text-sm font-medium text-white">Solved Problems</div>
                             <div className="text-sm font-mono font-bold text-zinc-400">
                                <span className="text-white text-lg">{profile.difficulty.solved}</span> <span className="text-zinc-600">/</span> {profile.difficulty.total}
                             </div>
                        </div>

                        {/* Easy */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="font-bold text-emerald-500">Easy</span>
                                <span className="font-mono text-zinc-400"><span className="text-white">{profile.difficulty.easy.solved}</span> / {profile.difficulty.easy.total}</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" style={{ width: '100%' }}></div>
                            </div>
                        </div>

                         {/* Medium */}
                         <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="font-bold text-yellow-500">Medium</span>
                                <span className="font-mono text-zinc-400"><span className="text-white">{profile.difficulty.medium.solved}</span> / {profile.difficulty.medium.total}</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-600/30 rounded-full" style={{ width: '0%' }}></div>
                            </div>
                        </div>

                         {/* Hard */}
                         <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="font-bold text-red-500">Hard</span>
                                <span className="font-mono text-zinc-400"><span className="text-white">{profile.difficulty.hard.solved}</span> / {profile.difficulty.hard.total}</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                                <div className="h-full bg-red-600/30 rounded-full" style={{ width: '0%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Language Usage */}
                <div className="bg-[#09090b] border border-white/5 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <Code2 className="w-4 h-4 text-purple-400" />
                        <h3 className="font-bold text-white text-sm">Language Usage</h3>
                    </div>

                    <div className="bg-[#111] rounded-xl p-6 border border-white/5">
                        <h4 className="text-xs font-bold text-white mb-6">Language Usage</h4>
                        
                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden flex mb-4">
                            <div className="h-full bg-blue-600 shadow-[0_0_10px_#2563eb]" style={{ width: '100%' }}></div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                                <span className="text-zinc-300 font-medium">Python</span>
                            </div>
                            <span className="text-zinc-500 font-mono">100%</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfileMode;