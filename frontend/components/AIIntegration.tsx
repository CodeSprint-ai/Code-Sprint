// components/FutureSection.tsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const paragraphs = [
  "We’ve entered a new era of software development where humans and AI build together. This changes the skills you need as a developer, and the way companies engage, hire and upskill technical talent. In short, this changes everything.",
  "We’re embracing these changes with you, and we’ve reinvented our products to meet the moment.",
];

// Variants for word-level fade animation (only opacity change now)
const wordVariants = {
  hidden: { opacity: 0.1 },
  visible: { opacity: 1 },
  exit: { opacity: 0.1 },
};

export default function FutureSection() {
  return (
    <section className="relative overflow-hidden py-32 bg-black">
      {/* Aurora top */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-emerald-400/30 to-transparent blur-3xl" />
      {/* Aurora bottom */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-emerald-400/30 to-transparent blur-3xl" />
      {/* Starry background */}
      <div className="absolute inset-0 bg-[radial-gradient(white,transparent_1px)] [background-size:22px_22px] opacity-20" />

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center px-6">
        {/* LEFT: TEXT */}
        <div className="space-y-10 text-left">
          {/* First Line */}
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.6 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-emerald-400"
          >
            The future is Human <span className="text-white">plus</span> AI
          </motion.h2>

          {/* Paragraphs */}
          <div className="space-y-8">
            {paragraphs.map((line, idx) => (
              <motion.p
                key={idx}
                className="text-lg md:text-xl leading-relaxed text-gray-200 max-w-2xl"
              >
                {line.split(" ").map((word, wIdx) => (
                  <motion.span
                    key={wIdx}
                    variants={wordVariants}
                    initial="hidden"
                    whileInView="visible"
                    exit="exit"
                    transition={{ duration: 0.5, delay: wIdx * 0.04 }}
                    viewport={{ once: false, amount: 0.6 }}
                    className="inline-block mr-2"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.p>
            ))}
          </div>
        </div>

        {/* RIGHT: IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.5 }}
          className="rounded-2xl overflow-hidden shadow-lg"
        >
          <Image
            src="/ai-illustration.png" // replace with your Freepik image
            alt="Human + AI Illustration"
            width={600}
            height={500}
            className="rounded-2xl object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
