"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type LinkItem = {
  title: string;
  desc?: string;
};

type MenuColumn = {
  heading: string;
  links: LinkItem[];
};

type MenuItems = {
  Products: MenuColumn[];
  Solutions: MenuColumn[];
  Resources: MenuColumn[];
};

const dropdownAnimation = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15 } },
};

const menuItems: MenuItems = {
  Products: [
    {
      heading: "Products",
      links: [
        { title: "Screen", desc: "Save time and accelerate your hiring" },
        { title: "Interview", desc: "Conduct stellar technical interviews" },
        { title: "Engage", desc: "Promote your tech brand" },
        { title: "SkillUp", desc: "Mobilize your tech talent" },
      ],
    },
    {
      heading: "Features",
      links: [
        {
          title: "Certified Assessments",
          desc: "Launch standardized, role-based tests in minutes",
        },
        {
          title: "Plagiarism Detection",
          desc: "Ensure fairness with AI-powered plagiarism detection",
        },
        {
          title: "Real-World Questions",
          desc: "Assess hires with real-world coding questions",
        },
        {
          title: "Integrations",
          desc: "Seamlessly connect with your favorite tools",
        },
      ],
    },
  ],
  Solutions: [
    {
      heading: "What we do",
      links: [
        { title: "Set Up Your Skills Strategy" },
        { title: "Showcase your tech brand" },
        { title: "Optimize Your Hiring Process" },
        { title: "Mobilize your Internal Talent" },
        { title: "AI Data Services" },
      ],
    },
    {
      heading: "Use Cases",
      links: [{ title: "Remote Hiring" }, { title: "University Hiring" }],
    },
  ],
  Resources: [
    {
      heading: "Learn",
      links: [
        { title: "Blog", desc: "Hiring best practices and insights" },
        {
          title: "Roles Directory",
          desc: "Explore the definitive directory of tech roles",
        },
        {
          title: "Resource Library",
          desc: "Guides, datasheets, and data-driven content",
        },
        {
          title: "Customer Stories",
          desc: "How leading companies use HackerRank",
        },
        {
          title: "Developer Skills Report",
          desc: "Key trends and forecasts for 2025",
        },
      ],
    },
    {
      heading: "Product Help",
      links: [
        {
          title: "What's New",
          desc: "Get the latest product news and updates",
        },
        {
          title: "Partners",
          desc: "Learn more about the HackerRank Partner Network",
        },
        {
          title: "Support",
          desc: "Everything you need to know to get started",
        },
      ],
    },
  ],
};

export default function Header() {
  const [openMenu, setOpenMenu] = useState<keyof MenuItems | null>(null);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur h-20 flex items-center">
      <div className="container mx-auto flex  items-center justify-between ">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-green-500 ">
          CodeSprintAI
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-gray-300 ">
          {Object.keys(menuItems).map((menu) => (
            <div
              key={menu}
              className="relative"
              onMouseEnter={() => setOpenMenu(menu as keyof MenuItems)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button className="hover:text-gray-300 transition-all">
                {menu}
              </button>

              <AnimatePresence>
                {openMenu === menu && (
                  <motion.div
                    variants={dropdownAnimation}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-full left-0 mt-2 w-[600px] bg-black/80 text-white shadow-lg rounded-lg p-6 grid grid-cols-2 gap-6 z-50"
                  >
                    {menuItems[menu as keyof MenuItems].map(
                      (col: MenuColumn, colIdx: number) => (
                        <div key={colIdx}>
                          <h4 className="text-sm font-semibold text-gray-400 mb-3">
                            {col.heading}
                          </h4>
                          <ul className="space-y-2">
                            {col.links.map((link: LinkItem, i: number) => (
                              <li key={i}>
                                <a
                                  href="#"
                                  className="group flex items-center justify-between px-2 py-2 rounded-md hover:bg-green-700 transition"
                                >
                                  <div>
                                    <p className="text-sm font-medium">
                                      {link.title}
                                    </p>
                                    {link.desc && (
                                      <p className="text-xs text-gray-400 group-hover:text-gray-400">
                                        {link.desc}
                                      </p>
                                    )}
                                  </div>
                                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Normal Links */}
          <Link href="/pricing" className="hover:text-gray-300">
            Pricing
          </Link>
          <Link href="/developers" className="hover:text-gray-300">
            For Developers
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3 ">
          <Button
            // variant="ghost"
            className="text-white hover:text-black  bg-green-500 hover:bg-white transition-all"
          >
            Log In
          </Button>
          <Button className="text-green-500   hover:text-black hover:bg-green-600 transition-all">
            Request Demo
          </Button>
          <Button className="text-green-500  hover:text-black hover:bg-green-600 transition-all">
            Create a free account
          </Button>
        </div>
      </div>
    </header>
  );
}
