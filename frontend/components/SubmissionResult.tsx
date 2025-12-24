import React, { useEffect, useState } from "react";
// import useSocket from "@/lib/socket-io";
import { useSubmission } from "@/hooks/useSubmission";

export default function SubmissionResult({
  problemUuid,
}: {
  problemUuid: string;
}) {
  // const socket = useSocket();
  const [submissions, setSubmissions] = useState<any[]>([]);

  // ✅ use your React Query hook
  const { allSubmissions } = useSubmission(problemUuid);

  // update local state when new data comes
  useEffect(() => {
    if (allSubmissions.data) {
      const data = allSubmissions.data as any;
      if (Array.isArray(data)) {
        // data is already an array of submissions
        setSubmissions(data);
      } else if (Array.isArray(data.submissions)) {
        // data is a wrapper object { submissions: [...] }
        setSubmissions(data.submissions);
      } else {
        // fallback: clear or set an empty array
        setSubmissions([]);
      }
    } else {
      setSubmissions([]);
    }
  }, [allSubmissions.data]);

  // ✅ real-time update listener
  // useEffect(() => {
  //   const handleUpdate = (payload: any) => {
  //     console.log("📩 Submission update received:", payload);
  //     allSubmissions.refetch?.(); 
  //   };

  //   socket.on("submission.update", handleUpdate);

  //   return () => {
  //     socket.off("submission.update", handleUpdate);
  //   };
  // }, [socket, allSubmissions]);

  return (
    <div className="p-4 border rounded-lg">
      <h4 className="font-medium">Recent Submissions</h4>

      <div className="mt-3 space-y-3">
        {submissions.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No submissions yet
          </div>
        )}

        {submissions.map((s: any) => (
          <div key={s.id || s.uuid} className="p-2 border rounded-md">
            <div className="flex justify-between items-center">
              <div className="text-sm">
                {new Date(s.createdAt).toLocaleString()}
              </div>
              <div
                className={`text-sm font-medium ${
                  s.status === "SUCCESS"
                    ? "text-green-600"
                    : s.status === "FAILED"
                    ? "text-red-600"
                    : s.status === "RUNNING"
                    ? "text-yellow-600"
                    : "text-gray-500"
                }`}
              >
                {s.status}
              </div>
            </div>

            {s.testResults?.length > 0 && (
              <div className="mt-2 text-xs space-y-1">
                {s.testResults.map((tr: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <div>
                      Test {idx + 1}: {tr.verdict}
                    </div>
                    <div>
                      {tr.time ?? "-"}s / {tr.memory ?? "-"} MB
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
