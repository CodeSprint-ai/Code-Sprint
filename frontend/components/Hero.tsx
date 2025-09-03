// components/Hero.jsx

export default function Hero() {
    return (
        <section className="bg-gray-50 py-20 md:py-32">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                    Launch Your <span className="text-purple-600">SaaS</span> Idea, Faster Than Ever.
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Our platform provides everything you need to build and scale your business, from a beautiful UI to robust backend services.
                </p>
                <div className="mt-8 flex justify-center space-x-4">
                    <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-purple-700 transition-colors">
                        Start Free Trial
                    </button>
                    <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold shadow-md border border-gray-200 hover:bg-gray-100 transition-colors">
                        Learn More
                    </button>
                </div>
            </div>
        </section>
    );
}