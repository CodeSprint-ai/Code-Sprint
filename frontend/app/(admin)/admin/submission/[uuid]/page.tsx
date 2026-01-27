"use client";

import React from "react";
import Link from "next/link";
import { useSubmission } from "@/hooks/useSubmission";
import type { Submission, TestResult } from "@/types/submission";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileCode2, Clock, Cpu, Calendar, CheckCircle2, XCircle } from "lucide-react";

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

export default function AdminSubmissionViewPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = React.use(params);
  const { singleSubmission } = useSubmission(undefined, uuid, undefined);

  const raw = singleSubmission.data as unknown;
  const submission: Submission | null = raw
    ? (raw as { submission?: Submission }).submission ?? (raw as Submission)
    : null;

  if (singleSubmission.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3 text-zinc-500">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-sky-500" />
          Loading submission...
        </div>
      </div>
    );
  }

  if (singleSubmission.isError || !submission) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-4">
        <p className="text-red-400">Submission not found.</p>
        <Link href="/admin/submission">
          <Button variant="outline" className="border-zinc-700 bg-zinc-800/50 text-zinc-200">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Submissions
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/submission"
          className="mb-6 inline-flex items-center text-sm text-zinc-400 hover:text-zinc-200"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Submissions
        </Link>

        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-zinc-100">
                {submission.problemTitle ?? "Submission"}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                {submission.userName ? `by ${submission.userName}` : ""} ·{" "}
                {new Date(submission.createdAt).toLocaleString()}
              </p>
            </div>
            <StatusBadge status={submission.status} />
          </div>

          <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
            <div className="flex items-center gap-2 text-zinc-400">
              <FileCode2 className="h-4 w-4" />
              {submission.language}
            </div>
            {submission.executionTime != null && (
              <div className="flex items-center gap-2 text-zinc-400">
                <Clock className="h-4 w-4" />
                {submission.executionTime} ms
              </div>
            )}
            {submission.memoryUsage != null && (
              <div className="flex items-center gap-2 text-zinc-400">
                <Cpu className="h-4 w-4" />
                {submission.memoryUsage} KB
              </div>
            )}
          </div>

          {submission.compileOutput && (
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-medium text-rose-400">Compile output</h3>
              <pre className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-xs text-zinc-300">
                {submission.compileOutput}
              </pre>
            </div>
          )}

          {submission.testResults && submission.testResults.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-medium text-zinc-300">Test results</h3>
              <div className="space-y-2">
                {(submission.testResults as TestResult[]).map((tr, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2"
                  >
                    <div className="flex items-center gap-2">
                      {tr.verdict === "ACCEPTED" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-500" />
                      )}
                      <span className="text-zinc-300">
                        Test {i + 1} {tr.isHidden ? "(Hidden)" : tr.verdict}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-500">
                      {tr.time != null ? `${tr.time.toFixed(3)}s` : "—"} /{" "}
                      {tr.memory != null ? `${tr.memory} KB` : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="mb-2 text-sm font-medium text-zinc-300">Code</h3>
            <pre className="max-h-96 overflow-auto rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-xs text-zinc-300">
              {submission.code}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
