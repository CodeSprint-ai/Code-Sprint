
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import CallToAction from "../../components/call"

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow">
                <Hero />
                <CallToAction />
            </main>
        </div>
    );
}