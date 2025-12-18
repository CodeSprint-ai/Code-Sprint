"use client";

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

    const submissions:any = allSubmissions?.data ?? [];

    return (
        <div className="min-h-screen bg-black px-6 py-8">
            <h1 className="text-2xl font-semibold text-gray-100 mb-6">
                My Submissions
            </h1>

            {submissions.length === 0 ? (
                <p className="text-gray-500">No submissions found.</p>
            ) : (
                <div className="space-y-4">
                    {submissions.map((submission:any) => (
                        <div
                            key={submission.uuid}
                            className="rounded-lg border border-gray-800 bg-gray-900 p-4 hover:bg-gray-800 transition"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-200 font-medium">
                                        Language:{" "}
                                        <span className="text-gray-400">
                                            {submission.language}
                                        </span>
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        Problem ID: {submission.problemId}
                                    </p>
                                </div>

                                <StatusBadge status={submission.status} />
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-gray-400">
                                <div>
                                    ⏱ Time:{" "}
                                    {submission.executionTime
                                        ? `${submission.executionTime} ms`
                                        : "—"}
                                </div>
                                <div>
                                    💾 Memory:{" "}
                                    {submission.memoryUsage
                                        ? `${submission.memoryUsage} KB`
                                        : "—"}
                                </div>
                            </div>

                            <p className="mt-3 text-xs text-gray-500">
                                Submitted at:{" "}
                                {new Date(submission.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
