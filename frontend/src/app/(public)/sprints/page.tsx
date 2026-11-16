import type { Metadata } from "next";
import Link from "next/link";
import {
  PageIntro,
  cardClass,
  primaryClass,
} from "@/features/marketing/PublicShell";
import { loginDestination } from "@/features/marketing/config";
export const metadata: Metadata = {
  title: "Coding Sprints",
  alternates: { canonical: "/sprints" },
};
export default function SprintsPage() {
  return (
    <>
      <PageIntro
        eyebrow="A focused challenge"
        title="Practice against the clock."
      >
        Bring your reasoning into a timed coding session. Work through the
        sprint, submit your solutions, and reflect on the result.
      </PageIntro>
      <section className={`${cardClass} mx-auto max-w-2xl text-center`}>
        <h2 className="text-2xl font-semibold">Start your next sprint</h2>
        <p className="my-5 text-zinc-500">
          A free account keeps your session and results connected to your
          progress.
        </p>
        <Link className={primaryClass} href={loginDestination("/sprint")}>
          Open coding sprints
        </Link>
      </section>
    </>
  );
}
