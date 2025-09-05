"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { label: "Home", href: "/landing" },       // existing route
  { label: "Challenges", href: "/dashboard" }, // your current challenges area
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Login", href: "/login" },
  { label: "Signup", href: "/register" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/70 shadow-md">
      <div className="mx-auto flex items-center justify-between px-6 py-4 max-w-7xl">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent"
        >
          CodeSprint
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <motion.div whileHover={{ scale: 1.06 }} key={item.href}>
              <Link
                href={item.href}
                className={
                  item.label === "Signup"
                    ? "px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                    : "text-gray-800 dark:text-gray-200 hover:text-green-600 transition-colors"
                }
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          className="md:hidden text-gray-800 dark:text-gray-200"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.nav
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="md:hidden bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-md"
        >
          <ul className="flex flex-col items-center gap-4 py-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={
                    item.label === "Signup"
                      ? "px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                      : "text-gray-800 dark:text-gray-200 hover:text-green-600 transition-colors"
                  }
                  onClick={() => setIsOpen(false)}
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
