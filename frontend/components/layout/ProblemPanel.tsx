// components/layout/ProblemPanel.tsx
import React from "react";
import ProblemDescription from "../ProblemDescription";

export default function ProblemPanel({ problem }: any) {
  // Added p-6 here, removed it from the parent div in SubmissionPage
  return (
    <div className="p-6 space-y-4"> 
      <h1 className="text-2xl font-semibold">{problem.title}</h1>
      <p className="text-sm text-muted-foreground">{problem.description}</p>

      <ProblemDescription problem={problem} />
    </div>
  );
}