"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import api from "@/features/shared/api/api";
import { useAuthStore } from "@/features/auth/store/authStore";
interface Allowance {
  limit: number;
  used: number;
  reserved: number;
  remaining: number;
}
interface Usage {
  plan: string;
  billingEnabled: boolean;
  resetsAt: string;
  hints: Allowance;
  analyses: Allowance;
}
export function UsageCard({ compact = false }: { compact?: boolean }) {
  const token = useAuthStore((state) => state.token);
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["ai-usage"],
    queryFn: async () => (await api.get<Usage>("/usage/ai")).data,
    enabled: !!token,
    staleTime: 10000,
    refetchInterval: 30000,
  });
  if (!token) return null;
  if (isError)
    return (
      <div className="rounded-xl border border-amber-500/25 p-3 text-xs text-amber-700 dark:text-amber-400">
        AI allowance is temporarily unavailable.{" "}
        <button type="button" onClick={() => refetch()} className="underline">
          Retry
        </button>
      </div>
    );
  if (isPending || !data)
    return (
      <p className="p-3 text-xs text-zinc-500" role="status">
        Loading AI allowance…
      </p>
    );
  return (
    <section
      aria-label="Monthly AI allowance"
      className={`rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] ${compact ? "p-3 text-xs" : "p-6"}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold">Free Beta · monthly AI allowance</h2>
        <Link
          href="/usage"
          className="text-emerald-700 underline dark:text-emerald-400"
        >
          Usage details
        </Link>
      </div>
      <div
        className={`mt-3 grid gap-4 ${compact ? "grid-cols-2" : "sm:grid-cols-2"}`}
      >
        {[
          ["Hints", data.hints],
          ["Analyses", data.analyses],
        ].map(([label, value]) => {
          const allowance = value as Allowance;
          return (
            <div key={String(label)}>
              <p className="font-medium">
                {String(label)}: {allowance.remaining} / {allowance.limit}{" "}
                remaining
              </p>
              {!compact && (
                <>
                  <progress
                    className="mt-3 h-2 w-full accent-emerald-500"
                    max={allowance.limit}
                    value={allowance.used + allowance.reserved}
                    aria-label={`${label} allowance used`}
                  />
                  <p className="mt-2 text-sm text-zinc-500">
                    {allowance.used} completed · {allowance.reserved} reserved
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-zinc-500">
        Resets{" "}
        {new Date(data.resetsAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        })}{" "}
        at 00:00 UTC.
      </p>
    </section>
  );
}
