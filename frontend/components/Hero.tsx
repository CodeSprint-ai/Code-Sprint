"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
            Sharpen Your <span className="text-green-600">Coding Skills</span> with CodeSprint
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Join thousands of developers practicing coding challenges, 
            competing in contests, and climbing the global leaderboard.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition">
              Start Coding
            </button>
            <button className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              For Companies
            </button>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">26+ million</span> developers already learning on CodeSprint
          </div>
        </motion.div>

        {/* Right Side Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center md:justify-end"
        >
          <Image
            src="/hero-illustration.png"
            alt="Hero Illustration"
            width={500}
            height={400}
            className="w-full h-auto object-contain"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
