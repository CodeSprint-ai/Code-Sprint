import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Map,
  CalendarDays,
} from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { WorkspacePreview } from "@/features/marketing/WorkspacePreview";
import { GuidancePreview } from "@/features/marketing/GuidancePreview";
import { ProblemListPreview } from "@/features/marketing/ProblemListPreview";
import "@/features/marketing/marketing.css";

export default function LandingPage() {
  return (
    <div className="marketing-site">
      <Navbar />
      <main id="main-content" className="m-main">
        <section className="m-hero">
          <div className="m-container m-hero-grid">
            <div className="m-hero-copy">
              <p className="m-kicker">Algorithm practice, with guidance</p>
              <h1>
                <span>Solve problems.</span>
                <span>Build understanding.</span>
              </h1>
              <p>
                A focused workspace for writing code, testing your approach, and
                learning from each attempt. Get a hint when you need one. Keep
                the thinking yours.
              </p>
              <div className="m-hero-actions">
                <Link href="/auth/signup" className="m-button">
                  Start practicing
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href="/platform/coding-workspace"
                  className="m-button m-button-secondary"
                >
                  Explore the workspace
                </Link>
              </div>
              <div className="m-hero-note">
                <span>
                  <i className="m-status-dot" />
                  Free Beta
                </span>
                <span>No credit card required</span>
              </div>
            </div>
            <WorkspacePreview />
          </div>
        </section>
        <div className="m-container">
          <section className="m-section">
            <div className="m-section-heading">
              <div>
                <p className="m-kicker">How it works</p>
                <h2>A focused practice workflow.</h2>
              </div>
              <p>
                Everything you need for a useful practice session, from the
                first attempt to the next improvement.
              </p>
            </div>
            <div className="m-workflow">
              {[
                {
                  title: "Choose a problem",
                  text: "Browse by topic and difficulty. Read the statement and work through the examples.",
                },
                {
                  title: "Write and evaluate",
                  text: "Develop your approach in Python, Java, or C++. Submit your code and review the verdict.",
                },
                {
                  title: "Understand the next step",
                  text: "Use progressive hints and submission analysis to work out what to change and why.",
                },
              ].map((item, index) => (
                <article key={item.title}>
                  <span className="m-step-number">0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="m-section m-guidance-grid">
            <div className="m-guidance-copy">
              <p className="m-kicker">The AI tutor</p>
              <h2>
                Enough guidance to
                <br />
                move forward.
              </h2>
              <p>
                A complete answer can end a problem without teaching much.
                CodeSprint breaks guidance into steps, so you can stay involved
                in the reasoning.
              </p>
              <p>
                Start with a conceptual nudge. Reveal more only when you need
                it. After submitting, review your approach and its complexity.
              </p>
              <Link href="/platform/ai-tutor" className="m-text-link">
                See how the tutor works
                <ArrowUpRight size={15} />
              </Link>
            </div>
            <GuidancePreview />
          </section>
          <ProblemListPreview />
          <section className="m-section">
            <div className="m-section-heading">
              <div>
                <p className="m-kicker">Beyond a single problem</p>
                <h2>Give your practice some direction.</h2>
              </div>
            </div>
            <div className="m-resources">
              {[
                {
                  icon: Map,
                  title: "Learning roadmap",
                  text: "Use your practice history to see where you are improving and what to work on next.",
                  href: "/platform/learning-roadmap",
                  link: "Explore the roadmap",
                },
                {
                  icon: Code2,
                  title: "Coding sprints",
                  text: "Put your skills into a focused, timed session. Review your results when the sprint ends.",
                  href: "/sprints",
                  link: "Explore coding sprints",
                },
                {
                  icon: CalendarDays,
                  title: "Contest calendar",
                  text: "Find upcoming programming contests across platforms and add them to your calendar.",
                  href: "/calendar",
                  link: "View upcoming contests",
                },
              ].map((item) => (
                <Link href={item.href} key={item.title} className="m-resource">
                  <item.icon size={20} strokeWidth={1.5} className="m-muted" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <span className="m-text-link">
                    {item.link}
                    <ArrowUpRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
          <section className="m-section">
            <div className="m-start-strip">
              <div>
                <h2>Make your next attempt count.</h2>
                <p>
                  Start with Free Beta: 20 hint unlocks and 3 detailed analyses
                  each month.
                </p>
              </div>
              <div className="m-hero-actions" style={{ marginTop: 0 }}>
                <Link href="/auth/signup" className="m-button">
                  Create a free account
                  <ArrowRight size={15} />
                </Link>
                <Link href="/pricing" className="m-text-link">
                  View plans
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
