"use client";
import { ArrowRight } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import Link from "next/link";
interface DashboardHeroProps {
  motivation?: string;
}
export function DashboardHero({
  motivation = "A little focused practice goes a long way.",
}: DashboardHeroProps) {
  const { user } = useAuthStore();
  return (
    <section className="flex flex-col items-start justify-between gap-6 rounded-lg border border-border bg-card p-6 md:flex-row md:items-center md:p-8">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Your practice space
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Welcome back, {user?.name || "Coder"}
        </h1>
        <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
          {motivation}
        </p>
      </div>
      <Link
        href="/sprint"
        className="inline-flex shrink-0 items-center gap-3 rounded-md bg-emerald-800 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-900 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200"
      >
        Start a sprint <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
