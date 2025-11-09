"use client";

import React, { useEffect } from "react";
import ProblemsHeader from "@/components/ProblemsHeader";
import SubmissionEditor from "@/components/SubmissionEditor";
import SubmissionResult from "@/components/SubmissionResult";
import { useProblem } from "@/hooks/useProblems";
import { Problem } from "@/types/problems";

export default function SubmissionPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = React.use(params); // ✅ unwrap the params Promise

  const { singleProblem } = useProblem(uuid);
  const { data: problemData, isLoading, error, refetch } = singleProblem;

  useEffect(() => {
    refetch();
  }, [uuid, refetch]);

  if (isLoading) return <div className="p-6">Loading problem...</div>;
  if (error)
    return <div className="p-6 text-red-600">Failed to load problem</div>;

  if (!problemData) return <div className="p-6">Problem not found</div>;
  const problem: Problem = problemData.data as unknown as Problem;

  return (
    <main className="p-6 max-w-6xl mx-auto">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Column — Problem + Editor */}
        <section className="col-span-2 space-y-4">
          <h1 className="text-2xl font-semibold">{problem.title}</h1>
          <p className="text-sm text-muted-foreground">{problem.description}</p>

          <SubmissionEditor problem={problem} />
        </section>

        {/* Right Column — Details + Submissions */}
        <aside className="col-span-1 space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium">Problem Details</h3>
            <div className="text-sm mt-2 space-y-1">
              <div>Difficulty: {problem.difficulty}</div>
              <div>Time limit: {problem.timeLimitSeconds ?? 2}s</div>
              <div>Memory limit: {problem.memoryLimitMB ?? 2048} MB</div>
              {problem.type && (
                <div>
                  Type:{" "}
                  {typeof problem.type === "string" ? problem.type : "Code"}
                </div>
              )}
              {problem.starred !== undefined && (
                <div>Starred: {problem.starred ? "⭐ Yes" : "✩ No"}</div>
              )}
              <div className="mt-2">
                Tags: {problem.tags?.length ? problem.tags.join(", ") : "None"}
              </div>
            </div>
          </div>

          <SubmissionResult problemUuid={problem.uuid} />
        </aside>
      </div>
    </main>
  );
}
