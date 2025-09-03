// components/CallToAction.jsx

export default function CallToAction() {
    return (
        <section className="bg-purple-600 py-16 text-center text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                    Ready to Get Started?
                </h2>
                <p className="mt-2 text-lg opacity-90 max-w-xl mx-auto">
                    Join thousands of creators who are already building their dreams with our platform.
                </p>
                <button className="mt-8 bg-white text-purple-600 px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-gray-100 transition-colors">
                    Sign Up Now
                </button>
            </div>
        </section>
    );
}