"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  return (
    <footer className="bg-black text-white overflow-hidden">
      {/* Two-Column Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 relative border-1 border-white">
        {/* Aurora Effects - Adjusted for better symmetry and reduced overlap */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-64 bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent blur-xl z-0" />
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-1 h-64 bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent blur-xl z-0" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-64 bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent blur-xl z-0" />

        {/* For Developers */}
        <div
          className={`relative p-8 md:p-16 transition-all duration-500 overflow-hidden
    ${hoveredSection === "developers"
              ? "bg-black/60"
              : "bg-black/50"}`}
          onMouseEnter={() => setHoveredSection("developers")}
          onMouseLeave={() => setHoveredSection(null)}
        >
          {/* Aurora background */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-500
      ${hoveredSection === "developers" ? "opacity-100" : "opacity-0"}`}
          >
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-emerald-400/30 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-500/20 rounded-full mix-blend-screen filter blur-2xl animate-spin-slow"></div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">For Developers</h2>
          <p className="text-gray-300 text-base md:text-lg mb-8 max-w-md">
            Over 26 million developers have joined the HackerRank Community to
            learn and certify their skills, practice interviewing, and discover
            relevant jobs.
          </p>
          <Link
            href="/developers"
            className={`inline-block px-8 py-3 rounded transition-all duration-300 font-medium text-center w-full sm:w-auto ${hoveredSection === "developers"
                ? "bg-green-500 text-black hover:bg-green-400"
                : "border-1 border-white text-white hover:bg-white hover:text-black"
              }`}
          >
            Join the Community
          </Link>
        </div>

        {/* Vertical Line between sections */}
        <div className="hidden md:block border-l border-white h-full absolute left-1/2 transform -translate-x-1/2" />

        {/* For Companies */}
        <div
          className={`relative p-8 md:p-16 transition-all duration-500 overflow-hidden
    ${hoveredSection === "companies"
              ? "bg-black/60"
              : "bg-black/50"}`}
          onMouseEnter={() => setHoveredSection("companies")}
          onMouseLeave={() => setHoveredSection(null)}
        >
          {/* Aurora background */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-500
      ${hoveredSection === "companies" ? "opacity-100" : "opacity-0"}`}
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-400/30 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-500/20 rounded-full mix-blend-screen filter blur-2xl animate-spin-slow"></div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">For Companies</h3>
          <p className="text-gray-300 text-base md:text-lg mb-8 max-w-md">
            Thousands of companies have embraced the new way to hire and upskill
            developers across roles and throughout their careers.
          </p>
          <Link
            href="/companies"
            className={`inline-block px-8 py-3 rounded transition-all duration-300 font-medium text-center w-full sm:w-auto ${hoveredSection === "companies"
                ? "bg-green-500 text-black hover:bg-green-400"
                : "border-1 border-white text-white hover:bg-white hover:text-black"
              }`}
          >
            Start a Free Trial
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-gray-950 py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 mb-12">
            {/* Products */}
            <div className="flex flex-col">
              <h3 className="text-white font-semibold mb-4 text-lg">Products</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/screen"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Screen
                  </Link>
                </li>
                <li>
                  <Link
                    href="/interview"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Interview
                  </Link>
                </li>
                <li>
                  <Link
                    href="/engage"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Engage
                  </Link>
                </li>
                <li>
                  <Link
                    href="/skillup"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    SkillUp
                  </Link>
                </li>
                <li>
                  <Link
                    href="/certified"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Certified assessments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/plagiarism"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Plagiarism detection
                  </Link>
                </li>
                <li>
                  <Link
                    href="/questions"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Real-world questions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Solutions */}
            <div className="flex flex-col">
              <h3 className="text-white font-semibold mb-4 text-lg">Solutions</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/skills-strategy"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Set up your skills strategy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/showcase"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Showcase your tech brand
                  </Link>
                </li>
                <li>
                  <Link
                    href="/optimize"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Optimize your hiring process
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mobilize"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Mobilize your internal talent
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="flex flex-col">
              <h3 className="text-white font-semibold mb-4 text-lg">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/customers"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Customer stories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/roles"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Roles directory
                  </Link>
                </li>
                <li>
                  <Link
                    href="/partners"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Partners
                  </Link>
                </li>
                <li>
                  <Link
                    href="/integrations"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    href="/whats-new"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    What's new
                  </Link>
                </li>
                <li>
                  <Link
                    href="/writing"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Writing
                  </Link>
                </li>
              </ul>
            </div>

            {/* About us */}
            <div className="flex flex-col">
              <h3 className="text-white font-semibold mb-4 text-lg">About us</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/careers"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/status"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Status
                  </Link>
                </li>
                <li>
                  <Link
                    href="/trust"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Trust
                  </Link>
                </li>
              </ul>
            </div>

            {/* Get started */}
            <div className="flex flex-col">
              <h3 className="text-white font-semibold mb-4 text-lg">Get started</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/free-trial"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Free Trial
                  </Link>
                </li>
                <li>
                  <Link
                    href="/demo"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Request a demo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    Product support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/for-developers"
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    For developers
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo and Copyright */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
              </div>
              <Link href="/" className="text-2xl font-bold text-green-500 ">
                CodeSprint <br /> <span className="text-gray-500 text-sm">© CodeSprint 2025 All Rights Reserved.</span>
              </Link>
            </div>

            {/* Links */}
            <div className="flex items-center space-x-6">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-green-500 transition text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-green-500 transition text-sm"
              >
                Terms of Service
              </Link>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                className="text-gray-400 hover:text-green-500 transition"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                className="text-gray-400 hover:text-green-500 transition"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                className="text-gray-400 hover:text-green-500 transition"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                className="text-gray-400 hover:text-green-500 transition"
              >
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}