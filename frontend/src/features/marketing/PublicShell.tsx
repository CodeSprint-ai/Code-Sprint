import { MotionSurface } from "@/features/marketing/MotionSurface";
import Navbar from "@/features/landing/components/Navbar";
import Footer from "@/features/landing/components/Footer";
import "./marketing.css";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionSurface>
      <Navbar />
      <main id="main-content" className="m-main">
        {children}
      </main>
      <Footer />
    </MotionSurface>
  );
}
export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <header className="m-container m-page-intro">
      <p className="m-kicker">{eyebrow}</p>
      <h1>{title}</h1>
      <div className="m-page-description">{children}</div>
    </header>
  );
}
export const cardClass = "m-panel";
export const primaryClass = "m-button";
export const secondaryClass = "m-button m-button-secondary";
