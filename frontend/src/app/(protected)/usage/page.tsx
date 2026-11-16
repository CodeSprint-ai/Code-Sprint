import Link from "next/link";
import { UsageCard } from "@/features/marketing/UsageCard";
export default function UsagePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-7 p-6 md:p-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
          Free Beta
        </p>
        <h1 className="mt-3 text-3xl font-bold">Your AI allowance</h1>
        <p className="mt-3 text-zinc-500">
          Practice remains available when your monthly AI allowance is used up.
          No automatic extra charges apply.
        </p>
      </div>
      <UsageCard />
      <section className="rounded-2xl border border-zinc-200 p-6 dark:border-white/10">
        <h2 className="text-xl font-semibold">What counts?</h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-500">
          <li>
            A newly revealed hint counts once. Reading the hints you already
            unlocked does not count again.
          </li>
          <li>
            A completed detailed analysis counts once. A pending job reserves
            capacity, retries reuse its reservation, and permanent failure
            releases it.
          </li>
          <li>
            Cached reports are free to reread. Calendar months reset at 00:00
            UTC on the first day.
          </li>
          <li>
            Code evaluation has separate operational rate limits and does not
            use this AI allowance.
          </li>
        </ul>
      </section>
      <Link
        className="inline-block font-semibold text-emerald-600"
        href="/pricing#pro-waitlist"
      >
        Explore planned Pro access →
      </Link>
    </div>
  );
}
