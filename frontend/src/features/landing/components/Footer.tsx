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
    <footer className="m-footer">
      <div className="m-container">
        <div className="m-footer-grid">
          <div>
            <Link href="/" className="m-brand">
              <span className="m-brand-mark">
                <Terminal size={17} />
              </span>
              CodeSprint
            </Link>
            <p className="m-footer-description">
              A focused place to practice algorithms and build your own
              understanding.
            </p>
            <div className="m-socials">
              {product.socials.map((social) => {
                const Icon = icons[social.label];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`CodeSprint on ${social.label} (opens in a new tab)`}
                  >
                    <Icon size={16} strokeWidth={1.6} />
                  </a>
                );
              })}
            </div>
            <a href={`mailto:${product.email}`} className="m-footer-email">
              {product.email}
            </a>
          </div>
          {groups.map((group) => (
            <div key={group.label}>
              <h2>{group.label}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="m-footer-bottom">
          <p>© {new Date().getFullYear()} CodeSprint. All rights reserved.</p>
          <div className="m-footer-legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/cookies">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
