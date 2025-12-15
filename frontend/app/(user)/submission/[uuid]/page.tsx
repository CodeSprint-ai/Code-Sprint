"use client";

import React from "react";
import ProblemPanel from "@/components/layout/ProblemPanel";
import EditorPanel from "@/components/layout/EditorPanel";
import { useProblem } from "@/hooks/useProblems";

export default function SubmissionPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = React.use(params); // ✅ unwrap the params Promise
  const { singleProblem } = useProblem(uuid);
  const { data, isLoading } = singleProblem;

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!data) return <div className="p-6 text-red-600">Problem not found.</div>;

  const problem = data.data;

 
  return (
    <main className="flex flex-col flex-1 border-2 border-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 py-3 font-semibold text-lg flex justify-between items-center">
        <span>{problem.title}</span>
      </header>

      {/* Split layout */}
      <section className="flex flex-1 flex-col  lg:flex-row overflow-hidden ">
        {/* Left panel */}
        <div className="w-auto lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-800 overflow-y-auto p-6">
          <ProblemPanel problem={problem} />
        </div>

        {/* Right panel */}
        <div className="w-auto lg:w-1/2 flex flex-col overflow-hidden p-4">
          <EditorPanel problem={problem} />
        </div>
      </section>
    </main>
  );
}
