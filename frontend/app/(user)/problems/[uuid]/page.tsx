"use client";

import React, { use } from "react";
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
            <div className="flex min-h-screen items-center justify-center bg-zinc-950">
                <div className="flex flex-col items-center gap-3 text-zinc-500">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    Loading...
                </div>
            </div>
        );
    }

    if (singleProblem.isError || !singleProblem.data?.data) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-4">
                <p className="text-red-400">Problem not found.</p>
                <Link href={basePath}>
                    <Button variant="outline" className="border-zinc-700 bg-zinc-800/50 text-zinc-200">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Problems
                    </Button>
                </Link>
            </div>
        );
    }

    const problem = singleProblem.data.data;

    // Use h-full to fit within the layout's main content area without overflowing
    return (
        <main className="h-full w-full flex flex-col bg-zinc-950 text-zinc-100">
            <section className="flex flex-1 flex-col lg:flex-row overflow-hidden">
                {/* Left panel - Problem Description */}
                <div className="lg:w-1/2 border-b lg:border-b-0 lg:border-r border-zinc-800 overflow-y-auto h-full">
                    <ProblemPanel problem={problem} />
                </div>

                {/* Right panel - Editor */}
                <div className="lg:w-1/2 flex flex-col overflow-hidden h-full">
                    <EditorPanel problem={problem} hideSubmit={false} />
                </div>
            </section>
        </main>
    );
}
