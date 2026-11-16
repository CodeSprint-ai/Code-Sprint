import type { Metadata } from "next";
import Link from "next/link";
import { product } from "@/features/marketing/config";
import {
  PageIntro,
  cardClass,
  primaryClass,
} from "@/features/marketing/PublicShell";
export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the team building CodeSprint and our approach to algorithmic learning.",
  alternates: { canonical: "/about" },
};
export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="The people behind the practice"
        title="Built to help you understand."
      >
        CodeSprint brings algorithm practice, progressive AI hints, and
        submission feedback into one workspace for computer science students and
        aspiring competitive programmers.
      </PageIntro>
      <div className="mx-auto max-w-6xl space-y-12 px-6">
        <section className={`${cardClass} grid gap-8 md:grid-cols-2`}>
          <div>
            <h2 className="text-2xl font-semibold">Our purpose</h2>
            <p className="mt-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
              Getting stuck should be part of learning, not the end of a
              practice session. We are building tools that help students
              understand mistakes, test their reasoning, and find the next step
              themselves.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Our first chapter</h2>
            <p className="mt-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
              CodeSprint began as a computer science final-year project at Sir
              Syed University of Engineering & Technology. We are developing it
              into a student-focused product, starting with a Free Beta and
              learning from real practice sessions.
            </p>
          </div>
        </section>
        <section>
          <h2 className="mb-6 text-3xl font-semibold">Meet the team</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {product.team.map((person) => (
              <article key={person.name} className={cardClass}>
                <span
                  aria-hidden="true"
                  className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-xl font-bold text-emerald-600"
                >
                  {person.initials}
                </span>
                <h3 className="mt-5 text-xl font-semibold">{person.name}</h3>
                <p className="mt-2 text-sm text-zinc-500">{person.role}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="text-center">
          <h2 className="text-2xl font-semibold">
            Help shape what comes next.
          </h2>
          <p className="my-4 text-zinc-500">
            Student feedback and campus conversations guide the next iteration.
          </p>
          <Link className={primaryClass} href="/contact">
            Talk to the team
          </Link>
        </section>
      </div>
    </>
  );
}
