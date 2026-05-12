"use client";

import CTA from "@/components/Landing-page/CTA";
import Features from "@/components/Landing-page/Features";
import Footer from "@/components/Landing-page/Footer";
import Gamification from "@/components/Landing-page/Gamification";
import Hero from "@/components/Landing-page/Hero";
import LiveDemo from "@/components/Landing-page/LiveDemo";
import Navbar from "@/components/Landing-page/Navbar";
import Showcase from "@/components/Landing-page/Showcase";

export default function LandingPageClient() {
    return (
        <div className="min-h-screen dark:bg-brand-dark bg-white dark:text-white text-zinc-900 dark:selection:bg-brand-green/30 dark:selection:text-brand-green selection:bg-brand-green/20 selection:text-brand-green">
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
