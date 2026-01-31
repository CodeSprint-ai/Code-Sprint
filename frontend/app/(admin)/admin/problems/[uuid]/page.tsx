"use client";

import React, { use } from "react";
import Split from "react-split";
import { useProblem } from "@/hooks/useProblems";
import ProblemPanel from "@/components/layout/ProblemPanel";
import EditorPanel from "@/components/layout/EditorPanel";
import { Loader2 } from "lucide-react";
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
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-zinc-500">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                    <span className="text-sm font-medium">Loading problem...</span>
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
        <div className="h-[calc(100vh-4rem)] w-full flex flex-col text-zinc-100 overflow-hidden p-4 gap-4">
            <Split
                sizes={[50, 50]}
                minSize={300}
                gutterSize={8}
                direction="horizontal"
                className="flex flex-1 h-full overflow-hidden split-horizontal"
            >
                {/* Left Panel - Problem Description */}
                <div className="h-full overflow-hidden flex flex-col bg-[#09090b] rounded-xl border border-white/5">
                    <ProblemPanel problem={problem} basePath={basePath} />
                </div>

                {/* Right Panel - Editor & Results */}
                <div className="h-full overflow-hidden flex flex-col bg-[#09090b] rounded-xl border border-white/5">
                    <EditorPanel problem={problem} hideSubmit={false} />
                </div>
            </Split>
        </div>
    );
}
