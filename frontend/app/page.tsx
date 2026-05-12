import { Metadata } from "next";
import LandingPageClient from "./landing/LandingPageClient";

export const metadata: Metadata = {
  title: "CodeSprint – Competitive Programming & AI Learning Platform",
  alternates: { canonical: "https://code-sprint.com" },
};

export default function Home() {
  return <LandingPageClient />;
}
