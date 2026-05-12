import type { Metadata } from "next";
import "@/app/globals.css";
import { Provider } from "./providers";
import { Inter, Fira_Code } from "next/font/google";
import { WebAppJsonLd } from "../components/JsonLd";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fira = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira",
});

export const metadata: Metadata = {
  title: {
    default: "CodeSprint – Competitive Programming & AI Learning Platform",
    template: "%s | CodeSprint",
  },
  description:
    "Master algorithms and ace coding contests with CodeSprint. Get AI-powered post-submission analysis, personalized learning roadmaps, smart hints, and a global contest calendar. Built for CS students at SSUET, FAST, NUST, NED and beyond.",
  keywords: [
    "competitive programming platform",
    "coding contest preparation",
    "DSA practice online",
    "AI coding tutor",
    "ICPC preparation",
    "LeetCode alternative Pakistan",
    "learn algorithms online",
    "Judge0 code execution",
    "personalized coding roadmap",
    "programming challenges for beginners",
  ],
  metadataBase: new URL("https://code-sprint.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "CodeSprint – Master Algorithms. Win Contests.",
    description:
      "AI-powered competitive programming platform with real-time code execution, personalized learning paths, and global contest tracking.",
    url: "https://code-sprint.com",
    siteName: "CodeSprint",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CodeSprint – Competitive Programming Platform",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeSprint – Master Algorithms. Win Contests.",
    description:
      "AI-powered competitive programming. Real-time execution. Personalized roadmaps.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${fira.variable}`}>
        <WebAppJsonLd />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
