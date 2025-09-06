import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative bg-[#0f1117] text-white py-20">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center gap-12">
        
        {/* Left Side - Text */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Become the <span className="text-green-500">next generation</span>{" "}
            developer
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-lg">
            Master coding skills, practice interviews, and land your dream job
            with the world’s leading developer platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition">
              Start a free trial
            </button>
            <button className="px-6 py-3 border border-gray-500 rounded-lg font-medium hover:bg-gray-800 transition">
              For developers
            </button>
          </div>

          {/* Logos */}
          <div className="mt-10 flex flex-wrap items-center justify-center md:justify-start gap-6 opacity-80">
            <Image
              src="/logos/airbnb.svg"
              alt="Airbnb"
              width={100}
              height={40}
            />
            <Image
              src="/logos/stripe.svg"
              alt="Stripe"
              width={100}
              height={40}
            />
            <Image
              src="/logos/ibm.svg"
              alt="IBM"
              width={100}
              height={40}
            />
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="flex-1">
          <Image
            src="/hero-illustration.png"
            alt="Developer illustration"
            width={500}
            height={400}
            className="mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
