"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { loginDestination } from "./config";
import { cardClass, primaryClass } from "./PublicShell";
interface Catalog {
  data: {
    uuid: string;
    title: string;
    difficulty: string;
    description: string;
    tags: string[];
  }[];
  meta: { total: number; page: number; totalPages: number };
}
export function PublicProblemCatalog() {
  const [draft, setDraft] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    difficulty: "",
    page: 1,
  });
  const query = useQuery({
    queryKey: ["public-problems", filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(filters.page),
        pageSize: "12",
        ...(filters.search ? { search: filters.search } : {}),
        ...(filters.difficulty ? { difficulty: filters.difficulty } : {}),
      });
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/problems/public?${params}`,
        { signal: AbortSignal.timeout(15000) },
      );
      if (!response.ok)
        throw new Error("The problem catalogue is temporarily unavailable.");
      return (await response.json()) as Catalog;
    },
    retry: 1,
  });
  return (
    <section
      className="mx-auto mt-14 max-w-6xl px-6"
      aria-label="Public problem bank"
    >
      <h2 className="text-3xl font-semibold">Find your next problem</h2>
      <p className="mt-3 text-zinc-500">
        Browse statements without an account. Sign in when you are ready to
        practice.
      </p>
      <form
        className="my-6 flex flex-wrap gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          setFilters((previous) => ({ ...previous, search: draft, page: 1 }));
        }}
      >
        <label className="sr-only" htmlFor="problem-search">
          Search problems
        </label>
        <input
          id="problem-search"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={100}
          placeholder="Search by title"
          className="min-w-0 flex-1 rounded-xl border border-zinc-300 bg-transparent px-4 py-3 dark:border-white/20"
        />
        <label className="sr-only" htmlFor="problem-difficulty">
          Difficulty
        </label>
        <select
          id="problem-difficulty"
          className="rounded-xl border border-zinc-300 bg-transparent p-3 dark:border-white/20"
          value={filters.difficulty}
          onChange={(event) =>
            setFilters((previous) => ({
              ...previous,
              difficulty: event.target.value,
              page: 1,
            }))
          }
        >
          <option value="">All difficulties</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
        <button className={primaryClass} type="submit">
          Search
        </button>
      </form>
      {query.isPending && <p role="status">Loading problems…</p>}
      {query.isError && (
        <div role="alert" className={cardClass}>
          <p>
            We could not load the problem catalogue. Please retry, or open your
            practice account.
          </p>
          <button className="mt-3 underline" onClick={() => query.refetch()}>
            Retry catalogue
          </button>
          <Link className="ml-5 underline" href={loginDestination("/problems")}>
            Open practice
          </Link>
        </div>
      )}
      {query.data && (
        <>
          <p className="mb-4 text-sm text-zinc-500">
            {query.data.meta.total} problems
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {query.data.data.map((problem) => (
              <article key={problem.uuid} className={cardClass}>
                <span className="text-xs font-semibold uppercase text-emerald-600">
                  {problem.difficulty}
                </span>
                <h3 className="mt-3 text-xl font-semibold">{problem.title}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {problem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-xs dark:bg-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <details className="my-5 text-sm">
                  <summary className="cursor-pointer text-zinc-500">
                    Read problem statement
                  </summary>
                  <p className="mt-4 whitespace-pre-wrap leading-relaxed">
                    {problem.description}
                  </p>
                </details>
                <Link
                  className="font-semibold text-emerald-600"
                  href={loginDestination(`/problems/${problem.uuid}`)}
                >
                  Practice this problem →
                </Link>
              </article>
            ))}
          </div>
          {query.data.data.length === 0 && (
            <p className={cardClass}>
              No problems match these filters. Try another title or difficulty.
            </p>
          )}
          <div className="mt-7 flex items-center justify-between">
            <button
              className="rounded-lg border px-4 py-2 disabled:opacity-40"
              disabled={filters.page <= 1}
              onClick={() =>
                setFilters((previous) => ({
                  ...previous,
                  page: previous.page - 1,
                }))
              }
            >
              Previous
            </button>
            <span className="text-sm">
              Page {filters.page} of {Math.max(1, query.data.meta.totalPages)}
            </span>
            <button
              className="rounded-lg border px-4 py-2 disabled:opacity-40"
              disabled={filters.page >= query.data.meta.totalPages}
              onClick={() =>
                setFilters((previous) => ({
                  ...previous,
                  page: previous.page + 1,
                }))
              }
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
