import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="py-20 px-6 relative overflow-hidden flex justify-center">
        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-5xl bg-[#0c0c0e] border border-white/5 rounded-[2.5rem] overflow-hidden"
        >
            
            {/* Background Gradients/Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_#151516_0%,_transparent_70%)]" />
            
            {/* Green glow bottom right */}
            <div className="absolute -bottom-40 -right-20 w-[600px] h-[600px] bg-brand-green/10 rounded-full blur-[120px] pointer-events-none" />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] opacity-20" />

            {/* Content */}
            <div className="relative z-10 px-8 py-20 md:py-24 flex flex-col items-center text-center">
                
                {/* Badge */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green/5 border border-brand-green/10 mb-8"
                >
                    <div className="w-2 h-2 rounded-full bg-brand-green shadow-[0_0_10px_#10B981] animate-pulse" />
                    <span className="text-xs font-bold text-brand-green tracking-widest uppercase">Accepting New Developers</span>
                </motion.div>

                {/* Heading */}
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                    Ready to 
                    <span className="mx-3 inline-block relative">
                         <span className="relative z-10 text-black px-4 font-extrabold">build</span>
                         <motion.span 
                            initial={{ width: "0%" }}
                            whileInView={{ width: "100%" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="absolute inset-0 bg-brand-green skew-x-[-6deg] rounded-sm"
                         />
                    </span> 
                    your <br className="hidden md:block" />
                    dream career?
                </h2>
                
                <p className="text-gray-400 text-lg mb-10 max-w-xl leading-relaxed">
                    Join the platform where 26 million developers master new skills, debug their careers, and deploy their potential.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                    <button className="group w-full sm:w-auto px-8 py-4 bg-brand-green text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2">
                        Start Coding Free
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <button className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                        <Terminal className="w-4 h-4 text-gray-400" />
                        View Enterprise Plans
                    </button>
                </div>

            </div>
            
            {/* Decorative Background Icons */}
            <div className="absolute top-1/3 left-12 text-white/5 transform -rotate-12 hidden md:block select-none">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </div>
             <div className="absolute top-1/3 right-12 text-white/5 transform rotate-12 hidden md:block select-none">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
        </motion.div>
    </section>
  );
};

export default CTA;