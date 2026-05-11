"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSubmission } from "@/hooks/useSubmission";
import { useProblem } from "@/hooks/useProblems";
import ProblemPanel from "@/components/layout/ProblemPanel";
import EditorPanel from "@/components/layout/EditorPanel";
import type { Submission, TestResult } from "@/types/submission";
import type { Problem } from "@/types/problems";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileCode2, Clock, Cpu, CheckCircle2, XCircle } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "ACCEPTED"
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
      : status === "WRONG_ANSWER" || status === "COMPILATION_ERROR" || status === "RUNTIME_ERROR"
        ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
        : status === "TIME_LIMIT_EXCEEDED"
          ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
          : "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
}

export default function SubmissionViewPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = React.use(params);
  const { singleSubmission } = useSubmission(undefined, uuid, undefined);
  const { singleProblem } = useProblem(uuid);

  const rawSubmission = singleSubmission.data as unknown;
  const submission: Submission | null = rawSubmission
    ? (rawSubmission as { submission?: Submission }).submission ?? (rawSubmission as Submission)
    : null;

  const rawProblem = singleProblem.data as unknown;
  const problem: Problem | null = rawProblem
    ? (rawProblem as { data?: Problem }).data ?? (rawProblem as Problem)
    : null;

  // If we have a submission, show submission view
  if (submission) {
    return <SubmissionView submission={submission} />;
  }

  // If we have a problem (even if submission is still loading), show problem solve page
  // This handles the case when clicking on a problem card
  if (problem) {
    return <ProblemSolveView problem={problem} />;
  }

  // If both are loading, show loading
  if (singleSubmission.isLoading || singleProblem.isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] w-full flex flex-col gap-4 p-4 overflow-hidden dark:bg-zinc-950 bg-zinc-50">
        <div className="flex-1 flex gap-4 overflow-hidden">
          <Skeleton className="flex-1 h-full rounded-xl" />
          <Skeleton className="flex-1 h-full rounded-xl" />
        </div>
      </div>
    );
  }

  // If both failed, show error
  const pathname = usePathname();
  const basePath = pathname?.startsWith("/admin") ? "/admin/submission" : "/submission";
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 dark:bg-zinc-950 bg-zinc-50 px-4">
      <p className="text-red-400">Not found.</p>
      <Link href={basePath}>
        <Button variant="outline" className="dark:border-zinc-700 border-zinc-200 dark:bg-zinc-800/50 bg-white dark:text-zinc-200 text-zinc-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Submissions
        </Button>
      </Link>
    </div>
  );
}

function SubmissionView({ submission }: { submission: Submission }) {
  const pathname = usePathname();
  const basePath = pathname?.startsWith("/admin") ? "/admin/submission" : "/submission";
  
  return (
    <div className="min-h-screen dark:bg-[#0c0c0e] bg-zinc-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href={basePath}
          className="mb-6 inline-flex items-center text-sm dark:text-zinc-400 text-zinc-500 dark:hover:text-zinc-200 hover:text-zinc-800"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Submissions
        </Link>

        <div className="rounded-xl border dark:border-white/5 border-zinc-200 dark:bg-[#09090b] bg-white p-6 shadow-sm dark:shadow-none">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold dark:text-zinc-100 text-zinc-900">
                {submission.problemTitle ?? "Submission"}
              </h1>
              <p className="mt-1 text-sm dark:text-zinc-500 text-zinc-500">
                {submission.userName ? `by ${submission.userName} · ` : ""}
                {new Date(submission.createdAt).toLocaleString()}
              </p>
            </div>
            <StatusBadge status={submission.status} />
          </div>

          <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
            <div className="flex items-center gap-2 dark:text-zinc-400 text-zinc-600">
              <FileCode2 className="h-4 w-4" />
              {submission.language}
            </div>
            {submission.executionTime != null && (
              <div className="flex items-center gap-2 dark:text-zinc-400 text-zinc-600">
                <Clock className="h-4 w-4" />
                {submission.executionTime} ms
              </div>
            )}
            {submission.memoryUsage != null && (
              <div className="flex items-center gap-2 dark:text-zinc-400 text-zinc-600">
                <Cpu className="h-4 w-4" />
                {submission.memoryUsage} KB
              </div>
            )}
          </div>

          {submission.compileOutput && (
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-medium text-rose-400">Compile output</h3>
              <pre className="overflow-x-auto rounded-lg border dark:border-white/5 border-zinc-200 dark:bg-zinc-900/50 bg-zinc-50 p-4 text-xs dark:text-zinc-300 text-zinc-700">
                {submission.compileOutput}
              </pre>
            </div>
          )}

          {submission.testResults && submission.testResults.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-medium dark:text-zinc-300 text-zinc-700">Test results</h3>
              <div className="space-y-2">
                {(submission.testResults as TestResult[]).map((tr, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border dark:border-white/5 border-zinc-200 dark:bg-zinc-900/50 bg-zinc-50 px-4 py-2"
                  >
                    <div className="flex items-center gap-2">
                      {tr.verdict === "ACCEPTED" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-500" />
                      )}
                      <span className="dark:text-zinc-300 text-zinc-700">
                        Test {i + 1} {tr.isHidden ? "(Hidden)" : tr.verdict}
                      </span>
                    </div>
                    <span className="text-xs dark:text-zinc-500 text-zinc-500">
                      {tr.time != null ? `${tr.time.toFixed(3)}s` : "—"} /{" "}
                      {tr.memory != null ? `${tr.memory} KB` : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="mb-2 text-sm font-medium dark:text-zinc-300 text-zinc-700">Code</h3>
            <pre className="max-h-96 overflow-auto rounded-lg border dark:border-white/5 border-zinc-200 dark:bg-zinc-900/50 bg-zinc-50 p-4 text-xs dark:text-zinc-300 text-zinc-700">
              {submission.code}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProblemSolveView({ problem }: { problem: Problem }) {
  return (
    <main className="h-screen w-full flex flex-col dark:bg-zinc-950 bg-zinc-50 dark:text-zinc-100 text-zinc-900">
      <section className="flex flex-1 flex-col lg:flex-row overflow-y-auto lg:overflow-hidden pb-4 lg:pb-0">
        {/* Left panel - Problem Description */}
        <div className="lg:w-1/2 min-h-[50vh] lg:min-h-0 border-b lg:border-b-0 lg:border-r dark:border-zinc-800 border-zinc-200 overflow-y-auto h-full shrink-0 lg:shrink">
          <ProblemPanel problem={problem} />
        </div>

        {/* Right panel - Editor */}
        <div className="lg:w-1/2 min-h-[70vh] lg:min-h-0 flex flex-col overflow-hidden h-full shrink-0 lg:shrink">
          <EditorPanel problem={problem} hideSubmit={false} />
        </div>
      </section>
    </main>
  );
}
