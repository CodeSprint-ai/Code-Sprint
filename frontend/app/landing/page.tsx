import Hero from '../../components/Hero';
import Features from '@/components/Features';
import CallToAction from "../../components/call"

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
            <main className="flex-grow">
                <Hero />
                <Features />
                <CallToAction />
            </main>
        </div>
    );
}
