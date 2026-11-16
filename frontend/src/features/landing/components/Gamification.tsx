import Link from "next/link";
import { Award, Flame, Timer, ArrowRight } from "lucide-react";
export default function Gamification() {
  return (
    <section id="gamification" className="relative overflow-hidden px-6 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
            Progress you can come back to
          </p>
          <h2 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
            Build a habit.
            <br />
            <span className="text-emerald-500">Build your understanding.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Keep track of your practice, celebrate earned milestones, and
            challenge yourself in a timed sprint. Your own progress comes first.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/badges"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-black"
            >
              Explore badges
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/sprints"
              className="rounded-xl border border-zinc-300 px-6 py-3 font-medium dark:border-white/20"
            >
              Try coding sprints
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          {[
            {
              icon: Flame,
              title: "Keep your streak going",
              text: "Your profile helps you see consistency across practice sessions.",
            },
            {
              icon: Award,
              title: "Earn your achievements",
              text: "Find earned badges and mastery milestones connected to your account.",
            },
            {
              icon: Timer,
              title: "Focus with a timed sprint",
              text: "Work through problems against the clock, then review the result.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-white/10 dark:bg-white/[0.025]"
            >
              <span className="rounded-xl bg-emerald-500/10 p-3 text-emerald-500">
                <item.icon size={25} />
              </span>
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
          <p className="px-2 text-xs text-zinc-500">
            Public rankings are in development. Free Beta does not display
            simulated standings as real results.
          </p>
        </div>
      </div>
    </section>
  );
}
