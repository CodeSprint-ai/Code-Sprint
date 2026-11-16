import { PublicProblemCatalog } from "@/features/marketing/PublicProblemCatalog";
import LiveDemo from "@/features/landing/components/LiveDemo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { features, loginDestination } from "@/features/marketing/config";
import {
  PageIntro,
  cardClass,
  primaryClass,
  secondaryClass,
} from "@/features/marketing/PublicShell";

export function generateStaticParams() {
  return Object.keys(features).map((feature) => ({ feature }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ feature: string }>;
}): Promise<Metadata> {
  const { feature } = await params;
  const entry = features[feature as keyof typeof features];
  return {
    title: entry?.title ?? "Platform",
    description: entry?.description,
    alternates: { canonical: `/platform/${feature}` },
  };
}
export default async function FeaturePage({
  params,
}: {
  params: Promise<{ feature: string }>;
}) {
  const { feature } = await params;
  const entry = features[feature as keyof typeof features];
  if (!entry) notFound();
  return (
    <>
      <PageIntro eyebrow={entry.eyebrow} title={entry.title}>
        {entry.description}
      </PageIntro>
      <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-2">
        <section className={cardClass}>
          <h2 className="text-2xl font-semibold">{entry.accent}</h2>
          <ol className="mt-7 space-y-6">
            {entry.steps.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 font-semibold text-emerald-600">
                  {index + 1}
                </span>
                <p className="pt-1 leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {step}
                </p>
              </li>
            ))}
          </ol>
          <Link
            href={loginDestination(entry.destination)}
            className={`${primaryClass} mt-8`}
          >
            {entry.action}
            <ArrowRight size={17} />
          </Link>
          <p className="mt-3 text-sm text-zinc-500">
            A free account saves your progress. After login, you return to this
            feature.
          </p>
        </section>
        <section className={`${cardClass} bg-emerald-500/[0.03]`}>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
            A look inside
          </p>
          {feature === "ai-tutor" ? (
            <>
              <h2 className="mt-4 text-xl font-semibold">
                Example: finding a pair with a target sum
              </h2>
              <div className="mt-6 space-y-4">
                <p className="rounded-xl bg-zinc-100 p-4 text-sm dark:bg-white/5">
                  <strong>First nudge:</strong> What information would you need
                  to remember as you visit each number?
                </p>
                <p className="rounded-xl border border-emerald-500/25 p-4 text-sm">
                  <strong>Next direction:</strong> Think about checking whether
                  the complement has already appeared.
                </p>
                <p className="text-sm text-zinc-500">
                  Illustrative guidance. Actual hints depend on the problem.
                  Free Beta includes 20 hint unlocks and 3 analyses each
                  calendar month.
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="mt-4 text-xl font-semibold">
                Built around your next practice session
              </h2>
              <ul className="mt-7 space-y-4">
                {[
                  "Focused algorithm practice",
                  "Progress saved to your account",
                  "Feedback to help you reflect",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-zinc-600 dark:text-zinc-400"
                  >
                    <CheckCircle2
                      className="shrink-0 text-emerald-500"
                      size={20}
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-7 text-sm text-zinc-500">
                Your personal workspace and learning data are available after
                login.
              </p>
            </>
          )}
          <Link href="/pricing" className={`${secondaryClass} mt-8`}>
            Explore Free Beta
          </Link>
        </section>
      </div>
      {feature === "problem-bank" && <PublicProblemCatalog />}
      {feature === "coding-workspace" && (
        <section className="mt-14">
          <p className="mx-auto max-w-3xl px-6 text-center text-sm text-zinc-500">
            Interactive browser demo: JavaScript examples run locally. Full
            Python, Java, and C++ problem evaluation is available in your
            signed-in workspace.
          </p>
          <LiveDemo />
        </section>
      )}
    </>
  );
}
