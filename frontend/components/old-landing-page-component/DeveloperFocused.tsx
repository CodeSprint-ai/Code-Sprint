"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const textVariant = (direction: "left" | "right") => ({
  hidden: {
    opacity: 0,
    x: direction === "left" ? -50 : 50
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1] as const // Add 'as const' here
    },
  },
});

const videoVariant = (direction: "left" | "right") => ({
  hidden: {
    opacity: 0,
    x: direction === "left" ? -50 : 50
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1] as const // Add 'as const' here
    },
  },
});


export default function DeveloperFocused() {
  const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [ref3, inView3] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [ref4, inView4] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="bg-black text-white py-24 px-6 relative">
      {/* Aurora top */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-emerald-400/30 to-transparent blur-3xl" />

      {/* Heading */}
      <div className="max-w-5xl mx-auto text-center mb-20 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-emerald-400">
          The <span className="text-green-500"> Developer </span> Skills Platform
        </h2>
      </div>

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
            CODESPRINT COMMUNITY
          </span>
            <h2 className="text-4xl font-bold mb-6">
              Prepare and <span className="text-green-500"> apply </span> for your dream job
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl">
              Over 26 million developers have joined the HackerRank community to certify their skills, practice interviewing, and discover relevant jobs. An AI Mock Interviewer can help you prepare, while our QuickApply agent puts your job search on autopilot.
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
              src="/videos/developer1.mp4"
              muted
              playsInline
              loop
              autoPlay
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Second Block */}
        <div
          ref={ref2}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          {/* Video Left */}
          <motion.div
            variants={videoVariant("left")}
            initial="hidden"
            animate={inView2 ? "visible" : "hidden"}
            className="rounded-2xl overflow-hidden shadow-lg"
          >
            <video
              src="/videos/developer2.mp4"
              muted
              playsInline
              loop
              autoPlay
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Text Right */}
          <motion.div
            variants={textVariant("right")}
            initial="hidden"
            animate={inView2 ? "visible" : "hidden"}
            className="space-y-4"
          >
            <span className="text-sm font-semibold bg-green-500/10 text-green-500 px-4 py-1 rounded-full inline-block mb-4">
            CODESPRINT ENGAGE
          </span>
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-green-500"> Showcase </span> your tech brand
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl">
              Attract developers with hackathons that feature real-world challenges, and preview what it's like to work at your company. Our Al Assistant helps you set up a hackathon in minutes. Host it yourself or advertise and run a campaign through our developer community.
            </p>
            <Link
              href="#"
              className="inline-flex items-center text-green-400 hover:text-green-300 font-medium transition"
            >
              Learn more <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>

        {/* Third Block */}
        <div
          ref={ref3}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          {/* Text Left */}
          <motion.div
            variants={textVariant("left")}
            initial="hidden"
            animate={inView3 ? "visible" : "hidden"}
            className="space-y-4 order-2 md:order-1"
          >
            <span className="text-sm font-semibold bg-green-500/10 text-green-500 px-4 py-1 rounded-full inline-block mb-4">
            CODESPRINT SCREEN
          </span>
            <h2 className="text-4xl font-bold mb-6">
              Take-home <span className="text-green-500"> assessments </span> that ensure fairness and integrity
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl">
              Identify strong developers by administering a take-home assessment in a secure environment. Choose from a library of thousands of challenges across many roles designed by experts and validated by Industrial Psychologists for fairness.
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
            animate={inView3 ? "visible" : "hidden"}
            className="rounded-2xl overflow-hidden shadow-lg order-1 md:order-2"
          >
            <video
              src="/videos/developerscreen3.mp4"
              muted
              playsInline
              loop
              autoPlay
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Fourth Block */}
        <div
          ref={ref4}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          {/* Video Left */}
          <motion.div
            variants={videoVariant("left")}
            initial="hidden"
            animate={inView4 ? "visible" : "hidden"}
            className="rounded-2xl overflow-hidden shadow-lg"
          >
            <video
              src="/videos/developer4.mp4"
              muted
              playsInline
              loop
              autoPlay
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Text Right */}
          <motion.div
            variants={textVariant("right")}
            initial="hidden"
            animate={inView4 ? "visible" : "hidden"}
            className="space-y-4"
          >
            <span className="text-sm font-semibold bg-green-500/10 text-green-500 px-4 py-1 rounded-full inline-block mb-4">
            CODESPRINT INTERVIEW
          </span>
            <h2 className="text-4xl font-bold mb-6">
              Pair-programming <br /> <span className="text-green-500"> interviews </span> on demand
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl">
              Get an accurate sense for what it would be like to work together by pair programming with candidates on real-world scenarios. Review code, fix bugs, build a feature, and see the result, all within an interview setting using pre-set repos or one of your own.
            </p>
            <Link
              href="#"
              className="inline-flex items-center text-green-400 hover:text-green-300 font-medium transition"
            >
              Learn more <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
