"use client";

import React from "react";
import ProblemPanel from "@/components/layout/ProblemPanel";
import EditorPanel from "@/components/layout/EditorPanel";
import { useProblem } from "@/hooks/useProblems";
import Split from "react-split";

export default function SubmissionPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = React.use(params);
  const { singleProblem } = useProblem(uuid);
  const { data, isLoading } = singleProblem;

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!data) return <div className="p-6 text-red-600">Problem not found.</div>;

  const problem = data.data;

  return (
    <main className="flex flex-col h-screen overflow-hidden">
      {/* Outer horizontal split: Problem | Editor+Submission */}
      <Split
        direction="horizontal"
        sizes={[40, 60]} // left 40%, right 60%
        minSize={200}
        gutterSize={6}
        className="h-full flex"
        cursor="col-resize"
      >
        {/* Left: Problem Panel */}
        <div className="h-full overflow-y-auto p-6 border-r border-gray-800">
          <ProblemPanel problem={problem} />
        </div>


        {/* Top: Code Editor */}
        <div className="h-full flex flex-col overflow-hidden">
          <EditorPanel problem={problem} />
        </div>


      </Split>
    </main>
  );
}
