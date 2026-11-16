import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { product } from "@/features/marketing/config";
import { PageIntro } from "@/features/marketing/PublicShell";
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
        eyebrow="About CodeSprint"
        title="Practice should lead to understanding."
      >
        We are building a place where computer science students can work through
        algorithmic problems, understand their mistakes, and develop their own
        reasoning.
      </PageIntro>
      <div className="m-container">
        <section className="m-about-story">
          <div>
            <h2>Why we are building it</h2>
            <p>
              Getting stuck is part of learning. A verdict tells you whether
              your code worked, but it does not always tell you what to try
              next. A complete solution can skip the part that matters most.
            </p>
            <p>
              CodeSprint brings practice, progressive guidance, and submission
              feedback into one workspace. Our aim is to make the next step
              easier to see without taking the thinking away.
            </p>
          </div>
          <div>
            <h2>Our starting point</h2>
            <p>
              CodeSprint began as a computer science final-year project at Sir
              Syed University of Engineering & Technology. We are developing it
              into a student-focused product, starting with Free Beta.
            </p>
            <p>
              We are learning from real practice sessions and conversations with
              students. The product will keep improving through that feedback.
            </p>
          </div>
        </section>
        <section>
          <h2 className="m-section-label">The team</h2>
          <div className="m-roster">
            {product.team.map((person) => (
              <article className="m-person" key={person.name}>
                <span className="m-person-initials" aria-hidden="true">
                  {person.initials}
                </span>
                <div>
                  <h3>{person.name}</h3>
                  <p>{person.role}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="m-section">
          <div className="m-start-strip">
            <div>
              <h2>Help shape the next iteration.</h2>
              <p>
                Tell us what is useful, what is missing, or where you got stuck.
              </p>
            </div>
            <Link href="/contact" className="m-button m-button-secondary">
              Talk to the team
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
