"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 md:py-32 max-w-7xl mx-auto">
      {/* Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-indigo-500/20 blur-3xl opacity-70" />

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
      >
        Level Up Your Coding Skills
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="mt-6 max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-300"
      >
        Practice coding problems, compete with others, and climb the leaderboard on{" "}
        <span className="font-semibold">CodeSprint</span>.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="mt-10 flex flex-col sm:flex-row gap-4"
      >
        <Link
          href="/register"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg hover:shadow-xl transition"
        >
          Get Started
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-xl border border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Explore Problems
        </Link>
      </motion.div>
    </section>
  );
}
