import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, cardClass } from "@/features/marketing/PublicShell";
export const metadata: Metadata = {
  title: "Legal & Policies",
  alternates: { canonical: "/legal" },
};
export default function LegalPage() {
  return (
    <>
      <PageIntro
        eyebrow="Clear expectations"
        title="Policies for your practice."
      >
        CodeSprint is currently a free beta. No paid subscriptions or automatic
        billing are active.
      </PageIntro>
      <div className="mx-auto grid max-w-5xl gap-5 px-6 sm:grid-cols-2">
        {[
          {
            title: "Privacy Policy",
            href: "/privacy",
            text: "What information is processed and how to contact us about your data.",
          },
          {
            title: "Terms of Service",
            href: "/terms",
            text: "Account responsibilities, code ownership, acceptable use, and beta limitations.",
          },
          {
            title: "Cookie Settings",
            href: "/cookies",
            text: "Understand essential cookies and browser storage, and manage local preferences.",
          },
          {
            title: "Planned billing & refunds",
            href: "/legal/billing",
            text: "The proposed Pro purchase, renewal, cancellation, and refund terms. Not active during beta.",
          },
        ].map((page) => (
          <Link
            key={page.href}
            className={`${cardClass} transition hover:border-emerald-500`}
            href={page.href}
          >
            <h2 className="text-xl font-semibold">{page.title} →</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              {page.text}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
