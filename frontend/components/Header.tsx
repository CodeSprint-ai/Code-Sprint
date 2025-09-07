"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { label: "Home", href: "/home" },
  { label: "Problems", href: "/dashboard" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Sign Up", href: "/register" },
  { label: "Log In", href: "/login" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 backdrop-blur-md bg-white/30 dark:bg-black/30 shadow-md">
      <div className="mx-auto flex items-center justify-between px-6 py-4 max-w-7xl">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          CodeSprint
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <motion.div
              whileHover={{ scale: 1.1 }}
              key={item.href}
            >
              <Link
                href={item.href}
                className="text-gray-800 dark:text-gray-200 hover:text-purple-500 transition-colors"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-800 dark:text-gray-200"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.nav
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          className="md:hidden bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-md"
        >
          <ul className="flex flex-col items-center space-y-4 py-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-gray-800 dark:text-gray-200 hover:text-purple-500 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}
    
    </header>
  );
}
