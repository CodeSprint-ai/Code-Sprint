"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { loginDestination } from "./config";
interface Preview {
  data: {
    uuid: string;
    title: string;
    difficulty: string;
    description: string;
    tags: string[];
  }[];
  meta: { total: number };
}
export function ProblemListPreview() {
  const query = useQuery({
    queryKey: ["public-problem-preview"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/problems/public?pageSize=5`,
        { signal: AbortSignal.timeout(15000) },
      );
      if (!response.ok) throw new Error("Catalogue unavailable");
      return (await response.json()) as Preview;
    },
    staleTime: 60000,
    retry: 1,
  });
  return (
    <section className="m-section">
      <div className="m-section-heading">
        <div>
          <p className="m-kicker">The problem bank</p>
          <h2>A place to put your thinking to work.</h2>
        </div>
        <Link href="/platform/problem-bank" className="m-text-link">
          Browse all problems
          <ArrowRight size={15} />
        </Link>
      </div>
      <div className="m-problem-list" aria-label="Problem bank preview">
        {query.isPending && (
          <p className="m-muted py-7 text-sm" role="status">
            Loading problems…
          </p>
        )}
        {query.isError && (
          <p className="m-muted py-7 text-sm">
            The catalogue is temporarily unavailable.{" "}
            <Link className="m-text-link" href="/platform/problem-bank">
              Open the problem bank
            </Link>
          </p>
        )}
        {query.data?.data.map((problem, index) => (
          <details key={problem.uuid}>
            <summary>
              <span className="m-problem-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="m-problem-title">{problem.title}</span>
              <span className="m-problem-tag">
                {problem.tags[0]?.replaceAll("_", " ") || "Algorithms"}
              </span>
              <span className="m-difficulty" data-level={problem.difficulty}>
                {problem.difficulty.toLowerCase()}
              </span>
              <ChevronDown size={13} />
            </summary>
            <div className="m-problem-description">
              <p>{problem.description}</p>
              <Link
                href={loginDestination(`/problems/${problem.uuid}`)}
                className="m-text-link"
              >
                Practice this problem
                <ArrowRight size={14} />
              </Link>
            </div>
          </details>
        ))}
        {query.data?.data.length === 0 && (
          <p className="m-muted py-7 text-sm">
            New problems will appear here as they are published.
          </p>
        )}
      </div>
    </section>
  );
}
