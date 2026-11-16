"use client";

import CTA from "./components/CTA";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Gamification from "./components/Gamification";
import Hero from "./components/Hero";
import LiveDemo from "./components/LiveDemo";
import Navbar from "./components/Navbar";
import Showcase from "./components/Showcase";

export default function LandingPage() {
    return (
        <div className="min-h-screen dark:bg-brand-dark bg-white dark:text-white text-zinc-900 dark:selection:bg-brand-green/30 dark:selection:text-brand-green selection:bg-brand-green/20 selection:text-brand-green">
            <Navbar />
            <main id="main-content">
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
