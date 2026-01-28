'use client';

import { Problem, Difficulty } from '@/types/problems';
import Link from 'next/link';
import { ExternalLink, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProblemsTableProps {
    problems: Problem[];
    basePath?: string;
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
    const difficultyConfig: Record<Difficulty, string> = {
        EASY: "text-emerald-400",
        MEDIUM: "text-amber-400",
        HARD: "text-rose-400",
    };
    const cls = difficultyConfig[difficulty] ?? "text-zinc-400";
    return (
        <span className={cn("text-xs font-medium", cls)}>
            {difficulty}
        </span>
    );
}

export function ProblemsTable({ problems, basePath = "/problems" }: ProblemsTableProps) {
    if (problems.length === 0) {
        return null;
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/50">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/80">
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Title</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider hidden md:table-cell">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Difficulty</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider hidden sm:table-cell">Tags</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {problems.map((problem) => (
                        <tr
                            key={problem.uuid}
                            className="hover:bg-zinc-800/30 transition-colors"
                        >
                            <td className="px-4 py-3">
                                <Link
                                    href={`${basePath}/${problem.uuid}`}
                                    className="font-medium text-white hover:text-sky-400 transition-colors truncate max-w-[200px] md:max-w-[300px] inline-block"
                                    title={problem.title}
                                >
                                    {problem.title}
                                </Link>
                            </td>
                            <td className="px-4 py-3 text-zinc-400 text-xs hidden md:table-cell">
                                <div className="truncate max-w-[300px]" title={problem.description}>
                                    {problem.description}
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <DifficultyBadge difficulty={problem.difficulty} />
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                                <div className="flex flex-wrap gap-1">
                                    {problem.tags?.slice(0, 2).map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {problem.tags && problem.tags.length > 2 && (
                                        <span className="inline-flex items-center text-xs text-zinc-500">
                                            +{problem.tags.length - 2}
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-1">
                                    <Link
                                        href={`${basePath}/${problem.uuid}`}
                                        className="p-1.5 rounded hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-colors"
                                        title="View problem"
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
