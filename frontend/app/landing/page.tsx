import Header from '../../components/Header';
import Hero from '../../components/Hero';
import SystemThemeTest from "@/components/SystemThemeTest";
import CallToAction from "../../components/call"

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
            <Header />
            <main className="flex-grow">
                <SystemThemeTest />
                <Hero />
                <CallToAction />
            </main>
        </div>
    );
}
