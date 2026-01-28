import Hero from '../../components/old-landing-page-component/Hero';
import Features from '@/components/old-landing-page-component/Features';
import DeveloperFocused from '@/components/old-landing-page-component/DeveloperFocused';
import CompanyFocused from '@/components/old-landing-page-component/CompanyFocused';
import Community from '@/components/old-landing-page-component/CommunitySection';
import Testimonials from '@/components/old-landing-page-component/Testimonials';
import AIIntegration from '@/components/old-landing-page-component/AIIntegration';
import Footer from '@/components/old-landing-page-component/Footer';

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
