import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Code2, Copy, Play, Zap, Activity } from 'lucide-react';

const Showcase: React.FC = () => {
  return (
    <section className="pt-20 pb-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[128px]" />
      
      {/* Vertical connection line for seamless feel */}
      <div className="absolute top-0 left-8 md:left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start relative z-10">
        
        {/* Left: Text Content */}
        <div className="order-2 lg:order-1 pt-4">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
          >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-xs font-bold uppercase tracking-wider mb-8">
                <Zap size={12} className="fill-brand-green" />
                Intelligent Context
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                An Editor That <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">Thinks Ahead.</span>
              </h2>
              
              <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-xl">
                Stop switching tabs for documentation. Our IDE anticipates your logic, offering inline explanations, complexity analysis, and one-click refactoring.
              </p>

              <div className="space-y-4">
                {[
                  { title: "Context-Aware Autocomplete", desc: "It doesn’t just finish your line; it predicts your entire function based on variable context and best practices." },
                  { title: "Predictive Runtime Analysis", desc: "Catch infinite loops and memory leaks in real-time before you even hit 'Run'." },
                  { title: "Instant Refactoring", desc: "Transform messy O(n²) brute force solutions into optimized O(n log n) algorithms with a single click." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-brand-green/20 transition-all duration-300 group cursor-default">
                    <div className="mt-1 w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                       <Check className="w-5 h-5 text-brand-green" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1 group-hover:text-brand-green transition-colors">{item.title}</h4>
                      <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
          </motion.div>
        </div>

        {/* Right: Modern IDE Visual */}
        <div className="order-1 lg:order-2 relative pt-8 lg:pt-0">
            {/* IDE Window */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-xl overflow-hidden bg-[#1E1E1E] shadow-2xl border border-white/10 relative z-20"
            >
                {/* Title Bar */}
                <div className="bg-[#252526] px-4 py-3 flex items-center justify-between border-b border-[#333]">
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-[#1E1E1E] rounded text-xs text-gray-400 font-mono">
                            <Code2 size={12} className="text-blue-400" />
                            optimize_algo.ts
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Play size={14} className="text-brand-green cursor-pointer hover:text-white" />
                        <Copy size={14} className="text-gray-500 cursor-pointer hover:text-white" />
                    </div>
                </div>

                {/* Editor Area */}
                <div className="p-6 font-mono text-sm overflow-hidden bg-[#1E1E1E]">
                    <div className="grid grid-cols-[auto_1fr] gap-4">
                        <div className="text-gray-600 text-right select-none space-y-1">
                            {Array.from({length: 8}).map((_, i) => <div key={i}>{i + 1}</div>)}
                        </div>
                        <div className="space-y-1">
                            <div className="text-pink-400">interface <span className="text-yellow-300">User</span> {'{'}</div>
                            <div className="pl-4 text-white">id: <span className="text-blue-400">string</span>;</div>
                            <div className="pl-4 text-white">score: <span className="text-blue-400">number</span>;</div>
                            <div className="text-pink-400">{'}'}</div>
                            <br />
                            <div className="text-blue-400">const</div>
                            <div className="pl-4">
                                <span className="text-yellow-300">processUsers</span> = (users: <span className="text-yellow-300">User</span>[]) ={'>'} {'{'}
                            </div>
                            <div className="pl-8 relative group">
                                <div className="absolute inset-0 bg-brand-green/10 -mx-2 rounded border border-brand-green/30" />
                                <span className="text-gray-400">// AI Suggestion: Use reduce for better performance</span>
                            </div>
                            <div className="pl-8 text-white">
                                <span className="text-pink-400">return</span> users.reduce(...)
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="bg-brand-green text-black px-4 py-1 text-xs font-bold flex justify-between items-center">
                    <span>NORMAL MODE</span>
                    <span>Ln 8, Col 24</span>
                </div>
            </motion.div>

            {/* Performance Analysis Card (New) */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative z-10 -mt-8 ml-8 md:ml-20 bg-[#121212] rounded-xl border border-white/10 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm max-w-sm"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Activity size={16} className="text-brand-orange" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Runtime Analysis</span>
                    </div>
                     <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
                    </span>
                </div>
                
                {/* Graph Visualization */}
                <div className="h-24 flex items-end gap-1 mb-5">
                    {[30, 45, 35, 60, 50, 75, 60, 80, 70, 90, 85, 100].map((h, i) => (
                        <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                            className="flex-1 bg-white/5 rounded-t-sm relative overflow-hidden group"
                        >
                            <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-brand-green/10 to-brand-green/40 group-hover:from-brand-green/20 group-hover:to-brand-green/60 transition-all" />
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div>
                        <div className="text-[10px] text-gray-500 font-mono mb-1 font-bold">EXECUTION</div>
                        <div className="text-lg font-bold text-white font-mono leading-none">24ms <span className="text-[10px] text-brand-green align-top">-12%</span></div>
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-500 font-mono mb-1 font-bold">MEMORY</div>
                        <div className="text-lg font-bold text-white font-mono leading-none">4.2MB <span className="text-[10px] text-brand-green align-top">OK</span></div>
                    </div>
                </div>
            </motion.div>

            {/* Floating Element Behind */}
            <div className="absolute -top-10 -right-10 w-full h-full border-2 border-dashed border-white/10 rounded-xl z-10 hidden md:block opacity-50" />
            
            {/* Glow behind the editor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-brand-green/5 rounded-full blur-[80px] -z-10" />

            {/* Floating Badge */}
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 -left-12 md:-left-16 bg-[#18181B] border border-white/10 p-3 rounded-xl shadow-2xl z-30 flex items-center gap-3 backdrop-blur-xl"
            >
                <div className="bg-brand-green/20 p-2 rounded-lg">
                    <Check className="w-5 h-5 text-brand-green" />
                </div>
                <div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Optimization</div>
                    <div className="text-white font-mono text-xs font-bold">Memory: -45%</div>
                </div>
            </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Showcase;