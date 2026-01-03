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
    <div className="space-y-3 text-sm">
      {visibleTestCases.length > 0 && (
        <div>
          <strong>Example:</strong>
          {visibleTestCases.map((testCase: TestCase, i: number) => (
            <pre
              key={testCase.uuid || i}
              className="bg-gray-100 dark:bg-gray-800 rounded-md p-3 mt-2 text-xs overflow-x-auto"
            >
              <div>
                <span className="text-muted-foreground">Input: </span>
                {formatTestCaseInput(testCase)}
              </div>
              <div className="mt-1">
                <span className="text-muted-foreground">Output: </span>
                {formatTestCaseOutput(testCase)}
              </div>
            </pre>
          ))}
        </div>
      )}

      {problem.constraints && (
        <div>
          <strong>Constraints:</strong>
          <pre className="bg-gray-100 dark:bg-gray-800 rounded-md p-3 mt-2 text-xs overflow-x-auto whitespace-pre-wrap">
            {problem.constraints}
          </pre>
        </div>
      )}

      {problem.companies && problem.companies.length > 0 && (
        <div>
          <strong>Companies:</strong>
          <div className="flex flex-wrap gap-2 mt-2">
            {problem.companies.map((company, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
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
