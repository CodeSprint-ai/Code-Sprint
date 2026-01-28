import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Play } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-green/20 rounded-full blur-[120px] -z-10 opacity-20" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-brand-orange/10 rounded-full blur-[120px] -z-10 opacity-20" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-[0.05] z-0" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center z-10">
        
        {/* Left Content */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-xs font-medium text-brand-orange tracking-wide uppercase">New AI Features</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              Code Smarter. <br />
              Interview Better. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-emerald-300">
                Get Hired Faster.
              </span>
            </h1>
            
            <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Stop grinding LeetCode in isolation. Practice with intelligent AI mentors, collaborate in real-time, and get deep analytics on your coding efficiency. The world’s most advanced developer playground is here.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button className="w-full sm:w-auto px-8 py-4 bg-brand-green text-black font-bold rounded-lg hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 group">
                Start Coding for Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white font-medium rounded-lg hover:border-brand-orange hover:text-brand-orange transition-colors flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Watch Demo
              </button>
            </div>
            
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-gray-500 text-sm font-medium">
              <span>Trusted by engineers at:</span>
              <div className="flex gap-4 opacity-70 grayscale">
                <span className="font-bold text-lg">Google</span>
                <span className="font-bold text-lg">Meta</span>
                <span className="font-bold text-lg">Amazon</span>
                <span className="font-bold text-lg">Stripe</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Visual (Mock Code Editor) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          {/* Floating Elements */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 bg-brand-gray border border-white/10 p-4 rounded-xl shadow-2xl z-20 hidden md:block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange">
                <Code size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Challenge Completed</p>
                <p className="text-sm font-bold text-white">Two Sum <span className="text-brand-green">Passed</span></p>
              </div>
            </div>
          </motion.div>

          {/* Editor Window */}
          <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl">
            {/* Window Header */}
            <div className="bg-[#151515] px-4 py-3 flex items-center justify-between border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="text-xs text-gray-500 font-mono">solution.py</div>
              <div className="w-10" />
            </div>

            {/* Code Content */}
            <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
              <div className="flex text-gray-400">
                <span className="mr-4 text-gray-700 select-none">1</span>
                <span className="text-purple-400">class</span> <span className="text-yellow-200 ml-2">Solution</span>:
              </div>
              <div className="flex text-gray-400">
                <span className="mr-4 text-gray-700 select-none">2</span>
                <span className="ml-4 text-purple-400">def</span> <span className="text-blue-400 ml-2">twoSum</span>(self, nums, target):
              </div>
              <div className="flex text-gray-400">
                <span className="mr-4 text-gray-700 select-none">3</span>
                <span className="ml-8 text-gray-500"># Optimized O(n) approach</span>
              </div>
              <div className="flex text-gray-400">
                <span className="mr-4 text-gray-700 select-none">4</span>
                <span className="ml-8">seen = {'{}'}</span>
              </div>
              <div className="flex text-gray-400">
                <span className="mr-4 text-gray-700 select-none">5</span>
                <span className="ml-8 text-purple-400">for</span> i, num <span className="text-purple-400">in</span> <span className="text-blue-300">enumerate</span>(nums):
              </div>
              <div className="flex text-gray-400">
                <span className="mr-4 text-gray-700 select-none">6</span>
                <span className="ml-12">complement = target - num</span>
              </div>
              <div className="flex text-gray-400">
                <span className="mr-4 text-gray-700 select-none">7</span>
                <span className="ml-12 text-purple-400">if</span> complement <span className="text-purple-400">in</span> seen:
              </div>
              <div className="flex bg-brand-green/10 -mx-6 px-6 border-l-2 border-brand-green text-gray-100">
                <span className="mr-4 text-gray-700 select-none">8</span>
                <span className="ml-16 text-purple-400">return</span> [seen[complement], i]
              </div>
              <div className="flex text-gray-400">
                <span className="mr-4 text-gray-700 select-none">9</span>
                <span className="ml-12">seen[num] = i</span>
              </div>
            </div>
            
            {/* Terminal Output */}
            <div className="bg-black/50 p-4 border-t border-white/5 font-mono text-xs">
              <div className="flex gap-2 mb-2">
                <span className="text-brand-green">➜</span>
                <span className="text-gray-300">Running tests...</span>
              </div>
              <div className="text-brand-green">
                PASSED: All test cases passed (24ms)
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;