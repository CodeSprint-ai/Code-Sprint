export default function ProblemDescription({ problem }: any) {
  return (
    <div className="space-y-3 text-sm">
      <div>
        <strong>Example:</strong>
        {problem.testCases?.map((ex: any, i: number) => (
          <pre
            key={i}
            className="bg-gray-100 dark:bg-gray-800 rounded-md p-3 mt-2 text-xs overflow-x-auto"
          >
            {ex.input && <div>Input: {ex.input}</div>}
            {ex.expectedOutput && <div>Output: {ex.expectedOutput}</div>}
         
          </pre>
        ))}
      </div>

      {problem.constraints && (
        <div>
          <strong>Constraints:</strong>
          <pre className="bg-gray-100 dark:bg-gray-800 rounded-md p-3 mt-2 text-xs overflow-x-auto">
            {problem.constraints}
          </pre>
        </div>
      )}
    </div>
  );
}
