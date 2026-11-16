"use client";

import Link from "next/link";
import { Github, Instagram, Terminal, Youtube } from "lucide-react";
import { navigation, product } from "@/features/marketing/config";

export default function Footer() {
  const icons = { YouTube: Youtube, Instagram, GitHub: Github };
  const groups = [
    ...navigation,
    {
      label: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Pricing", href: "/pricing" },
        { label: "Legal", href: "/legal" },
      ],
    },
  ];
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 px-6 py-14 dark:border-white/10 dark:bg-white/[0.015]">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold"
            >
              <Terminal className="text-emerald-500" />
              CodeSprint
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Learn algorithms with guidance that builds understanding.
              Practice, reflect, and find your next step.
            </p>
            <div className="mt-5 flex gap-3">
              {product.socials.map((social) => {
                const Icon = icons[social.label];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`CodeSprint on ${social.label} (opens in a new tab)`}
                    className="rounded-full border border-zinc-200 p-2.5 hover:border-emerald-500 dark:border-white/10"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
            <a
              className="mt-4 block text-sm text-emerald-700 dark:text-emerald-400"
              href={`mailto:${product.email}`}
            >
              {product.email}
            </a>
          </div>
          {groups.map((group) => (
            <div key={group.label}>
              <h2 className="text-sm font-bold">{group.label}</h2>
              <ul className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-emerald-600">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col justify-between gap-5 border-t border-zinc-200 pt-6 text-sm text-zinc-500 sm:flex-row dark:border-white/10">
          <p>© {new Date().getFullYear()} CodeSprint. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/cookies">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
