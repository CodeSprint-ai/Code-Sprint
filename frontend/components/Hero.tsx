"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center md:text-left"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Sharpen Your{" "}
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              Coding Skills
            </span>{" "}
            with CodeSprint
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto md:mx-0">
            Practice challenges, compete in coding contests, climb the
            leaderboard, and grow with the community — all in one place.
          </p>

          <div className="mt-8 flex justify-center md:justify-start">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold text-lg hover:bg-green-700 transition-colors"
            >
              Start Coding
            </Link>
          </div>
        </motion.div>

        {/* Right Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 flex justify-center md:justify-end"
        >
          {/* Placeholder image / illustration */}
          <div className="w-72 h-72 md:w-96 md:h-96 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-2xl shadow-xl flex items-center justify-center text-white font-bold text-2xl">
            🚀 CodeSprint
          </div>
        </motion.div>
      </div>
    </section>
  );
}
