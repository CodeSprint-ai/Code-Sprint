import React, { useState } from 'react';
import { ChevronDown, Play, RotateCcw, CheckCircle2, XCircle, Clock, Cpu, FileCode, ChevronLeft, Maximize2, Settings, MoreVertical } from 'lucide-react';

interface ProblemWorkspaceProps {
    onBack: () => void;
}

const ProblemWorkspace: React.FC<ProblemWorkspaceProps> = ({ onBack }) => {
    const [code, setCode] = useState(`class Solution:
    def twoSum(self, nums, target):
        # write your code here
        return []`);

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-4 animate-fade-in pb-4">
           {/* Left Panel - Problem Description */}
           <div className="w-1/2 flex flex-col bg-[#09090b] rounded-xl border border-white/5 overflow-hidden">
                {/* Header */}
                <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-white/[0.02]">
                    <button onClick={onBack} className="flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-white transition-colors">
                        <ChevronLeft className="w-4 h-4" /> All Problems
                    </button>
                    <div className="flex items-center gap-2">
                         <button className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                         <button className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-colors"><div className="rotate-180"><ChevronLeft className="w-4 h-4" /></div></button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <h1 className="text-2xl font-bold text-white mb-4">Two Sum</h1>
                    
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wide">Easy</span>
                        <div className="flex gap-1">
                            {['array', 'hash-table'].map(t => (
                                <span key={t} className="px-2 py-0.5 rounded bg-white/5 text-zinc-500 text-[10px] font-mono border border-white/5">{t}</span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
                        <p>
                            Given an array of integers <code className="bg-white/10 px-1 py-0.5 rounded text-zinc-200 font-mono text-xs">nums</code> and an integer <code className="bg-white/10 px-1 py-0.5 rounded text-zinc-200 font-mono text-xs">target</code>, return indices of the two numbers such that they add up to <code className="bg-white/10 px-1 py-0.5 rounded text-zinc-200 font-mono text-xs">target</code>.
                        </p>
                        <p>
                            You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.
                        </p>
                        <p>
                            You can return the answer in any order.
                        </p>
                    </div>

                    {/* Examples */}
                    <div className="mt-8 space-y-4">
                        <h3 className="text-white font-bold text-sm">Example:</h3>
                        <div className="bg-black/40 rounded-lg p-4 border border-white/5 font-mono text-xs space-y-2">
                            <div>
                                <span className="text-zinc-500">Input:</span> <span className="text-zinc-300">{'nums = [2,7,11,15], target = 9'}</span>
                            </div>
                            <div>
                                <span className="text-zinc-500">Output:</span> <span className="text-zinc-300">[0,1]</span>
                            </div>
                            <div>
                                <span className="text-zinc-500">Explanation:</span> <span className="text-zinc-400">Because nums[0] + nums[1] == 9, we return [0, 1].</span>
                            </div>
                        </div>
                    </div>

                    {/* Constraints */}
                    <div className="mt-8">
                        <h3 className="text-white font-bold text-sm mb-3">Constraints:</h3>
                        <ul className="list-disc list-inside space-y-1 text-xs text-zinc-400 font-mono bg-black/40 p-4 rounded-lg border border-white/5">
                            <li>2 &lt;= nums.length &lt;= 10^4</li>
                            <li>-10^9 &lt;= nums[i] &lt;= 10^9</li>
                            <li>-10^9 &lt;= target &lt;= 10^9</li>
                        </ul>
                    </div>
                    
                    {/* Companies */}
                     <div className="mt-8">
                        <h3 className="text-white font-bold text-sm mb-3">Companies:</h3>
                        <div className="flex flex-wrap gap-2">
                             {['Google', 'Amazon', 'Meta', 'Adobe', 'Microsoft', 'Apple'].map(c => (
                                <span key={c} className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-zinc-400 text-xs transition-colors cursor-pointer border border-white/5 hover:border-white/20">
                                    {c}
                                </span>
                             ))}
                        </div>
                     </div>
                </div>
           </div>

           {/* Right Panel - Editor & Results */}
           <div className="w-1/2 flex flex-col gap-4">
                {/* Editor */}
                <div className="flex-1 bg-[#09090b] rounded-xl border border-white/5 flex flex-col overflow-hidden relative group">
                    {/* Editor Header */}
                    <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-white/[0.02]">
                        <div className="flex items-center gap-2">
                             <div className="relative group/lang">
                                <button className="flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-white bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/20 transition-all">
                                    <FileCode className="w-3.5 h-3.5 text-blue-400" />
                                    Python
                                    <ChevronDown className="w-3 h-3 text-zinc-500" />
                                </button>
                             </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-colors"><Settings className="w-4 h-4" /></button>
                             <button className="px-4 py-1.5 bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/20">
                                Submit
                             </button>
                        </div>
                    </div>

                    {/* Code Area */}
                    <div className="flex-1 relative font-mono text-sm">
                        <div className="absolute left-0 top-0 bottom-0 w-12 bg-black/40 border-r border-white/5 flex flex-col items-center pt-4 text-zinc-600 select-none text-xs leading-6">
                            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => <div key={n}>{n}</div>)}
                        </div>
                        <textarea 
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            spellCheck={false}
                            className="absolute left-12 top-0 right-0 bottom-0 bg-[#09090b] text-zinc-300 p-4 resize-none focus:outline-none leading-6 selection:bg-white/20 w-[calc(100%-3rem)] h-full"
                        />
                    </div>
                </div>

                {/* Results Panel */}
                <div className="h-64 bg-[#09090b] rounded-xl border border-white/5 flex flex-col overflow-hidden">
                    {/* Tabs */}
                    <div className="h-10 border-b border-white/5 flex items-center px-2 bg-white/[0.02]">
                        <button className="h-full px-4 text-xs font-bold text-white border-b-2 border-red-500 flex items-center gap-2 bg-white/5">
                            Results <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        </button>
                        <button className="h-full px-4 text-xs font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
                            Test Cases <span className="text-[10px] bg-white/10 px-1.5 rounded-full">0/3</span>
                        </button>
                        <button className="h-full px-4 text-xs font-bold text-zinc-500 hover:text-white transition-colors">
                            Analysis
                        </button>
                    </div>

                    {/* Result Content */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        {/* Status Banner */}
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4 flex items-center gap-4">
                            <div className="p-2 bg-red-500/20 rounded-full">
                                <XCircle className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-red-500 font-bold text-lg tracking-tight">WRONG ANSWER</h3>
                                <p className="text-red-400/60 text-xs font-mono">0 / 3 test cases passed</p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" /> Runtime
                                </div>
                                <div className="text-lg font-mono text-zinc-300 font-bold">---</div>
                            </div>
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <Cpu className="w-3 h-3" /> Memory
                                </div>
                                <div className="text-lg font-mono text-zinc-300 font-bold">---</div>
                            </div>
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3 h-3" /> Passed
                                </div>
                                <div className="text-lg font-mono text-red-400 font-bold">0 <span className="text-zinc-600 text-sm">/ 3</span></div>
                            </div>
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <FileCode className="w-3 h-3" /> Language
                                </div>
                                <div className="text-lg font-mono text-zinc-300 font-bold">---</div>
                            </div>
                        </div>
                    </div>
                </div>
           </div>
        </div>
    );
};

export default ProblemWorkspace;