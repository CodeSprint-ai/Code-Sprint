"use client";

import { motion } from "framer-motion";

export default function DeveloperFocused() {
  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-4xl font-bold">
            For <span className="text-green-500">Developers</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Prepare and apply for your dream job. Practice interviews, certify your skills,
            and join global challenges to grow as a developer.
          </p>
          <ul className="space-y-3 text-gray-300 list-disc list-inside">
            <li>Prepare and apply for your dream job</li>
            <li>Certify your skills with real-world assessments</li>
            <li>Practice interviewing with AI-powered tools</li>
          </ul>
        </motion.div>

        {/* Right Side Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <img
            src="/editor.png"
            alt="Code editor preview"
            className="rounded-xl shadow-lg border border-gray-800"
          />
        </motion.div>
      </div>
    </section>
  );
}
