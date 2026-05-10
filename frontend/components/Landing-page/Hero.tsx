import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Play } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden overflow-x-hidden">
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full dark:bg-white/5 bg-orange-50 dark:border-white/10 border-orange-200 border mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-xs font-medium text-brand-orange tracking-wide uppercase">New AI Features</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight dark:text-white text-zinc-900 mb-6 leading-[1.1]">
              Master Algorithms. <br />
              Understand Failures. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-emerald-300">
                Learn Faster.
              </span>
            </h1>
            
            <p className="text-lg dark:text-gray-400 text-zinc-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Stop struggling with fragmented resources. CodeSprint gives you adaptive learning paths, real-time code execution, and a personalized AI mentor to explain every failure and optimize every success.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button className="w-full sm:w-auto px-8 py-4 bg-brand-green text-black font-bold rounded-lg hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 group">
                Start Coding for Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-transparent border dark:border-white/20 border-zinc-300 dark:text-white text-zinc-800 font-medium rounded-lg dark:hover:border-brand-orange hover:border-brand-orange dark:hover:text-brand-orange hover:text-brand-orange transition-colors flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Watch Demo
              </button>
            </div>
            
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 dark:text-gray-500 text-zinc-500 text-sm font-medium">
              <span>Empowering Computer Science Students Worldwide</span>
              <div className="flex gap-4 opacity-70 grayscale">
                <span className="font-bold text-lg">SSUET</span>
                <span className="font-bold text-lg">FAST</span>
                <span className="font-bold text-lg">NUST</span>
                <span className="font-bold text-lg">NED</span>
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
            className="absolute -top-10 -right-10 dark:bg-[#151515] bg-white border dark:border-white/10 border-zinc-200 p-4 rounded-xl shadow-2xl z-20 hidden md:block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange">
                <Code size={20} />
              </div>
              <div>
                <p className="text-xs dark:text-gray-400 text-zinc-500">Challenge Completed</p>
                <p className="text-sm font-bold dark:text-white text-zinc-900">Two Sum <span className="text-brand-green">Passed</span></p>
              </div>
            </div>
          </motion.div>

          {/* Editor Window */}
          <div className="rounded-2xl overflow-hidden shadow-2xl dark:shadow-black/50 shadow-zinc-300/60 border dark:border-white/10 border-zinc-200 dark:bg-[#0A0A0A] bg-white">
            {/* Window Header */}
            <div className="dark:bg-[#151515] bg-[#f8f8f8] px-4 py-3 flex items-center justify-between border-b dark:border-white/5 border-zinc-200">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <div className="text-xs dark:text-gray-500 text-zinc-400 font-mono">solution.py</div>
              <div className="w-10" />
            </div>

            {/* Code Content */}
            <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
              <div className="flex dark:text-gray-400 text-zinc-600">
                <span className="mr-4 dark:text-gray-700 text-zinc-400 select-none">1</span>
                <span className="dark:text-purple-400 text-purple-600">class</span> <span className="dark:text-yellow-200 text-amber-700 ml-2">Solution</span>:
              </div>
              <div className="flex dark:text-gray-400 text-zinc-600">
                <span className="mr-4 dark:text-gray-700 text-zinc-400 select-none">2</span>
                <span className="ml-4 dark:text-purple-400 text-purple-600">def</span> <span className="dark:text-blue-400 text-blue-600 ml-2">twoSum</span>(self, nums, target):
              </div>
              <div className="flex dark:text-gray-400 text-zinc-600">
                <span className="mr-4 dark:text-gray-700 text-zinc-400 select-none">3</span>
                <span className="ml-8 dark:text-gray-500 text-zinc-400"># Optimized O(n) approach</span>
              </div>
              <div className="flex dark:text-gray-400 text-zinc-600">
                <span className="mr-4 dark:text-gray-700 text-zinc-400 select-none">4</span>
                <span className="ml-8">seen = {'{}'}</span>
              </div>
              <div className="flex dark:text-gray-400 text-zinc-600">
                <span className="mr-4 dark:text-gray-700 text-zinc-400 select-none">5</span>
                <span className="ml-8 dark:text-purple-400 text-purple-600">for</span> i, num <span className="dark:text-purple-400 text-purple-600">in</span> <span className="dark:text-blue-300 text-blue-600">enumerate</span>(nums):
              </div>
              <div className="flex dark:text-gray-400 text-zinc-600">
                <span className="mr-4 dark:text-gray-700 text-zinc-400 select-none">6</span>
                <span className="ml-12">complement = target - num</span>
              </div>
              <div className="flex dark:text-gray-400 text-zinc-600">
                <span className="mr-4 dark:text-gray-700 text-zinc-400 select-none">7</span>
                <span className="ml-12 dark:text-purple-400 text-purple-600">if</span> complement <span className="dark:text-purple-400 text-purple-600">in</span> seen:
              </div>
              <div className="flex dark:bg-brand-green/10 bg-emerald-50 -mx-6 px-6 border-l-2 border-brand-green dark:text-gray-100 text-zinc-800">
                <span className="mr-4 dark:text-gray-700 text-zinc-400 select-none">8</span>
                <span className="ml-16 dark:text-purple-400 text-purple-600">return</span> [seen[complement], i]
              </div>
              <div className="flex dark:text-gray-400 text-zinc-600">
                <span className="mr-4 dark:text-gray-700 text-zinc-400 select-none">9</span>
                <span className="ml-12">seen[num] = i</span>
              </div>
            </div>
            
            {/* Terminal Output */}
            <div className="dark:bg-[#0A0A0A] bg-zinc-50 p-4 border-t dark:border-white/5 border-zinc-200 font-mono text-xs">
              <div className="flex gap-2 mb-2">
                <span className="text-brand-green">➜</span>
                <span className="dark:text-gray-300 text-zinc-600">Running tests & AI analysis...</span>
              </div>
              <div className="text-brand-green">
                PASSED: All test cases (24ms) | AI: O(n) Time Complexity detected
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;