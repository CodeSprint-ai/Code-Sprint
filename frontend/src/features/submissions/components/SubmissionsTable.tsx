'use client';

import { Submission } from '@/types/submission';
import Link from 'next/link';
import { Eye, FileCode2, User, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubmissionsTableProps {
    submissions: Submission[];
    basePath?: string;
}

function StatusBadge({ status }: { status: string }) {
    const statusConfig: Record<string, string> = {
        ACCEPTED: "text-emerald-400",
        WRONG_ANSWER: "text-rose-400",
        TIME_LIMIT_EXCEEDED: "text-amber-400",
        COMPILATION_ERROR: "text-violet-400",
        RUNTIME_ERROR: "text-red-400",
        PROCESSING: "text-sky-400",
        QUEUED: "text-sky-300",
        PENDING: "text-zinc-400",
    };
    const cls = statusConfig[status] ?? "text-zinc-400";
    return (
        <span className={cn("text-xs font-medium", cls)}>
            {status.replaceAll("_", " ")}
        </span>
    );
}

export function SubmissionsTable({ submissions, basePath = "/submission" }: SubmissionsTableProps) {
    if (submissions.length === 0) {
        return null;
    }

    return (
        <div className="overflow-x-auto rounded-lg border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-900/50 bg-white shadow-sm dark:shadow-none">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b dark:border-zinc-800 border-zinc-200 dark:bg-zinc-900/80 bg-zinc-50">
                        <th className="px-4 py-3 text-left text-xs font-medium dark:text-zinc-400 text-zinc-500 uppercase tracking-wider">Problem</th>
                        <th className="px-4 py-3 text-left text-xs font-medium dark:text-zinc-400 text-zinc-500 uppercase tracking-wider hidden md:table-cell">User</th>
                        <th className="px-4 py-3 text-left text-xs font-medium dark:text-zinc-400 text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Language</th>
                        <th className="px-4 py-3 text-left text-xs font-medium dark:text-zinc-400 text-zinc-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium dark:text-zinc-400 text-zinc-500 uppercase tracking-wider hidden lg:table-cell">Submitted</th>
                        <th className="px-4 py-3 text-right text-xs font-medium dark:text-zinc-400 text-zinc-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y dark:divide-zinc-800/50 divide-zinc-100">
                    {submissions.map((submission) => (
                        <tr
                            key={submission.uuid}
                            className="dark:hover:bg-zinc-800/30 hover:bg-zinc-50 transition-colors"
                        >
                            <td className="px-4 py-3">
                                <Link
                                    href={`${basePath}/${submission.uuid}`}
                                    className="font-medium dark:text-white text-zinc-800 hover:text-sky-400 transition-colors truncate max-w-[200px] md:max-w-[300px] inline-block"
                                    title={submission.problemTitle || "Untitled Problem"}
                                >
                                    {submission.problemTitle || "Untitled Problem"}
                                </Link>
                            </td>
                            <td className="px-4 py-3 dark:text-zinc-400 text-zinc-500 text-xs hidden md:table-cell">
                                <div className="flex items-center gap-2">
                                    <User className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">{submission.userName || "—"}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3 dark:text-zinc-400 text-zinc-500 text-xs hidden sm:table-cell">
                                <div className="flex items-center gap-1">
                                    <FileCode2 className="h-3.5 w-3.5" />
                                    {submission.language}
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <StatusBadge status={submission.status} />
                            </td>
                            <td className="px-4 py-3 dark:text-zinc-400 text-zinc-500 text-xs hidden lg:table-cell whitespace-nowrap">
                                {new Date(submission.createdAt).toLocaleDateString(undefined, {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-1">
                                    <Link
                                        href={`${basePath}/${submission.uuid}`}
                                        className="p-1.5 rounded dark:hover:bg-zinc-700/50 hover:bg-zinc-100 dark:text-zinc-400 text-zinc-500 dark:hover:text-white hover:text-zinc-800 transition-colors"
                                        title="View submission"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
