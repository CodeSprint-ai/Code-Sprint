import type { Metadata } from "next";
import Link from "next/link";
import { Award } from "lucide-react";
import {
  PageIntro,
  cardClass,
  primaryClass,
} from "@/features/marketing/PublicShell";
import { loginDestination } from "@/features/marketing/config";
export const metadata: Metadata = {
  title: "Badges",
  description:
    "Learn how CodeSprint achievements reflect your practice and topic mastery.",
  alternates: { canonical: "/badges" },
};
export default function BadgesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Make progress visible"
        title="Celebrate the skills you build."
      >
        Your achievements reflect practice, consistency, and learning. Earned
        badges belong to your profile; they are not something you buy.
      </PageIntro>
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            {
              title: "Problem-solving milestones",
              text: "Build up your accepted solutions and track your progress.",
            },
            {
              title: "Consistent practice",
              text: "Develop a practice habit and follow your streak in your profile.",
            },
            {
              title: "Topic mastery",
              text: "Use the roadmap to understand how your strength in a topic develops.",
            },
          ].map((item) => (
            <section key={item.title} className={cardClass}>
              <Award className="text-emerald-500" size={32} />
              <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                {item.text}
              </p>
            </section>
          ))}
        </div>
        <section className={`${cardClass} mt-8 text-center`}>
          <h2 className="text-2xl font-semibold">
            Your actual badge collection
          </h2>
          <p className="my-4 text-zinc-500">
            Sign in to see the badges available to your account, their
            descriptions, and what you have unlocked.
          </p>
          <Link className={primaryClass} href={loginDestination("/profile")}>
            View my badges
          </Link>
        </section>
      </div>
    </>
  );
}
