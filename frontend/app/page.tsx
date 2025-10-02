// app/page.jsx
"use client";
import DeveloperFocused from "@/components/DeveloperFocused";
import CompanyFocused from "@/components/CompanyFocused";
import Testimonials from "@/components/Testimonials";
import AIIntegration from "@/components/AIIntegration";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <div className="w-full overflow-hidden">
        <div className="flex flex-col h-screen w-screen">
          <Header />
          <Hero />
        </div>
        {/* <div className="overflow-hidden w-full"> */}
        <AIIntegration />
        <DeveloperFocused />
        <CompanyFocused />
        <Testimonials />
        <Footer />
        {/* </div> */}
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
