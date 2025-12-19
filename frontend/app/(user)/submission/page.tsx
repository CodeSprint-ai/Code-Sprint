"use client";

import { SubmissionCard } from "@/components/SubmissionCard";
import { useAuth } from "@/hooks/useAuth";
import { useSubmission } from "@/hooks/useSubmission";
import { useAuthStore } from "@/store/authStore";

interface SubmissionsPageProps {
  userUuid: string;
}

function StatusBadge({ status }: { status: string }) {
  const statusColor =
    status === "ACCEPTED"
      ? "bg-green-500/10 text-green-400 border-green-500/20"
      : status === "WRONG_ANSWER"
        ? "bg-red-500/10 text-red-400 border-red-500/20"
        : status === "TIME_LIMIT_EXCEEDED"
          ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
          : status === "COMPILATION_ERROR"
            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
            : "bg-gray-500/10 text-gray-400 border-gray-500/20";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusColor}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

export default function SubmissionsPage() {
  const userUuid = useAuthStore((state) => state.user?.userUuid);

  const { allSubmissions } = useSubmission(undefined, undefined, userUuid);

  if (allSubmissions.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-gray-400">
        Loading submissions...
      </div>
    );
  }

  if (allSubmissions.isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-400">
        Failed to load submissions
      </div>
    );
  }

  const submissions: any = allSubmissions?.data ?? [];

  return (
    <div className="min-h-screen bg-black px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-100 mb-6">
        My Submissions
      </h1>

      {submissions.length === 0 ? (
        <p className="text-gray-500">No submissions found.</p>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission: any, index: number) => (
            <SubmissionCard
              key={submission.uuid}
              submission={submission}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
