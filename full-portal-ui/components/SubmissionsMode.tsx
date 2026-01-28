import React from 'react';
import { Search, Filter, Calendar, ChevronLeft, ChevronRight, FileCode, User, ArrowRight, LayoutGrid, List, CheckCircle2, XCircle } from 'lucide-react';

interface Submission {
  id: string;
  problemTitle: string;
  user: string;
  language: string;
  date: string;
  status: 'ACCEPTED' | 'WRONG ANSWER';
}

const SubmissionsMode: React.FC = () => {
    // Mock Data
    const submissions: Submission[] = [
        { id: '1', problemTitle: 'Two Sum', user: 'Kabir', language: 'python', date: 'Jan 27, 2026', status: 'WRONG ANSWER' },
        { id: '2', problemTitle: 'Two Sum', user: 'Kabir', language: 'python', date: 'Jan 27, 2026', status: 'ACCEPTED' },
        { id: '3', problemTitle: 'Two Sum', user: 'Kabir', language: 'python', date: 'Jan 27, 2026', status: 'WRONG ANSWER' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">All Submissions</h1>
                    <p className="text-zinc-400 text-sm mt-1">View and filter submission history.</p>
                </div>
                <div className="flex bg-[#09090b] p-1 rounded-xl border border-white/5 shrink-0">
                    <button className="p-2 rounded-lg bg-white/5 text-white shadow-sm border border-white/5"><LayoutGrid className="w-4 h-4" /></button>
                    <button className="p-2 rounded-lg text-zinc-500 hover:text-white transition-colors"><List className="w-4 h-4" /></button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="p-1 rounded-2xl border border-white/5 bg-[#09090b]">
                 <div className="flex flex-col lg:flex-row gap-2 p-2">
                    <div className="flex-[2] relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search by title or user..." 
                            className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-600" 
                        />
                    </div>
                    <div className="flex-1">
                        <div className="relative h-full">
                            <select className="w-full h-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-400 focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer hover:border-white/10 transition-colors">
                                <option>All statuses</option>
                                <option>Accepted</option>
                                <option>Wrong Answer</option>
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex flex-1 gap-2">
                         <div className="relative flex-1">
                            <input type="text" placeholder="Start Date" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-4 pr-10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-all" />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                         </div>
                    </div>
                 </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {submissions.map((sub) => (
                    <div key={sub.id} className="bg-[#09090b] border border-white/5 rounded-xl p-6 relative group hover:border-emerald-500/20 transition-all duration-300 hover:shadow-lg">
                        
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight">{sub.problemTitle}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
                                        <User className="w-3 h-3 text-zinc-400" />
                                    </div>
                                    <span className="text-xs text-zinc-400 font-medium">{sub.user}</span>
                                </div>
                            </div>
                            
                            {sub.status === 'ACCEPTED' ? (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-wide">Passed</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-wide">Failed</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 py-4 border-t border-white/5 border-b mb-4">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-500">Language</span>
                                <span className="text-zinc-300 font-mono flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    {sub.language}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-500">Date</span>
                                <span className="text-zinc-300 font-mono">{sub.date}</span>
                            </div>
                        </div>

                        <button className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2 group/btn">
                            View Analysis 
                            <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover/btn:text-white transition-colors" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-6 gap-4">
                <span className="text-xs text-zinc-500 font-medium">
                    Showing <span className="text-white">1-3</span> of <span className="text-white">3</span> submissions
                </span>
                <div className="flex items-center gap-2">
                    <button disabled className="flex items-center gap-1 px-3 py-2 rounded-lg border border-white/5 text-zinc-500 text-xs font-bold bg-[#09090b] hover:bg-white/5 disabled:opacity-50 cursor-not-allowed transition-all">
                        <ChevronLeft className="w-3.5 h-3.5" /> Previous
                    </button>
                    <div className="flex gap-1">
                         <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/20">1</button>
                         <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-zinc-500 text-xs font-bold transition-colors">2</button>
                    </div>
                    <button className="flex items-center gap-1 px-3 py-2 rounded-lg border border-white/5 text-zinc-400 text-xs font-bold bg-[#09090b] hover:bg-white/5 hover:text-white transition-all">
                        Next <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmissionsMode;