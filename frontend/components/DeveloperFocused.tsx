// components/DeveloperFocused.tsx
export default function DeveloperFocused() {
  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Text */}
        <div>
          <h2 className="text-4xl font-bold mb-6">
            For <span className="text-green-500">Developers</span>
          </h2>
          <p className="text-gray-400 mb-4">
            Prepare and apply for your dream job with real-world coding challenges. 
          </p>
          <p className="text-gray-400 mb-4">
            Certify your skills and showcase your expertise to employers.
          </p>
          <p className="text-gray-400">
            Practice interviewing and build confidence with hands-on experience.
          </p>
          <button className="mt-6 px-6 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-600 transition">
            Start Practicing
          </button>
        </div>

        {/* Right Side - Image Placeholder */}
        <div className="bg-gray-900 rounded-lg h-64 flex items-center justify-center">
          <span className="text-gray-500">[ Code Editor Image ]</span>
        </div>
      </div>
    </section>
  );
}
