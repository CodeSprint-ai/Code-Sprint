"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal, ChevronDown, Code, Cpu, BookOpen, Users, Zap, Globe, FileText, Layout, MessageSquare, Briefcase, BarChart, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

const NAV_ITEMS = [
  {
    label: 'Products',
    href: '#products',
    children: [
      { label: 'Smart IDE', desc: 'AI-assisted coding environment', icon: Code, href: '#ide' },
      { label: 'Interview Prep', desc: 'Mock interviews with AI agents', icon: Users, href: '#interview' },
      { label: 'Skill Assessment', desc: 'Ranked coding challenges', icon: BarChart, href: '#assess' },
      { label: 'Proctoring', desc: 'Anti-cheat exam environment', icon: ShieldCheck, href: '#proctor' },
    ]
  },
  {
    label: 'Solutions',
    href: '#solutions',
    children: [
      { label: 'For Developers', desc: 'Upskill and land jobs', icon: Terminal, href: '#devs' },
      { label: 'For Teams', desc: 'Hire and train talent', icon: Briefcase, href: '#teams' },
      { label: 'For Education', desc: 'Classroom management', icon: BookOpen, href: '#edu' },
    ]
  },
  {
    label: 'Resources',
    href: '#resources',
    children: [
      { label: 'Documentation', desc: 'Guides and API references', icon: FileText, href: '#docs' },
      { label: 'Blog', desc: 'Latest tech trends', icon: Layout, href: '#blog' },
      { label: 'Community', desc: 'Join the discord', icon: MessageSquare, href: '#community' },
    ]
  },
  {
    label: 'Pricing',
    href: '#pricing',
    children: [
      { label: 'Individual', desc: 'Free for developers', icon: Zap, href: '#individual' },
      { label: 'Enterprise', desc: 'Custom scale', icon: Globe, href: '#enterprise' },
    ]
  },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'dark:bg-[#09090B]/80 bg-white/80 backdrop-blur-lg py-4 shadow-sm dark:shadow-none'
        : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer group z-50 relative">
          <div className="bg-gradient-to-tr from-brand-green to-emerald-900 p-2 rounded-lg group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300">
            <Terminal className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight dark:text-white text-zinc-900 code-font">
            CodeSprint<span className="text-brand-green">AI</span>
          </span>
        </div>

        {/* Desktop Links with Dropdowns */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative px-3 py-2 group"
              onMouseEnter={() => setHoveredNav(item.label)}
              onMouseLeave={() => setHoveredNav(null)}
            >
              <a
                href={item.href}
                className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-300 ${hoveredNav === item.label
                  ? 'dark:text-white text-zinc-900'
                  : 'dark:text-zinc-400 text-zinc-600 dark:hover:text-white hover:text-zinc-900'
                }`}
              >
                {item.label}
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-300 opacity-50 group-hover:opacity-100 ${hoveredNav === item.label ? 'rotate-180 text-brand-green' : ''}`}
                />
              </a>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {hoveredNav === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-[320px]"
                  >
                    <div className="dark:bg-[#0c0c0e] bg-white backdrop-blur-2xl dark:border-white/10 border-zinc-200 border rounded-2xl p-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,1)] overflow-hidden dark:ring-1 dark:ring-white/5 ring-1 ring-zinc-100">
                      <div className="flex flex-col gap-1">
                        {item.children.map((child, idx) => (
                          <a
                            key={idx}
                            href={child.href}
                            className="flex items-start gap-3 p-3 rounded-xl dark:hover:bg-white/5 hover:bg-zinc-50 transition-colors group/item"
                          >
                            <div className="mt-1 w-8 h-8 rounded-lg dark:bg-white/5 bg-zinc-100 flex items-center justify-center dark:text-zinc-400 text-zinc-500 group-hover/item:text-brand-green group-hover/item:bg-brand-green/10 transition-colors dark:border-white/5 border-zinc-200 border group-hover/item:border-brand-green/20">
                              <child.icon size={16} />
                            </div>
                            <div>
                              <div className="text-sm font-semibold dark:text-zinc-200 text-zinc-800 dark:group-hover/item:text-white group-hover/item:text-zinc-900 mb-0.5 flex items-center gap-2">
                                {child.label}
                              </div>
                              <div className="text-xs dark:text-zinc-500 text-zinc-500 dark:group-hover/item:text-zinc-400 group-hover/item:text-zinc-600 leading-relaxed">
                                {child.desc}
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link href="/auth/login?redirect=%2Fdashboard">
            <button className="text-sm font-medium dark:text-zinc-400 text-zinc-600 dark:hover:text-white hover:text-zinc-900 transition-colors cursor-pointer">
              Log In
            </button>
          </Link>
          <Link href="/auth/signup">
            <button className="relative overflow-hidden bg-brand-green  text-black font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] group cursor-pointer">
              <span className="relative z-10">Create New Account</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            className="text-foreground p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden dark:bg-[#09090B] bg-white fixed inset-0 top-[72px] z-40 overflow-y-auto"
          >
            <div className="p-6 flex flex-col gap-6 min-h-full pb-32">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  <div className="dark:text-white text-zinc-900 text-lg font-bold mb-4 flex items-center gap-2">
                    {item.label}
                  </div>
                  <div className="grid gap-3">
                    {item.children.map((child, i) => (
                      <a
                        key={i}
                        href={child.href}
                        className="flex items-center gap-4 p-3 rounded-xl dark:bg-white/5 bg-zinc-50 dark:border-white/5 border-zinc-200 border dark:active:bg-white/10 active:bg-zinc-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg dark:bg-black/50 bg-brand-green/10 flex items-center justify-center text-brand-green">
                          <child.icon size={16} />
                        </div>
                        <div className="font-medium dark:text-zinc-300 text-zinc-700 text-sm">{child.label}</div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
              <div className="h-px dark:bg-white/10 bg-zinc-200 my-2" />
              <div className="h-px dark:bg-white/10 bg-zinc-200 my-2" />
              <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="dark:text-white text-zinc-800 font-medium py-4 border dark:border-white/10 border-zinc-200 rounded-xl dark:hover:bg-white/5 hover:bg-zinc-50 transition-colors w-full mb-4">Log In</button>
              </Link>
              <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="bg-brand-green text-black font-bold py-4 rounded-xl w-full shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  Create New Account
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;