import React, { useEffect, useState } from 'react';
import { ArrowRight, Trophy, Activity, Zap, TrendingUp, Cpu, Code2, Hash, BookOpen, ChevronRight, MoreHorizontal, Target, Calendar } from 'lucide-react';
import { DifficultyChart, ActivityChart } from './StatsCharts';
import { getDailyMotivation } from '../services/geminiService';
import { User, ViewState } from '../types';

interface DashboardProps {
    user: User;
    setViewState: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setViewState }) => {
  const [motivation, setMotivation] = useState<string>('Connecting...');

  useEffect(() => {
    getDailyMotivation(user.name).then(setMotivation);
  }, [user.name]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">
      
      {/* Hero Section */}
      <div className="relative w-full rounded-2xl bg-[#09090b] border border-white/5 overflow-hidden group">
         {/* Subtle Background Gradient */}
         <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none"></div>
         
         <div className="relative z-20 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left space-y-4">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-emerald-400 text-[10px] font-mono font-bold tracking-widest uppercase">System Online</span>
                </div>
                
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{user.name}</span>
                    </h1>
                    <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto md:mx-0">
                        {motivation}
                    </p>
                </div>
            </div>

            <div className="shrink-0">
                <button 
                    onClick={() => setViewState(ViewState.SPRINT)} 
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] overflow-hidden"
                >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                    <Zap className="w-5 h-5 fill-current" />
                    <span>Start Sprint Session</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Charts & Stats) */}
        <div className="lg:col-span-8 space-y-6">
            
            {/* Weekly Velocity Card (Refined) */}
            <div className="bg-[#09090b] border border-white/5 rounded-xl overflow-hidden hover:border-emerald-500/20 transition-all shadow-lg">
                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                             <Activity className="w-4 h-4" />
                         </div>
                         <div>
                             <h3 className="text-sm font-bold text-white tracking-wide">Weekly Velocity</h3>
                             <p className="text-[10px] text-zinc-500 font-mono">Problems solved over last 7 days</p>
                         </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                         <div className="text-right">
                             <span className="text-2xl font-bold text-white leading-none">34</span>
                             <span className="text-[10px] text-zinc-500 ml-1">Total</span>
                         </div>
                         <div className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/10">
                            <TrendingUp className="w-3 h-3" />
                            +12%
                         </div>
                    </div>
                </div>
                
                <div className="p-6 h-[300px]">
                    <ActivityChart />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mastery Card */}
                <div className="bg-[#09090b] border border-white/5 rounded-xl p-6 flex flex-col hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                             <Cpu className="w-4 h-4 text-purple-400" />
                             <h3 className="text-sm font-bold text-white">Mastery Level</h3>
                        </div>
                        <MoreHorizontal className="w-4 h-4 text-zinc-600 cursor-pointer hover:text-white" />
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="w-48 h-48 relative">
                            <DifficultyChart />
                        </div>
                        
                        <div className="flex justify-center gap-4 w-full mt-2">
                             <div className="flex flex-col items-center">
                                 <span className="text-xs font-bold text-emerald-400">45</span>
                                 <span className="text-[10px] text-zinc-500 uppercase">Easy</span>
                             </div>
                             <div className="w-px h-8 bg-white/10"></div>
                             <div className="flex flex-col items-center">
                                 <span className="text-xs font-bold text-blue-400">25</span>
                                 <span className="text-[10px] text-zinc-500 uppercase">Med</span>
                             </div>
                             <div className="w-px h-8 bg-white/10"></div>
                             <div className="flex flex-col items-center">
                                 <span className="text-xs font-bold text-purple-400">8</span>
                                 <span className="text-[10px] text-zinc-500 uppercase">Hard</span>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Challenge Card */}
                <div className="bg-[#09090b] border border-white/5 rounded-xl p-6 flex flex-col relative overflow-hidden group hover:border-emerald-500/30 transition-all cursor-pointer">
                     <div className="absolute top-0 right-0 p-4">
                        <span className="px-2 py-1 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">HARD</span>
                     </div>
                     
                     <div className="mb-4">
                        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-4 border border-white/5 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                            <Target className="w-5 h-5" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">Merge K Sorted Lists</h4>
                        <p className="text-xs text-zinc-500 line-clamp-2">You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.</p>
                     </div>
                     
                     <div className="flex flex-wrap gap-2 mb-6">
                        {['Heap', 'Linked List'].map(tag => (
                            <span key={tag} className="text-[10px] text-zinc-400 bg-white/5 px-2 py-1 rounded border border-white/5">
                                {tag}
                            </span>
                        ))}
                     </div>

                     <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                            <Code2 className="w-3 h-3" /> Python
                        </span>
                        <div className="flex items-center text-emerald-400 text-xs font-bold gap-1 group-hover:gap-2 transition-all">
                            Solve Now <ArrowRight className="w-3 h-3" />
                        </div>
                     </div>
                </div>
            </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* Rank Panel */}
            <div className="bg-gradient-to-b from-[#09090b] to-black border border-white/5 rounded-xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                        <Trophy className="w-3.5 h-3.5" /> Global Rank
                    </div>
                    <div className="text-5xl font-black text-white tracking-tight mb-2">#1,402</div>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full w-[85%] bg-emerald-500 rounded-full"></div>
                        </div>
                        <span className="text-xs font-bold text-emerald-400">Top 5%</span>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#09090b] border border-white/5 rounded-xl flex flex-col">
                <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recent Activity</h3>
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                </div>
                <div className="divide-y divide-white/5">
                    {[
                        { title: 'Two Sum', status: 'Passed', lang: 'TS', beats: '85%' },
                        { title: 'LRU Cache', status: 'Failed', lang: 'Go', beats: '-' },
                        { title: 'Valid Parentheses', status: 'Passed', lang: 'Py', beats: '92%' },
                    ].map((item, i) => (
                        <div key={i} className="px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm font-medium text-zinc-300 group-hover:text-emerald-400 transition-colors">{item.title}</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    item.status === 'Passed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                }`}>{item.status}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-zinc-500">
                                <span className="font-mono">{item.lang}</span>
                                {item.status === 'Passed' && <span>Beats {item.beats}</span>}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-3">
                     <button className="w-full py-2 text-xs font-bold text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/5">
                        View All History
                    </button>
                </div>
            </div>

            {/* Learning Path */}
            <div className="bg-[#09090b] border border-white/5 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    <BookOpen className="w-20 h-20 text-white" />
                </div>
                
                <div className="relative z-10 mb-6">
                    <div className="flex items-center gap-2 mb-3 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                        <BookOpen className="w-3.5 h-3.5" /> Current Path
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">Data Structures II</h4>
                    <p className="text-xs text-zinc-500">Advanced trees and graph algorithms.</p>
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between text-[10px] font-bold text-zinc-400 mb-2 uppercase">
                        <span>Progress</span>
                        <span className="text-white">75%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-6">
                        <div className="h-full w-3/4 bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                    </div>
                    
                    <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-xs font-bold text-white rounded-lg transition-all flex items-center justify-center gap-2 group">
                        Continue
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                    </button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;