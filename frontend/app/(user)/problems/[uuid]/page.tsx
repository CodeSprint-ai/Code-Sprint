"use client";

import React, { use } from "react";
import Split from "react-split";
import { useProblem } from "@/hooks/useProblems";
import ProblemPanel from "@/components/layout/ProblemPanel";
import EditorPanel from "@/components/layout/EditorPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProblemPage({
    params,
}: {
    params: Promise<{ uuid: string }>;
}) {
    const { uuid } = use(params);
    const { singleProblem } = useProblem(uuid);
    const pathname = usePathname();
    const basePath = pathname?.startsWith("/admin") ? "/admin/problems" : "/problems";

    if (singleProblem.isLoading) {
        return (
            <div className="h-[calc(100vh-4rem)] w-full flex flex-col gap-4 p-4 overflow-hidden">
                <div className="flex-1 flex gap-4 overflow-hidden">
                    <Skeleton className="flex-1 h-full rounded-xl" />
                    <Skeleton className="flex-1 h-full rounded-xl" />
                </div>
            </div>
        );
    }

    if (singleProblem.isError || !singleProblem.data?.data) {
        return (
            <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4">
                <p className="text-red-400">Problem not found.</p>
                <Link href={basePath}>
                    <Button variant="outline" className="border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10 hover:text-white">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Problems
                    </Button>
                </Link>
            </div>
        );
    }

    const problem = singleProblem.data.data;

    return (
        <div className="h-[calc(100vh-4rem)] w-full flex flex-col dark:text-zinc-100 text-zinc-900 overflow-hidden p-3 sm:p-4 gap-3 sm:gap-4">
            {/* Mobile Layout: Stacked vertically */}
            <div className="flex lg:hidden flex-col flex-1 gap-4 overflow-y-auto pb-4">
                <div className="min-h-[50vh] flex flex-col dark:bg-[#09090b] bg-white rounded-xl border dark:border-white/5 border-zinc-200 overflow-hidden">
                    <ProblemPanel problem={problem} basePath={basePath} />
                </div>
                <div className="min-h-[70vh] flex flex-col dark:bg-[#09090b] bg-white rounded-xl border dark:border-white/5 border-zinc-200 overflow-hidden">
                    <EditorPanel problem={problem} hideSubmit={false} />
                </div>
            </div>

            {/* Desktop Layout: Split view */}
            <div className="hidden lg:flex flex-1 h-full overflow-hidden">
                <Split
                    sizes={[50, 50]}
                    minSize={300}
                    gutterSize={8}
                    direction="horizontal"
                    className="flex flex-1 w-full h-full overflow-hidden split-horizontal"
                >
                    {/* Left Panel - Problem Description */}
                    <div className="h-full overflow-hidden flex flex-col dark:bg-[#09090b] bg-white rounded-xl border dark:border-white/5 border-zinc-200">
                        <ProblemPanel problem={problem} basePath={basePath} />
                    </div>

                    {/* Right Panel - Editor & Results */}
                    <div className="h-full overflow-hidden flex flex-col dark:bg-[#09090b] bg-white rounded-xl border dark:border-white/5 border-zinc-200">
                        <EditorPanel problem={problem} hideSubmit={false} />
                    </div>
                </Split>
            </div>
        </div>
    );
}
