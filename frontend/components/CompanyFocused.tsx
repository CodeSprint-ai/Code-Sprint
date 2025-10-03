// components/CompanyFocused.tsx

"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const textVariant = (direction: "left" | "right") => ({
  hidden: {
    opacity: 0,
    x: direction === "left" ? -50 : 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1] as const, // Add 'as const' here
    },
  },
});

const videoVariant = (direction: "left" | "right") => ({
  hidden: {
    opacity: 0,
    x: direction === "left" ? -50 : 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1] as const, // Add 'as const' here
    },
  },
});

export default function DeveloperFocused() {
  const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="bg-black text-white pb-24 px-6 relative">
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-emerald-400/30 to-transparent blur-3xl" />
      <div className="max-w-6xl mx-auto space-y-32">
        {/* First Block */}
        <div
          ref={ref1}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          {/* Text Left */}
          <motion.div
            variants={textVariant("left")}
            initial="hidden"
            animate={inView1 ? "visible" : "hidden"}
            className="space-y-4 order-2 md:order-1"
          >
            <span className="text-sm font-semibold bg-green-500/10 text-green-500 px-4 py-1 rounded-full inline-block mb-4">
              CODESPRINT SKILLUP
            </span>
            <h2 className="text-4xl font-bold mb-6">
              Find skills inside your{" "}
              <span className="text-green-500"> company </span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl">
              Empower developers to showcase their skills, earn certifications,
              and gain recognition - while helping you strengthen your
              organization. Our Al Tutor helps developers learn as they go,
              while our advanced insights help you understand the skillsets of
              your organization.
            </p>
            <Link
              href="#"
              className="inline-flex items-center text-green-400 hover:text-green-300 font-medium transition"
            >
              Learn more <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>

          {/* Video Right */}
          <motion.div
            variants={videoVariant("right")}
            initial="hidden"
            animate={inView1 ? "visible" : "hidden"}
            className="rounded-2xl overflow-hidden shadow-lg order-1 md:order-2"
          >
            <video
              src="/videos/developer5.mp4"
              muted
              playsInline
              loop
              autoPlay
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
