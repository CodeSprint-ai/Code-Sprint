"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { product } from "./config";
import { InterestForm } from "./InterestForm";
export function PricingView({
  initialPlan,
}: {
  initialPlan: "monthly" | "annual";
}) {
  const [plan, setPlan] = useState(initialPlan);
  const annual = plan === "annual";
  return (
    <div className="m-container">
      <div className="m-pricing-top">
        <p className="m-muted text-sm">
          Start with Free Beta. Pro is on the way.
        </p>
        <div
          className="m-billing-toggle"
          aria-label="Planned Pro billing period"
        >
          <button
            type="button"
            aria-pressed={!annual}
            onClick={() => setPlan("monthly")}
          >
            Monthly
          </button>
          <button
            type="button"
            aria-pressed={annual}
            onClick={() => setPlan("annual")}
          >
            Annual · save 33%
          </button>
        </div>
      </div>
      <div className="m-pricing-grid">
        <section className="m-plan">
          <div className="m-plan-top">
            <h2>Free Beta</h2>
            <span className="m-plan-status">Available now</span>
          </div>
          <p className="m-price">
            $0<span>USD</span>
          </p>
          <p className="m-plan-caption">
            A useful place to start. No payment card required.
          </p>
          <ul>
            {[
              "Coding workspace and problem practice",
              `${product.limits.free.hints} progressive hint unlocks per month`,
              `${product.limits.free.analyses} detailed analyses per month`,
              "Progress, streaks, and a learning roadmap",
              "Contest calendar and earned badges",
            ].map((item) => (
              <li key={item}>
                <Check size={15} />
                {item}
              </li>
            ))}
          </ul>
          <Link href="/auth/signup" className="m-button">
            Start practicing free
            <ArrowRight size={14} />
          </Link>
        </section>
        <section className="m-plan m-plan-pro">
          <div className="m-plan-top">
            <h2>Pro</h2>
            <span className="m-plan-status">Planned · waitlist only</span>
          </div>
          <p key={plan} className="m-price m-price-transition">
            ${annual ? product.pricing.yearly : product.pricing.monthly}
            <span>USD / {annual ? "year" : "month"}</span>
          </p>
          <p className="m-plan-caption">
            {annual
              ? "$40 billed yearly. Equivalent to $3.33 per month."
              : "$5 billed monthly when Pro becomes available."}
          </p>
          <ul>
            {[
              "Everything in Free Beta",
              `${product.limits.pro.hints} hints per month · pilot allowance`,
              `${product.limits.pro.analyses} analyses per month · pilot allowance`,
              "Expanded learning insights as released",
              "No automatic overage charges",
            ].map((item) => (
              <li key={item}>
                <Check size={15} />
                {item}
              </li>
            ))}
          </ul>
          <a href="#pro-waitlist" className="m-button m-button-secondary">
            Join Pro waitlist
            <ArrowRight size={14} />
          </a>
        </section>
      </div>
      <p className="m-pricing-note">
        Free allowances reset on the first day of each month at 00:00 UTC.
        Pending analyses reserve capacity; failed requests do not consume it.
        Reading previously revealed hints and cached analyses is free.
      </p>
      <section id="pro-waitlist" className="m-waitlist">
        <div className="m-waitlist-copy">
          <p className="m-kicker">Pro waitlist</p>
          <h2>Hear when Pro is ready.</h2>
          <p>
            We are using Free Beta to understand how people practice and measure
            the cost of AI guidance. Planned pricing and allowances may change
            before paid launch.
          </p>
          <p>
            No payment details are collected. Joining the waitlist does not
            start a subscription.
          </p>
          <div className="m-institution">
            <h3>For universities and bootcamps</h3>
            <p>
              Institutional pilots are scoped to your seats, usage, and learning
              goals. Talk to us about what you need.
            </p>
            <Link href="/contact" className="m-text-link">
              Discuss a campus pilot
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <div className="m-panel">
          <InterestForm kind="waitlist" initialPlan={plan} />
        </div>
      </section>
      <p className="m-billing-note">
        Before paid launch, we will publish final purchase and renewal terms,
        cancellation controls, and refund details. Read the{" "}
        <Link href="/legal/billing">planned billing and refund terms</Link>.
      </p>
    </div>
  );
}
