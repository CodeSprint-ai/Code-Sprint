import { Problem, TestCase, formatTestCaseInput, formatTestCaseOutput } from "@/types/problems";
import HintSystem from "./HintSystem";

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
          <h3 className="dark:text-white text-zinc-900 font-bold text-sm mb-3">Example:</h3>
          {visibleTestCases.map((testCase: TestCase, i: number) => (
            <div
              key={testCase.uuid || i}
              className="dark:bg-black/40 bg-zinc-50 rounded-lg p-4 border dark:border-white/5 border-zinc-200 font-mono text-xs space-y-2 mb-3"
            >
              <div>
                <span className="dark:text-zinc-500 text-zinc-600">Input: </span>
                <span className="dark:text-zinc-300 text-zinc-800">{formatTestCaseInput(testCase)}</span>
              </div>
              <div>
                <span className="dark:text-zinc-500 text-zinc-600">Output: </span>
                <span className="dark:text-zinc-300 text-zinc-800">{formatTestCaseOutput(testCase)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Constraints */}
      {problem.constraints && (
        <div>
          <h3 className="dark:text-white text-zinc-900 font-bold text-sm mb-3">Constraints:</h3>
          <ul className="list-disc list-inside space-y-1 text-xs dark:text-zinc-400 text-zinc-600 font-mono dark:bg-black/40 bg-zinc-50 p-4 rounded-lg border dark:border-white/5 border-zinc-200">
            {problem.constraints.split('\n').filter(Boolean).map((constraint, i) => (
              <li key={i}>{constraint.replace(/^[-•*]\s*/, '')}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Companies */}
      {problem.companies && problem.companies.length > 0 && (
        <div>
          <h3 className="dark:text-white text-zinc-900 font-bold text-sm mb-3">Companies:</h3>
          <div className="flex flex-wrap gap-2">
            {problem.companies.map((company, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded dark:bg-white/5 bg-zinc-100 dark:hover:bg-white/10 hover:bg-zinc-200 dark:text-zinc-400 text-zinc-600 text-xs transition-colors cursor-pointer border dark:border-white/5 border-zinc-200 dark:hover:border-white/20 hover:border-zinc-300"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Hints */}
      <HintSystem problemUuid={problem.uuid} />
    </div>
  );
}
