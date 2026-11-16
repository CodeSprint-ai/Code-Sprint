import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, primaryClass } from "@/features/marketing/PublicShell";
export const metadata: Metadata = {
  title: "Leaderboard — In Development",
  robots: { index: false, follow: true },
};
export default function LeaderboardPage() {
  return (
    <>
      <PageIntro eyebrow="In development" title="Rankings worth earning.">
        A public leaderboard needs real results, transparent scoring, and fair
        comparisons. It is not available in Free Beta yet, and we do not display
        invented rankings.
      </PageIntro>
      <div className="text-center">
        <Link className={primaryClass} href="/sprints">
          Try a coding sprint
        </Link>
      </div>
    </>
  );
}
