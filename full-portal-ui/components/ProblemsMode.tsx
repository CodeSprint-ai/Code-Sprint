import React from 'react';
import { Search, Filter, Calendar, ChevronLeft, ChevronRight, LayoutGrid, List, ArrowUpRight, Tag, Activity } from 'lucide-react';

interface ProblemsModeProps {
    onSelectProblem: (id: number) => void;
}

interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
}

const ProblemsMode: React.FC<ProblemsModeProps> = ({ onSelectProblem }) => {
    const problems: Problem[] = [
        {
            id: 1,
            title: "Two Sum",
            description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have **exactly one solution**, and you may not use the same element twice.",
            difficulty: "Easy",
            tags: ["array", "hash-table"]
        }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">
            {/* Header */}
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">All Problems</h1>
                    <p className="text-zinc-400 text-sm mt-1">Browse and solve algorithm challenges.</p>
                </div>
                <div className="flex bg-[#09090b] p-1 rounded-xl border border-white/5 shrink-0">
                    <button className="p-2 rounded-lg bg-white/5 text-white shadow-sm border border-white/5"><LayoutGrid className="w-4 h-4" /></button>
                    <button className="p-2 rounded-lg text-zinc-500 hover:text-white transition-colors"><List className="w-4 h-4" /></button>
                </div>
            </div>

            {/* Filters */}
            <div className="p-1 rounded-2xl border border-white/5 bg-[#09090b]">
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-2 p-2">
                    <div className="md:col-span-4 relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search by title..." 
                            className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-600" 
                        />
                    </div>
                    <div className="md:col-span-3">
                         <div className="relative h-full">
                            <select className="w-full h-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-400 focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer hover:border-white/10 transition-colors">
                                <option>Difficulty</option>
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                            <Activity className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                        </div>
                    </div>
                    <div className="md:col-span-3">
                         <div className="relative h-full">
                             <input type="text" placeholder="Tags..." className="w-full h-full bg-black/40 border border-white/5 rounded-xl py-3 pl-4 pr-10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-all" />
                             <Tag className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                         </div>
                    </div>
                    <div className="md:col-span-2">
                        <button className="w-full h-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shadow-emerald-900/20">
                            Apply
                        </button>
                    </div>
                 </div>
            </div>

            {/* List */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {problems.map(problem => (
                     <div 
                        key={problem.id} 
                        onClick={() => onSelectProblem(problem.id)}
                        className="bg-[#09090b] border border-white/5 rounded-xl p-6 relative group hover:border-emerald-500/20 transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col"
                     >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs">
                                <span className="font-bold text-emerald-500">#{problem.id}</span>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                        </div>
                        
                        <div className="mb-6 flex-1">
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors tracking-tight">{problem.title}</h3>
                            <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
                                {problem.description}
                            </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex gap-2">
                                {problem.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 rounded-md bg-white/5 text-[10px] text-zinc-400 font-medium border border-white/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                                problem.difficulty === 'Easy' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            }`}>
                                {problem.difficulty}
                            </span>
                        </div>
                     </div>
                ))}
             </div>

            {/* Pagination */}
             <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-6 gap-4">
                <span className="text-xs text-zinc-500 font-medium">
                    Showing <span className="text-white">1</span> result
                </span>
                <div className="flex items-center gap-2">
                    <button disabled className="flex items-center gap-1 px-3 py-2 rounded-lg border border-white/5 text-zinc-500 text-xs font-bold bg-[#09090b] hover:bg-white/5 disabled:opacity-50 cursor-not-allowed transition-all">
                        <ChevronLeft className="w-3.5 h-3.5" /> Previous
                    </button>
                    <button className="flex items-center gap-1 px-3 py-2 rounded-lg border border-white/5 text-zinc-400 text-xs font-bold bg-[#09090b] hover:bg-white/5 hover:text-white transition-all">
                        Next <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProblemsMode;