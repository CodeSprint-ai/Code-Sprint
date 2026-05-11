import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Users, Cpu, ShieldCheck, Zap, BarChart, Code, Globe, Activity } from 'lucide-react';

interface BentoCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  colSpan?: string;
  children?: React.ReactNode;
}

const BentoCard: React.FC<BentoCardProps> = ({ title, description, icon, colSpan = "col-span-1", children }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className={`${colSpan} relative rounded-3xl overflow-hidden group border dark:border-white/10 border-zinc-200 dark:bg-[#0c0c0e] bg-white dark:hover:border-brand-green/30 hover:border-brand-green/30 transition-all duration-500 shadow-lg dark:shadow-2xl dark:shadow-black/40 shadow-zinc-200/60`}
  >
    {/* Radial gradient hover effect */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-green/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    
    <div className="relative h-full flex flex-col z-10">
      <div className="p-6">
        <div className="w-10 h-10 rounded-lg dark:bg-white/5 bg-emerald-50 dark:border-white/10 border-emerald-200 border flex items-center justify-center text-brand-green mb-4 shadow-inner group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        
        <h3 className="text-lg font-bold dark:text-white text-zinc-900 mb-2">
          {title}
        </h3>
        <p className="dark:text-gray-400 text-zinc-600 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {/* Visual Area */}
      <div className="flex-1 relative overflow-hidden mt-2 min-h-[140px] w-full">
         <div className="absolute inset-0 bg-gradient-to-t dark:from-[#0c0c0e] from-white/90 via-transparent to-transparent z-10 pointer-events-none" />
         {children}
      </div>
    </div>
  </motion.div>
);

const Features: React.FC = () => {
  return (
    <section id="solutions" className="pt-32 pb-16 relative overflow-hidden">
        
      {/* Background Glows for seamless feel */}
      <div className="absolute top-1/4 -left-64 w-[1000px] h-[1000px] bg-brand-green/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-64 w-[1000px] h-[1000px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="text-brand-green font-mono text-sm font-semibold tracking-wider uppercase mb-3 block">
              Platform Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-zinc-900 mb-6 tracking-tight">
              Everything you need to go <br/>
              <span className="dark:text-gray-500 text-zinc-400">from Junior to Senior.</span>
            </h2>
            <p className="text-lg dark:text-gray-400 text-zinc-600">
              A seamless environment designed for flow. From your first line of code to global deployment.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AI Pair Programming (Large) */}
          <BentoCard 
            colSpan="md:col-span-2"
            title="Post-Submission AI Analysis"
            description="Detects your algorithmic approach, analyzes time/space complexity, and reviews edge cases."
            icon={<Cpu size={20} />}
          >
             <div className="absolute top-4 left-8 right-8 bottom-0 dark:bg-[#151516] bg-zinc-50 rounded-t-xl border dark:border-white/10 border-zinc-200 p-5 border-b-0 shadow-2xl transform group-hover:translate-y-2 transition-transform duration-500">
                <div className="flex gap-2 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/60 border border-[#FF5F56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/60 border border-[#FFBD2E]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/60 border border-[#27C93F]" />
                </div>
                <div className="space-y-3 font-mono text-xs">
                    <div className="flex gap-3">
                        <span className="dark:text-gray-600 text-zinc-400 select-none">1</span>
                        <span className="dark:text-purple-400 text-purple-600">function</span> <span className="dark:text-blue-400 text-blue-600">processData</span>(input) {'{'}</div>
                    <div className="flex gap-3 relative group/code">
                        <div className="absolute inset-0 bg-brand-green/10 -mx-4 border-l-2 border-brand-green" />
                        <span className="dark:text-gray-600 text-zinc-400 select-none relative z-10">2</span>
                        <span className="dark:text-gray-300 text-zinc-600 relative z-10 flex items-center gap-2">
                            <span className="text-brand-green">AI:</span> Suggest using .map()
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <span className="dark:text-gray-600 text-zinc-400 select-none">3</span>
                        <span className="dark:text-purple-400 text-purple-600">return</span> input.map(x ={'>'} x * 2);
                    </div>
                </div>
             </div>
          </BentoCard>

          {/* Card 2: Ironclad Proctoring (Small) */}
          <BentoCard 
            title="Smart Multi-Level Hints"
            description="Get 4 levels of graduated hints: from thinking direction to structured pseudocode, without giving away the full answer."
            icon={<ShieldCheck size={20} />}
          >
             <div className="absolute inset-0 flex items-center justify-center">
                 <div className="relative">
                     <div className="absolute inset-0 bg-brand-green/10 blur-2xl rounded-full" />
                     <ShieldCheck size={64} strokeWidth={1} className="text-brand-green/20 relative z-10 transform group-hover:scale-110 transition-transform duration-500" />
                     <div className="absolute inset-0 flex items-center justify-center z-20">
                         <div className="dark:bg-[#0c0c0e] bg-white border border-green-500/30 px-3 py-1 rounded-full flex items-center gap-2 shadow-xl dark:shadow-green-900/10 shadow-green-100">
                             <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                             <span className="text-[10px] font-bold text-brand-green uppercase tracking-wide">Secure</span>
                         </div>
                     </div>
                 </div>
             </div>
          </BentoCard>

          {/* Card 3: Multiplayer Collaboration */}
          <BentoCard 
            colSpan="md:col-span-2"
            title="Personalized Learning Roadmap"
            description="Generates weekly adaptive roadmaps based on your accuracy, time tracked, and identified weak areas."
            icon={<Users size={20} />}
          >
            <div className="absolute inset-x-6 top-4 bottom-0 dark:bg-[#151516] bg-zinc-50 rounded-t-xl border dark:border-white/10 border-zinc-200 overflow-hidden flex items-center justify-center">
                <div className="absolute top-8 left-8 animate-blob">
                    <div className="w-3 h-3 bg-purple-500 rounded-full ring-4 ring-purple-500/20" />
                    <div className="px-2 py-0.5 bg-purple-500 text-black text-[9px] font-bold rounded ml-2 mt-1 shadow-lg">Alex</div>
                </div>
                <div className="absolute bottom-12 right-12 animate-blob animation-delay-2000">
                    <div className="w-3 h-3 bg-brand-green rounded-full ring-4 ring-brand-green/20" />
                    <div className="px-2 py-0.5 bg-brand-green text-black text-[9px] font-bold rounded ml-2 mt-1 shadow-lg">Sarah</div>
                </div>
                <div className="w-full px-8 space-y-3 opacity-30">
                    <div className="h-1.5 w-2/3 dark:bg-gray-600 bg-zinc-300 rounded-full" />
                    <div className="h-1.5 w-1/2 dark:bg-gray-600 bg-zinc-300 rounded-full" />
                    <div className="h-1.5 w-3/4 dark:bg-gray-600 bg-zinc-300 rounded-full" />
                    <div className="h-1.5 w-full dark:bg-gray-600 bg-zinc-300 rounded-full" />
                </div>
            </div>
          </BentoCard>

          {/* Card 4: Deep Skill Forensics (Small) */}
          <BentoCard 
            title="Real-Time Execution"
            description="Secure, isolated code execution powered by Judge0 for instant, reliable feedback across Python, Java, and C++."
            icon={<BarChart size={20} />}
          >
             <div className="absolute bottom-0 left-0 right-0 h-32 px-6 flex items-end justify-between pb-0 gap-2">
                 {[35, 55, 40, 70, 50, 85, 60, 95].map((h, i) => (
                     <div key={i} className="w-full dark:bg-white/5 bg-black/5 rounded-t-sm relative group/bar overflow-hidden">
                         <motion.div 
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-green/10 to-brand-green w-full rounded-t-sm opacity-60 group-hover/bar:opacity-100 transition-opacity"
                         >
                            <div className="w-full h-[1px] dark:bg-white/50 bg-black/10 absolute top-0" />
                         </motion.div>
                     </div>
                 ))}
             </div>
          </BentoCard>

           {/* Card 5: Deployment - Horizontal Layout (Full) */}
           <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-3 relative rounded-3xl overflow-hidden group border dark:border-white/10 border-zinc-200 dark:bg-[#0c0c0e] bg-white dark:hover:border-brand-green/30 hover:border-brand-green/30 transition-all duration-500 shadow-lg dark:shadow-2xl dark:shadow-black/40 shadow-zinc-200/60"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-green/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative h-full flex flex-col md:flex-row items-center z-10 p-6 md:p-8 gap-8">
               <div className="flex-1 text-left">
                  <div className="w-10 h-10 rounded-lg dark:bg-white/5 bg-emerald-50 dark:border-white/10 border-emerald-200 border flex items-center justify-center text-brand-green mb-4 shadow-inner">
                    <Globe size={20} />
                  </div>
                  <h3 className="text-xl font-bold dark:text-white text-zinc-900 mb-2">Global Contest Calendar</h3>
                  <p className="dark:text-gray-400 text-zinc-600 text-sm leading-relaxed max-w-lg">
                    Never miss a competition. Aggregate upcoming events from Codeforces, HackerRank, and LeetCode with automated email reminders.
                  </p>
               </div>
               
               {/* Visual on the right for desktop */}
               <div className="flex-1 w-full flex items-center justify-center md:justify-end relative min-h-[140px] md:min-h-[auto] md:pr-12">
                   <div className="w-32 h-32 border dark:border-white/5 border-zinc-200 rounded-full flex items-center justify-center relative group-hover:border-brand-green/20 transition-colors">
                      <div className="absolute inset-0 border border-t-brand-green/50 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-[spin_3s_linear_infinite]" />
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 bg-brand-green rounded-full shadow-[0_0_10px_#10B981]" />
                      <div className="text-center">
                         <div className="text-3xl font-bold dark:text-white text-zinc-900 font-mono tracking-tighter">45<span className="text-sm dark:text-gray-500 text-zinc-400 font-sans ml-1">ms</span></div>
                         <div className="text-[10px] text-brand-green uppercase tracking-wider font-bold mt-1">Latency</div>
                      </div>
                   </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;