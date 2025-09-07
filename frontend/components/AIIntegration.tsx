// components/AIIntegration.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AIIntegration() {
  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6">
            The Future is{" "}
            <span className="text-green-500">Human + AI</span>
          </h2>
          <p className="text-gray-400 mb-6">
            CodeSprint empowers developers and companies with AI-driven tools.
            From personalized challenges to intelligent assessments, our platform
            combines human creativity with the power of AI.
          </p>
          <a
            href="#"
            className="inline-block px-6 py-3 rounded-lg bg-green-500 text-black font-medium hover:bg-green-400 transition"
          >
            Learn More
          </a>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Image
            src="/ai-illustration.png"
            alt="AI Integration"
            width={400}
            height={400}
            className="rounded-xl shadow-lg border border-gray-800"
          />
        </motion.div>
      </div>
    </section>
  );
}
