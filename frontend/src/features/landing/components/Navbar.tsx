"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Terminal, X } from "lucide-react";
import { ThemeToggle } from "@/features/shared/components/ThemeToggle";
import { navigation } from "@/features/marketing/config";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useMounted } from "@/features/shared/hooks/useMounted";
export default function Navbar() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const pathname = usePathname();
  const storedToken = useAuthStore((state) => state.token);
  const mounted = useMounted();
  const signedIn = mounted && Boolean(storedToken);
  const close = () => {
    setOpen(null);
    setMobile(false);
  };
  const triggerId = (label: string) =>
    `nav-trigger-${label.replaceAll(" ", "-")}`;
  return (
    <nav
      className="m-nav"
      aria-label="Main navigation"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          document
            .getElementById(open ? triggerId(open) : "mobile-nav-trigger")
            ?.focus();
          close();
        }
      }}
    >
      <a
        className="sr-only focus:not-sr-only focus:block focus:p-3"
        href="#main-content"
      >
        Skip to content
      </a>
      <div className="m-container m-nav-inner">
        <Link
          href="/"
          className="m-brand"
          aria-label="CodeSprint home"
          onClick={close}
        >
          <span className="m-brand-mark">
            <Terminal size={17} strokeWidth={1.8} />
          </span>
          CodeSprint<span className="m-beta">BETA</span>
        </Link>
        <div className="m-nav-links">
          {navigation.map((group) => (
            <div
              key={group.label}
              className="m-nav-group"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget))
                  setOpen(null);
              }}
            >
              <button
                type="button"
                id={triggerId(group.label)}
                className="m-nav-link"
                aria-expanded={open === group.label}
                aria-controls={`menu-${triggerId(group.label)}`}
                onClick={() =>
                  setOpen(open === group.label ? null : group.label)
                }
              >
                {group.label}
                <ChevronDown size={12} />
              </button>
              {open === group.label && (
                <div
                  id={`menu-${triggerId(group.label)}`}
                  className="m-dropdown"
                >
                  {group.links.map((link) => (
                    <Link key={link.href} href={link.href} onClick={close}>
                      <strong>{link.label}</strong>
                      <small>{link.description}</small>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            href="/pricing"
            className="m-nav-link"
            aria-current={pathname === "/pricing" ? "page" : undefined}
            onClick={close}
          >
            Pricing
          </Link>
        </div>
        <div className="m-nav-actions">
          <ThemeToggle />
          <Link
            href={signedIn ? "/dashboard" : "/auth/login"}
            className="m-nav-link m-nav-login"
          >
            {signedIn ? "Dashboard" : "Log in"}
          </Link>
          <Link
            href={signedIn ? "/problems" : "/auth/signup"}
            className="m-button m-nav-start"
          >
            {signedIn ? "Start practice" : "Start free"}
          </Link>
          <button
            type="button"
            id="mobile-nav-trigger"
            className="m-mobile-toggle"
            aria-label={mobile ? "Close navigation" : "Open navigation"}
            aria-expanded={mobile}
            aria-controls="mobile-navigation"
            onClick={() => setMobile(!mobile)}
          >
            {mobile ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>
      {mobile && (
        <div id="mobile-navigation" className="m-mobile-menu">
          {navigation.map((group) => (
            <section key={group.label}>
              <h2>{group.label}</h2>
              {group.links.map((link) => (
                <Link key={link.href} href={link.href} onClick={close}>
                  {link.label}
                </Link>
              ))}
            </section>
          ))}
          <Link href="/pricing" onClick={close}>
            Pricing
          </Link>
          <div className="m-mobile-actions">
            <Link
              href={signedIn ? "/dashboard" : "/auth/login"}
              onClick={close}
            >
              {signedIn ? "Dashboard" : "Log in"}
            </Link>
            <Link
              href={signedIn ? "/problems" : "/auth/signup"}
              onClick={close}
            >
              {signedIn ? "Start practice" : "Create free account"}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
