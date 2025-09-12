    import Hero from '../../components/Hero';
    import Features from '@/components/Features';
    import DeveloperFocused from '@/components/DeveloperFocused';
    import CompanyFocused from '@/components/CompanyFocused';
    import Community from '@/components/CommunitySection';
    import Testimonials from '@/components/Testimonials';
    import AIIntegration from '@/components/AIIntegration';
    import Footer from '@/components/Footer';

    export default function LandingPage() {
        return (
            <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
                <main className="flex-grow">
                    <Hero />
                    <AIIntegration />
                    <Features />
                    <DeveloperFocused />
                    <CompanyFocused />
                    <Community />
                    <Testimonials />
                    <Footer />
                </main>
            </div>
        );
    }
