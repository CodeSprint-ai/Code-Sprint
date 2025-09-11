"use client";

import Image from "next/image";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { motion } from "framer-motion";

export default function Hero() {
  const [word] = useTypewriter({
    words: ["Upskill", "Hire", "Become"],
    loop: true,
    delaySpeed: 2000,
  });

  return (
    <section className="relative bg-[#0f1117] text-white py-20">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 flex flex-col items-center text-center">
        
        {/* Animated Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold leading-tight mb-6"
        >
          <span className="text-green-500">
            {word}
            <Cursor cursorStyle=" " />
          </span>
          the next <br /> generation developer
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg text-gray-300 mb-8 max-w-2xl"
        >
          Master coding skills, practice interviews, and land <br /> your dream job
          with the world’s leading developer platform.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="px-6 py-3 bg-gray-900 text-green-500 rounded-lg font-medium hover:text-black hover:bg-green-600 transition-all">
            Start a free trial
          </button>
          <button className="px-6 py-3 bg-gray-900 text-green-500 rounded-lg font-medium hover:text-black hover:bg-green-600 transition-all">
            For developers
          </button>
        </motion.div>

        {/* Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-10 opacity-80"
        >
          <Image src="/logos/airbnb.svg" alt="Airbnb" width={90} height={40} />
          <Image src="/logos/stripe.svg" alt="Stripe" width={90} height={40} />
          <Image src="/logos/linkedin.svg" alt="LinkedIn" width={90} height={40} />
          <Image src="/logos/atlassian.svg" alt="Atlassian" width={90} height={40} />
          <Image src="/logos/ibm.svg" alt="IBM" width={90} height={40} />
          <Image src="/logos/snap.svg" alt="Snap Inc." width={90} height={40} />
          <Image src="/logos/doordash.svg" alt="Doordash" width={90} height={40} />
          <Image src="/logos/adobe.svg" alt="Adobe" width={90} height={40} />
          <Image src="/logos/paypal.svg" alt="Paypal" width={90} height={40} />
          <Image src="/logos/goldman.svg" alt="Goldman Sachs" width={90} height={40} />
          <Image src="/logos/canva.svg" alt="Canva" width={90} height={40} />
        </motion.div>
      </div>
    </section>
  );
}
