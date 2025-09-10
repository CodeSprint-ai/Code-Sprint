// components/Footer.tsx
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-white">CodeSprint</h2>
          <p className="mt-2 text-sm text-gray-400">
            Level up your coding journey with AI-powered challenges and a
            thriving developer community.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/challenges" className="hover:text-white transition">
                Challenges
              </Link>
            </li>
            <li>
              <Link href="/ai-tools" className="hover:text-white transition">
                AI Tools
              </Link>
            </li>
            <li>
              <Link href="/community" className="hover:text-white transition">
                Community
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <Link href="https://github.com" target="_blank">
              <Github className="w-6 h-6 hover:text-white transition" />
            </Link>
            <Link href="https://twitter.com" target="_blank">
              <Twitter className="w-6 h-6 hover:text-white transition" />
            </Link>
            <Link href="https://linkedin.com" target="_blank">
              <Linkedin className="w-6 h-6 hover:text-white transition" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} CodeSprint. All rights reserved.
      </div>
    </footer>
  );
}
