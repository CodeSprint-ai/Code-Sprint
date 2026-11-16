import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { InterestForm } from "@/features/marketing/InterestForm";
import { product } from "@/features/marketing/config";
import {
  PageIntro,
  cardClass,
  primaryClass,
  secondaryClass,
} from "@/features/marketing/PublicShell";
export const metadata: Metadata = {
  title: "Pricing — Free Beta & Pro Waitlist",
  description:
    "Start with CodeSprint Free Beta. Explore planned Pro pricing of $5/month or $40/year and join the waitlist without payment.",
  alternates: { canonical: "/pricing" },
};
export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  const selectedPlan = plan === "monthly" ? "monthly" : "annual";
  const plans = [
    {
      title: "Free Beta",
      price: "$0",
      cadence: "No payment card required",
      tag: "Available now",
      items: [
        "Coding workspace and problem practice",
        "Progress, streaks, and basic roadmap",
        `${product.limits.free.hints} progressive hint unlocks per month`,
        `${product.limits.free.analyses} detailed analyses per month`,
        "Contest Calendar and earned badges",
      ],
    },
    {
      title: "Pro Monthly",
      price: `$${product.pricing.monthly}`,
      cadence: "per month · planned pricing",
      tag: "Coming after beta",
      items: [
        "Everything in Free",
        `${product.limits.pro.hints} hints per month · pilot allowance`,
        `${product.limits.pro.analyses} analyses per month · pilot allowance`,
        "Expanded learning insights as released",
        "Cancel future renewal at any time",
      ],
    },
    {
      title: "Pro Annual",
      price: `$${product.pricing.yearly}`,
      cadence: "billed yearly · planned pricing",
      tag: "Save approximately 33%",
      items: [
        "The same planned Pro allowances",
        "Equivalent to $3.33 per month",
        "One $40 payment for a year of access",
        "Renewal reminder before annual billing",
        "No automatic overage charges",
      ],
    },
  ];
  return (
    <>
      <PageIntro
        eyebrow="Start learning. Help shape the beta."
        title="Free to begin. Clear about what comes next."
      >
        Free Beta is available now. Pro is a planned subscription, not a product
        you can buy yet. Join the waitlist without entering payment details.
      </PageIntro>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <section
              key={plan.title}
              className={`${cardClass} flex flex-col ${index === 2 ? "ring-2 ring-emerald-500" : ""}`}
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                {plan.tag}
              </span>
              <h2 className="mt-4 text-2xl font-semibold">{plan.title}</h2>
              <p className="mt-6 text-5xl font-bold">
                {plan.price}
                <span className="ml-2 text-sm font-normal text-zinc-500">
                  USD
                </span>
              </p>
              <p className="mt-2 text-sm text-zinc-500">{plan.cadence}</p>
              <ul className="my-8 flex-1 space-y-4">
                {plan.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed">
                    <Check size={18} className="shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={
                  index === 0
                    ? "/auth/signup"
                    : `/pricing?plan=${index === 1 ? "monthly" : "annual"}#pro-waitlist`
                }
                className={index === 0 ? primaryClass : secondaryClass}
              >
                {index === 0 ? "Start practicing free" : "Join Pro waitlist"}
                <ArrowRight size={16} />
              </Link>
            </section>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-zinc-500">
          Free allowances reset on the first day of each calendar month at 00:00
          UTC. Pending analysis jobs reserve allowance; failed requests do not
          consume it. Rereading revealed hints and cached analyses is free.
        </p>
        <section
          id="pro-waitlist"
          className="mt-16 grid scroll-mt-28 gap-8 lg:grid-cols-2"
        >
          <div>
            <h2 className="text-3xl font-semibold">
              Be first to hear about Pro.
            </h2>
            <p className="mt-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
              We are using the beta to measure real AI and execution costs.
              Planned Pro allowances and pricing may change before paid launch;
              final terms will be shown before purchase.
            </p>
            <p className="mt-4 text-sm text-zinc-500">
              No checkout, automatic billing, or payment collection is enabled.
            </p>
            <div className={`${cardClass} mt-8`}>
              <h3 className="text-xl font-semibold">
                Learning together on campus?
              </h3>
              <p className="my-3 text-zinc-500">
                University and bootcamp pilots are scoped to your seats, usage,
                and learning goals. Institutional pricing is quoted
                individually.
              </p>
              <Link href="/contact" className="font-semibold text-emerald-600">
                Discuss a university pilot →
              </Link>
            </div>
          </div>
          <div className={cardClass}>
            <InterestForm kind="waitlist" initialPlan={selectedPlan} />
          </div>
        </section>
        <section className={`${cardClass} mt-14`}>
          <h2 className="text-2xl font-semibold">Before paid launch</h2>
          <p className="mt-4 leading-relaxed text-zinc-500">
            Our planned billing terms include cancellation of future renewals,
            access through the paid period, and a 7-day refund window on a first
            paid purchase. They are not active during Free Beta.
          </p>
          <Link
            href="/legal/billing"
            className="mt-4 inline-block font-medium text-emerald-600"
          >
            Read planned billing and refund terms →
          </Link>
        </section>
      </div>
    </>
  );
}
