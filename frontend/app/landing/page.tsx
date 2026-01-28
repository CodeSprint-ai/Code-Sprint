import CTA from "@/components/Landing-page/CTA";
import Features from "@/components/Landing-page/Features";
import Footer from "@/components/Landing-page/Footer";
import Gamification from "@/components/Landing-page/Gamification";
import Hero from "@/components/Landing-page/Hero";
import LiveDemo from "@/components/Landing-page/LiveDemo";
import Navbar from "@/components/Landing-page/Navbar";
import Showcase from "@/components/Landing-page/Showcase";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-brand-dark text-white selection:bg-brand-green/30 selection:text-brand-green">
            <Navbar />
            <main>
                <Hero />
                <Features />
                <Showcase />
                <Gamification />
                <LiveDemo />
                <CTA />
            </main>
            <Footer />
        </div>
    );
}
