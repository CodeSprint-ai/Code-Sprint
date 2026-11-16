import type { Metadata } from "next";
import { PageIntro } from "@/features/marketing/PublicShell";
import { PricingView } from "@/features/marketing/PricingView";
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
  const initialPlan = plan === "monthly" ? "monthly" : "annual";
  return (
    <>
      <PageIntro
        eyebrow="Plans & availability"
        title="Room to practice. A clear path forward."
      >
        Free Beta gives you a working coding environment and AI guidance to get
        started. Pro will offer higher allowances when paid access is ready.
      </PageIntro>
      <PricingView key={initialPlan} initialPlan={initialPlan} />
    </>
  );
}
