'use client';

import { Problem, Difficulty } from '@/types/problems';
import Link from 'next/link';
import { ExternalLink, Eye, Bookmark, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMySavedProblems, saveProblem, removeSavedProblem } from '@/services/profileApi';
import { toast } from 'sonner';
import { useState } from 'react';

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

function BookmarkButton({
    problemUuid,
    savedProblemUuid,
    isSaved
}: {
    problemUuid: string;
    savedProblemUuid?: string;
    isSaved: boolean;
}) {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);

    const saveMutation = useMutation({
        mutationFn: (uuid: string) => saveProblem(uuid),
        onMutate: () => setIsLoading(true),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-saved-problems'] });
            toast.success('Problem saved');
        },
        onError: (error: any) => {
            if (error?.response?.status === 409) {
                toast.info('Problem already saved');
            } else {
                toast.error('Failed to save problem');
            }
        },
        onSettled: () => setIsLoading(false),
    });

    const removeMutation = useMutation({
        mutationFn: (uuid: string) => removeSavedProblem(uuid),
        onMutate: () => setIsLoading(true),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-saved-problems'] });
            toast.success('Problem removed from saved');
        },
        onError: () => {
            toast.error('Failed to remove problem');
        },
        onSettled: () => setIsLoading(false),
    });

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLoading) return;

        if (isSaved && savedProblemUuid) {
            removeMutation.mutate(savedProblemUuid);
        } else {
            saveMutation.mutate(problemUuid);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={cn(
                "p-1.5 rounded dark:hover:bg-zinc-700/50 hover:bg-zinc-100 transition-colors",
                isSaved
                    ? "text-emerald-400 hover:text-emerald-300"
                    : "dark:text-zinc-400 text-zinc-500 dark:hover:text-white hover:text-zinc-800"
            )}
            title={isSaved ? "Remove from saved" : "Save problem"}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Bookmark
                    className={cn("w-4 h-4", isSaved && "fill-current")}
                />
            )}
        </button>
    );
}

export function ProblemsTable({ problems, basePath = "/problems" }: ProblemsTableProps) {
    // Fetch saved problems to check which ones are saved
    const { data: savedProblems = [] } = useQuery({
        queryKey: ['my-saved-problems'],
        queryFn: getMySavedProblems,
        staleTime: 1000 * 60 * 2, // Cache for 2 minutes
    });

    // Create a map of problemUuid -> savedProblem for quick lookup
    const savedProblemsMap = new Map(
        savedProblems.map(sp => [sp.problemUuid, sp])
    );

    if (problems.length === 0) {
        return null;
    }

    return (
        <div className="overflow-x-auto rounded-lg border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-900/50 bg-white shadow-sm dark:shadow-none">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b dark:border-zinc-800 border-zinc-200 dark:bg-zinc-900/80 bg-zinc-50">
                        <th className="px-4 py-3 text-left text-xs font-medium dark:text-zinc-400 text-zinc-500 uppercase tracking-wider">Title</th>
                        <th className="px-4 py-3 text-left text-xs font-medium dark:text-zinc-400 text-zinc-500 uppercase tracking-wider hidden md:table-cell">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium dark:text-zinc-400 text-zinc-500 uppercase tracking-wider">Difficulty</th>
                        <th className="px-4 py-3 text-left text-xs font-medium dark:text-zinc-400 text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Tags</th>
                        <th className="px-4 py-3 text-right text-xs font-medium dark:text-zinc-400 text-zinc-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y dark:divide-zinc-800/50 divide-zinc-100">
                    {problems.map((problem) => {
                        const savedProblem = savedProblemsMap.get(problem.uuid);
                        const isSaved = !!savedProblem;

                        return (
                            <tr
                                key={problem.uuid}
                                className="dark:hover:bg-zinc-800/30 hover:bg-zinc-50 transition-colors"
                            >
                                <td className="px-4 py-3">
                                    <Link
                                        href={`${basePath}/${problem.uuid}`}
                                        className="font-medium dark:text-white text-zinc-800 hover:text-sky-400 transition-colors truncate max-w-[200px] md:max-w-[300px] inline-block"
                                        title={problem.title}
                                    >
                                        {problem.title}
                                    </Link>
                                </td>
                                <td className="px-4 py-3 dark:text-zinc-400 text-zinc-500 text-xs hidden md:table-cell">
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
                                                className="inline-flex items-center rounded-full dark:bg-zinc-800 bg-zinc-100 px-2 py-0.5 text-xs dark:text-zinc-400 text-zinc-600"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                        {problem.tags && problem.tags.length > 2 && (
                                            <span className="inline-flex items-center text-xs dark:text-zinc-500 text-zinc-400">
                                                +{problem.tags.length - 2}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-1">
                                        <BookmarkButton
                                            problemUuid={problem.uuid}
                                            savedProblemUuid={savedProblem?.uuid}
                                            isSaved={isSaved}
                                        />
                                        <Link
                                            href={`${basePath}/${problem.uuid}`}
                                            className="p-1.5 rounded dark:hover:bg-zinc-700/50 hover:bg-zinc-100 dark:text-zinc-400 text-zinc-500 dark:hover:text-white hover:text-zinc-800 transition-colors"
                                            title="View problem"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
