// components/CompanyFocused.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function CompanyFocused() {
  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left column (text) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6">
            For <span className="text-green-500">Companies</span>
          </h2>
          <p className="text-gray-400 mb-6 text-lg leading-relaxed">
            Identify top developers faster. Use CodeSprint’s AI-driven
            assessments, coding challenges, and interview tools to build your
            dream team efficiently.
          </p>
          <button className="px-6 py-3 bg-green-500 text-black rounded-md font-medium hover:bg-green-400 transition">
            Explore for Companies
          </button>
        </motion.div>

        {/* Right column (visual placeholder) */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center"
          
        >
          <div className="w-full h-64 rounded-lg flex items-center justify-center border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 text-gray-500 italic">
            <Image
            src="/analytics.png"
            alt="Analytics dashboard preview"
            width={800}
            height={500}
            className="rounded-xl shadow-lg border border-gray-800"
            priority
          />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
