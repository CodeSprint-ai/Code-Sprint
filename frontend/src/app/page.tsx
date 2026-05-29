import { Metadata } from "next";
import { LandingPage } from "@/features/landing";

export const metadata: Metadata = {
  title: "CodeSprint – Competitive Programming & AI Learning Platform",
  alternates: { canonical: "https://code-sprint.com" },
};

export default function Home() {
  return <LandingPage />;
}
