"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    logo: "/logos/akamai.svg",
    text: "The proctoring features of CodeSprint have a profound impact on the candidate experience. It reassures them that their skills and potential are what truly matter to us.",
    author: "K. Thomas",
    role: "Head of Talent Acquisition",
  },
  {
    logo: "/logos/atlassian.svg",
    text: "CodeSprint helped us go beyond traditional universities. We've scaled up our college hiring from zero to 200.",
    author: "A. Viswanathan",
    role: "Head of Engineering",
  },
  {
    logo: "/logos/vanguard.svg",
    text: "We have seen a significant reduction in the number of interviews needed in order to hire the same number of high-quality candidates.",
    author: "N. Alexandro",
    role: "IT Director",
  },
  {
    logo: "/logos/ukg.svg",
    text: "The platform effectively replicates a real-world office environment, providing candidates with a glimpse of what they would encounter on the job.",
    author: "M. Teolis",
    role: "Talent Acquisition Manager",
  },
  {
    logo: "/logos/doordash.svg",
    text: "We cut down hiring time by months, which was huge for us. We owe that to CodeSprint.",
    author: "M. Patino",
    role: "University Recruiting",
  },
  {
    logo: "/logos/deliveroo.svg",
    text: "CodeSprint SkillUp received rave reviews. We started with our junior team and have now extended it to our mid-level.",
    author: "A. Coleman",
    role: "Senior Recruiting Manager",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [autoSlide, setAutoSlide] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setAutoSlide(false);
  };

  const nextTestimonial = () => {
    setDirection(1);
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setAutoSlide(false);
  };

  useEffect(() => {
    if (!autoSlide) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoSlide]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  return (
    <section className="py-15 bg-black text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-emerald-400/30 to-transparent blur-3xl" />
      <div className="container mx-auto text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-emerald-400 leading-tight">
          Loved by <span className="text-green-500">companies</span> of all sizes and <br />{" "}
          <span className="text-green-500">developers</span> from all backgrounds
        </h2>

        <div className="mt-16 relative max-w-6xl mx-auto">
          <div className="flex items-start gap-4 md:gap-8">
            {/* Left Arrow */}
            <button
              onClick={prevTestimonial}
              className="text-white text-8xl hover:text-green-500 transition flex-shrink-0 leading-none pt-20"
              aria-label="Previous testimonial"
            >
              ‹
            </button>

            {/* Content Container with Fixed Height */}
            <div className="flex-1 relative" style={{ height: '350px' }}>
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={current}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="absolute top-0 left-0 right-0"
                >
                  <Card className="bg-transparent border-0 shadow-none w-full">
                    <CardContent className="flex flex-col items-center justify-start space-y-6 py-0">
                      <Image
                        src={testimonials[current].logo}
                        alt="Company Logo"
                        width={200}
                        height={80}
                        className="mx-auto"
                      />
                      <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl">
                        {testimonials[current].text}
                      </p>
                      <p className="text-gray-400">
                        <span className="font-semibold text-white">
                          {testimonials[current].author}
                        </span>{" "}
                        {testimonials[current].role}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Arrow */}
            <button
              onClick={nextTestimonial}
              className="text-white text-8xl hover:text-green-500 transition flex-shrink-0 leading-none pt-20"
              aria-label="Next testimonial"
            >
              ›
            </button>
          </div>
        </div>

        {/* Navigation Dots - Closer to content */}
        <div className="flex items-center justify-center">
          <div className="flex space-x-1">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                  setAutoSlide(false);
                }}
                className={`h-4 w-4 rounded-full transition-colors ${
                  i === current ? "bg-green-500" : "bg-gray-600"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}