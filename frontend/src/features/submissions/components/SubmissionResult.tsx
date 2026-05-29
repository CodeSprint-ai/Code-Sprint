import React, { useEffect, useState } from "react";
import { useSubmission } from "@/hooks/useSubmission";
import {
  Submission,
  TestResult,
  getStatusColor,
  formatTestResultInput,
  formatTestResultExpected,
  formatTestResultGot,
} from "@/types/submission";

export default function SubmissionResult({
  problemUuid,
}: {
  problemUuid: string;
}) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const { allSubmissions } = useSubmission(problemUuid);

  useEffect(() => {
    if (allSubmissions.data) {
      const data = allSubmissions.data as any;
      if (Array.isArray(data)) {
        setSubmissions(data);
      } else if (Array.isArray(data.submissions)) {
        setSubmissions(data.submissions);
      } else {
        setSubmissions([]);
      }
    } else {
      setSubmissions([]);
    }
  }, [allSubmissions.data]);

  return (
    <div className="p-4 border rounded-lg">
      <h4 className="font-medium">Recent Submissions</h4>

      <div className="mt-3 space-y-3">
        {submissions.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No submissions yet
          </div>
        )}

        {submissions.map((s: Submission) => (
          <div key={s.uuid} className="p-2 border rounded-md">
            <div className="flex justify-between items-center">
              <div className="text-sm">
                {new Date(s.createdAt).toLocaleString()}
              </div>
              <div className={`text-sm font-medium ${getStatusColor(s.status)}`}>
                {s.status}
              </div>
            </div>

            {s.executionTime !== undefined && (
              <div className="text-xs text-muted-foreground mt-1">
                Time: {s.executionTime.toFixed(3)}s | Memory: {s.memoryUsage?.toFixed(0) ?? "-"} KB
              </div>
            )}

            {s.testResults && s.testResults.length > 0 && (
              <div className="mt-2 text-xs space-y-1">
                {s.testResults.map((tr: TestResult, idx: number) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          tr.verdict === "ACCEPTED" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span>
                        Test {idx + 1}: {tr.isHidden ? "(Hidden)" : tr.verdict}
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      {tr.time?.toFixed(3) ?? "-"}s / {tr.memory ?? "-"} KB
                    </div>
                  </div>
                ))}
              </div>
            )}

            {s.compileOutput && (
              <div className="mt-2">
                <div className="text-xs font-medium text-red-600">Compile Error:</div>
                <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 overflow-x-auto">
                  {s.compileOutput}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
