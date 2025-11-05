// components/Community.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Community() {
  return (
    <section className="py-20 bg-black text-white overflow-hidden ">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <span className="text-sm font-semibold bg-green-500/10 text-green-500 px-4 py-1 rounded-full inline-block mb-4">
            CODESPRINT COMMUNITY
          </span>

          <h2 className="text-4xl font-bold mb-6">
            Learn, Compete & Grow with the{" "}
            <span className="text-green-500">Community</span>
          </h2>

          <p className="text-gray-400 mb-6">
            Join thousands of developers worldwide who are solving challenges, 
            sharing knowledge, and preparing for their dream jobs together. 
            Be a part of the global movement.
          </p>

          <a
            href="#"
            className="inline-flex items-center gap-2 text-green-500 hover:text-green-400 transition font-medium"
          >
            Learn more
            <ArrowRight className="w-4 h-4" />
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
            src="/community-editor.png"
            alt="Community code editor"
            width={500}
            height={350}
            className="rounded-xl shadow-lg border border-gray-800"
          />
        </motion.div>
      </div>
    </section>
  );
}
