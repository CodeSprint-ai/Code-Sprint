"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Terminal, X } from "lucide-react";
import { ThemeToggle } from "@/features/shared/components/ThemeToggle";
import { navigation } from "@/features/marketing/config";
import { useMounted } from "@/features/shared/hooks/useMounted";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function Navbar() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const pathname = usePathname();
  const storedToken = useAuthStore((state) => state.token);
  const mounted = useMounted();
  const token = mounted && storedToken;
  const close = () => {
    setOpen(null);
    setMobile(false);
  };
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200/70 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]/95"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          const trigger = document.getElementById(
            open
              ? `nav-trigger-${open.replaceAll(" ", "-")}`
              : "mobile-nav-trigger",
          );
          close();
          trigger?.focus();
        }
      }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:block focus:bg-emerald-500 focus:p-3 focus:text-black"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          onClick={close}
          aria-label="CodeSprint home"
          className="flex items-center gap-2 text-lg font-bold"
        >
          <span className="rounded-lg bg-emerald-500 p-2 text-black">
            <Terminal size={20} />
          </span>
          CodeSprint
          <span className="hidden rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-wide text-emerald-700 sm:inline dark:text-emerald-400">
            Free Beta
          </span>
        </Link>
        <div className="hidden items-center gap-5 md:flex">
          {navigation.map((group) => (
            <div
              key={group.label}
              className="relative"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget))
                  setOpen(null);
              }}
            >
              <button
                id={`nav-trigger-${group.label.replaceAll(" ", "-")}`}
                type="button"
                aria-expanded={open === group.label}
                aria-controls={`nav-${group.label.replaceAll(" ", "-")}`}
                onClick={() =>
                  setOpen(open === group.label ? null : group.label)
                }
                className="flex items-center gap-1 py-3 text-sm font-medium text-zinc-600 hover:text-emerald-600 dark:text-zinc-300"
              >
                {group.label}
                <ChevronDown size={14} />
              </button>
              {open === group.label && (
                <div
                  id={`nav-${group.label.replaceAll(" ", "-")}`}
                  className="absolute left-1/2 top-full w-80 -translate-x-1/2 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-zinc-950"
                >
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={close}
                      className="block rounded-xl p-3 hover:bg-emerald-500/10"
                    >
                      <span className="block text-sm font-semibold">
                        {link.label}
                      </span>
                      <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
                        {link.description}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            href="/pricing"
            onClick={close}
            aria-current={pathname === "/pricing" ? "page" : undefined}
            className="text-sm font-medium hover:text-emerald-600"
          >
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href={token ? "/dashboard" : "/auth/login"}
            className="hidden text-sm font-medium sm:inline"
          >
            {token ? "Dashboard" : "Log in"}
          </Link>
          <Link
            href={token ? "/problems" : "/auth/signup"}
            className="hidden rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black sm:inline"
          >
            {token ? "Start practice" : "Start free"}
          </Link>
          <button
            id="mobile-nav-trigger"
            type="button"
            aria-label={mobile ? "Close navigation" : "Open navigation"}
            aria-expanded={mobile}
            aria-controls="mobile-navigation"
            className="rounded-lg p-2 md:hidden"
            onClick={() => setMobile(!mobile)}
          >
            {mobile ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {mobile && (
        <div
          id="mobile-navigation"
          className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-zinc-200 p-6 md:hidden dark:border-white/10"
        >
          {navigation.map((group) => (
            <div key={group.label} className="mb-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {group.label}
              </p>
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="block rounded-lg px-3 py-3 hover:bg-emerald-500/10"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="flex flex-wrap gap-5">
            <Link href="/pricing" onClick={close}>
              Pricing
            </Link>
            <Link href={token ? "/dashboard" : "/auth/login"} onClick={close}>
              {token ? "Dashboard" : "Log in"}
            </Link>
            <Link href={token ? "/problems" : "/auth/signup"} onClick={close}>
              {token ? "Start practice" : "Create free account"}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
