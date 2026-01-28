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
    className={`${colSpan} relative rounded-3xl overflow-hidden group border border-white/10 bg-[#0c0c0e] hover:border-brand-green/30 transition-all duration-500 shadow-2xl shadow-black/40`}
  >
    {/* Radial gradient hover effect */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-green/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    
    <div className="relative h-full flex flex-col z-10">
      <div className="p-6">
        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-green mb-4 shadow-inner group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {/* Visual Area */}
      <div className="flex-1 relative overflow-hidden mt-2 min-h-[140px] w-full">
         <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent z-10" />
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Everything you need to go <br/>
              <span className="text-gray-500">from Junior to Senior.</span>
            </h2>
            <p className="text-lg text-gray-400">
              A seamless environment designed for flow. From your first line of code to global deployment.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AI Pair Programming (Large) */}
          <BentoCard 
            colSpan="md:col-span-2"
            title="AI Pair Programmer"
            description="Stuck on logic? Your AI companion suggests optimizations, writes unit tests, and explains complex algorithms in plain English—live."
            icon={<Cpu size={20} />}
          >
             <div className="absolute top-4 left-8 right-8 bottom-0 bg-[#151516] rounded-t-xl border border-white/10 p-5 border-b-0 shadow-2xl transform group-hover:translate-y-2 transition-transform duration-500">
                <div className="flex gap-2 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="space-y-3 font-mono text-xs">
                    <div className="flex gap-3">
                        <span className="text-gray-600 select-none">1</span>
                        <span className="text-purple-400">function</span> <span className="text-blue-400">processData</span>(input) {'{'}
                    </div>
                    <div className="flex gap-3 relative group/code">
                        <div className="absolute inset-0 bg-brand-green/10 -mx-4 border-l-2 border-brand-green" />
                        <span className="text-gray-600 select-none relative z-10">2</span>
                        <span className="text-gray-300 relative z-10 flex items-center gap-2">
                            <span className="text-brand-green">AI:</span> Suggest using .map()
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <span className="text-gray-600 select-none">3</span>
                        <span className="text-purple-400">return</span> input.map(x ={'>'} x * 2);
                    </div>
                </div>
             </div>
          </BentoCard>

          {/* Card 2: Ironclad Proctoring (Moved here, Small) */}
          <BentoCard 
            title="Ironclad Proctoring"
            description="Advanced browser lockdown and behavioral analysis ensure assessment integrity for universities and hiring managers."
            icon={<ShieldCheck size={20} />}
          >
             <div className="absolute inset-0 flex items-center justify-center">
                 <div className="relative">
                     <div className="absolute inset-0 bg-brand-green/10 blur-2xl rounded-full" />
                     <ShieldCheck size={64} strokeWidth={1} className="text-brand-green/20 relative z-10 transform group-hover:scale-110 transition-transform duration-500" />
                     <div className="absolute inset-0 flex items-center justify-center z-20">
                         <div className="bg-[#0c0c0e] border border-green-500/30 px-3 py-1 rounded-full flex items-center gap-2 shadow-xl shadow-green-900/10">
                             <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                             <span className="text-[10px] font-bold text-brand-green uppercase tracking-wide">Secure</span>
                         </div>
                     </div>
                 </div>
             </div>
          </BentoCard>

          {/* Card 3: Multiplayer Collaboration (Moved here, Expanded to Large) */}
          <BentoCard 
            colSpan="md:col-span-2"
            title="Multiplayer Collaboration"
            description="Code with teammates or interviewers in a low-latency environment with integrated video and cursor tracking."
            icon={<Users size={20} />}
          >
            <div className="absolute inset-x-6 top-4 bottom-0 bg-[#151516] rounded-t-xl border border-white/10 overflow-hidden flex items-center justify-center">
                <div className="absolute top-8 left-8 animate-blob">
                    <div className="w-3 h-3 bg-purple-500 rounded-full ring-4 ring-purple-500/20" />
                    <div className="px-2 py-0.5 bg-purple-500 text-black text-[9px] font-bold rounded ml-2 mt-1 shadow-lg">Alex</div>
                </div>
                <div className="absolute bottom-12 right-12 animate-blob animation-delay-2000">
                    <div className="w-3 h-3 bg-brand-green rounded-full ring-4 ring-brand-green/20" />
                    <div className="px-2 py-0.5 bg-brand-green text-black text-[9px] font-bold rounded ml-2 mt-1 shadow-lg">Sarah</div>
                </div>
                <div className="w-full px-8 space-y-3 opacity-30">
                    <div className="h-1.5 w-2/3 bg-gray-600 rounded-full" />
                    <div className="h-1.5 w-1/2 bg-gray-600 rounded-full" />
                    <div className="h-1.5 w-3/4 bg-gray-600 rounded-full" />
                    <div className="h-1.5 w-full bg-gray-600 rounded-full" />
                </div>
            </div>
          </BentoCard>

          {/* Card 4: Deep Skill Forensics (Small) */}
          <BentoCard 
            // Default 1 col
            title="Deep Skill Forensics"
            description="Visualize your growth. Track algorithm efficiency, bug fix rates, and code quality trends over time."
            icon={<BarChart size={20} />}
          >
             <div className="absolute bottom-0 left-0 right-0 h-32 px-6 flex items-end justify-between pb-0 gap-2">
                 {[35, 55, 40, 70, 50, 85, 60, 95].map((h, i) => (
                     <div key={i} className="w-full bg-white/5 rounded-t-sm relative group/bar overflow-hidden">
                         <motion.div 
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-green/10 to-brand-green w-full rounded-t-sm opacity-60 group-hover/bar:opacity-100 transition-opacity"
                         >
                            <div className="w-full h-[1px] bg-white/50 absolute top-0" />
                         </motion.div>
                     </div>
                 ))}
             </div>
          </BentoCard>

           {/* Card 5: Deployment - Horizontal Layout (Full) */}
           <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-3 relative rounded-3xl overflow-hidden group border border-white/10 bg-[#0c0c0e] hover:border-brand-green/30 transition-all duration-500 shadow-2xl shadow-black/40"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-green/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative h-full flex flex-col md:flex-row items-center z-10 p-6 md:p-8 gap-8">
               <div className="flex-1 text-left">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-green mb-4 shadow-inner">
                    <Globe size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Global Edge Execution</h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
                    Run your code instantly on our distributed edge network. 45ms global latency means zero waiting.
                  </p>
               </div>
               
               {/* Visual on the right for desktop */}
               <div className="flex-1 w-full flex items-center justify-center md:justify-end relative min-h-[140px] md:min-h-[auto] md:pr-12">
                   {/* The Spinner Visual */}
                   <div className="w-32 h-32 border border-white/5 rounded-full flex items-center justify-center relative group-hover:border-white/10 transition-colors">
                      {/* Rotating ring */}
                      <div className="absolute inset-0 border border-t-brand-green/50 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-[spin_3s_linear_infinite]" />
                      
                      {/* Static decorative dots */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 bg-brand-green rounded-full shadow-[0_0_10px_#10B981]" />
                      
                      <div className="text-center">
                         <div className="text-3xl font-bold text-white font-mono tracking-tighter">45<span className="text-sm text-gray-500 font-sans ml-1">ms</span></div>
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