// app/page.jsx
"use client";

import CTA from "@/components/Landing-page/CTA";
import Features from "@/components/Landing-page/Features";
import Footer from "@/components/Landing-page/Footer";
import Gamification from "@/components/Landing-page/Gamification";
import Hero from "@/components/Landing-page/Hero";
import LiveDemo from "@/components/Landing-page/LiveDemo";
import Navbar from "@/components/Landing-page/Navbar";
import Showcase from "@/components/Landing-page/Showcase";

// import DeveloperFocused from "@/components/old-landing-page-component/DeveloperFocused";
// import CompanyFocused from "@/components/old-landing-page-component/CompanyFocused";
// import Testimonials from "@/components/old-landing-page-component/Testimonials";
// import AIIntegration from "@/components/old-landing-page-component/AIIntegration";
// import Footer from "@/components/old-landing-page-component/Footer";
// import Hero from "@/components/old-landing-page-component/Hero";
// import Header from "@/components/old-landing-page-component/Header";

export default function Home() {
  return (
    <>
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
    </>
  );
}
// export default function LandingPage() {
//     return (
//         <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
//             <main className="flex-grow">

//                 <Hero />
//                 <AIIntegration />
//                 <Features />
//                 <DeveloperFocused />
//                 <CompanyFocused />
//                 <Community />
//                 <Testimonials />
//                 <Footer />
//             </main>
//         </div>
//     );
// }



{/* <div className="w-full overflow-hidden">
  <div className="flex flex-col h-screen w-screen">
    <Header />
    <Hero />
  </div>
  <AIIntegration />
  <DeveloperFocused />
  <CompanyFocused />
  <Testimonials />
  <Footer />
</div> */}
