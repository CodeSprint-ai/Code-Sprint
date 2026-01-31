import { Problem, TestCase, formatTestCaseInput, formatTestCaseOutput } from "@/types/problems";

interface ProblemDescriptionProps {
  problem: Problem;
}

export default function ProblemDescription({ problem }: ProblemDescriptionProps) {
  // Filter to only show sample/visible test cases
  const visibleTestCases = problem.testCases?.filter(
    (tc) => tc.isSample || !tc.isHidden
  ) || [];

  return (
    <div className="space-y-8 text-sm">
      {/* Examples */}
      {visibleTestCases.length > 0 && (
        <div>
          <h3 className="text-white font-bold text-sm mb-3">Example:</h3>
          {visibleTestCases.map((testCase: TestCase, i: number) => (
            <div
              key={testCase.uuid || i}
              className="bg-black/40 rounded-lg p-4 border border-white/5 font-mono text-xs space-y-2 mb-3"
            >
              <div>
                <span className="text-zinc-500">Input: </span>
                <span className="text-zinc-300">{formatTestCaseInput(testCase)}</span>
              </div>
              <div>
                <span className="text-zinc-500">Output: </span>
                <span className="text-zinc-300">{formatTestCaseOutput(testCase)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Constraints */}
      {problem.constraints && (
        <div>
          <h3 className="text-white font-bold text-sm mb-3">Constraints:</h3>
          <ul className="list-disc list-inside space-y-1 text-xs text-zinc-400 font-mono bg-black/40 p-4 rounded-lg border border-white/5">
            {problem.constraints.split('\n').filter(Boolean).map((constraint, i) => (
              <li key={i}>{constraint.replace(/^[-•*]\s*/, '')}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Companies */}
      {problem.companies && problem.companies.length > 0 && (
        <div>
          <h3 className="text-white font-bold text-sm mb-3">Companies:</h3>
          <div className="flex flex-wrap gap-2">
            {problem.companies.map((company, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-zinc-400 text-xs transition-colors cursor-pointer border border-white/5 hover:border-white/20"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
