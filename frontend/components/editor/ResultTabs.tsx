import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Submission } from "@/types/submission";
import { useSubmissionSocket } from "@/hooks/useSubmissionSocket";

interface ResultTabsProps {
  initialResult: Submission | null;
  isLoading: boolean;
}

export default function ResultTabs({ initialResult, isLoading }: ResultTabsProps) {
  const [tab, setTab] = useState("console");
  const [result, setResult] = useState<Submission | null>(initialResult);

  // --- Subscribe to real-time updates ---
  useSubmissionSocket((update: Submission) => {
    // update the local state whenever backend sends new submission data
    console.log({update});
    
    setResult(update);
  });

  const statusColor =
    result?.status === "ACCEPTED"
      ? "text-green-500"
      : result?.status === "WRONG_ANSWER"
      ? "text-red-500"
      : "text-yellow-500";

  return (
    <Tabs value={tab} onValueChange={setTab} className=" bg-background">
      <TabsList className="bg-muted/40 border-b border-gray-800">
        <TabsTrigger value="console">Console</TabsTrigger>
        <TabsTrigger value="testcases">Test Cases</TabsTrigger>
        <TabsTrigger value="results">Results</TabsTrigger>
      </TabsList>

      {/* --- Console Tab --- */}
      <TabsContent className="flex-1 overflow-auto p-3 text-sm text-gray-300" value="console">
        {isLoading && (
          <div className="flex items-center space-x-2 text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing code...</span>
          </div>
        )}

        {!isLoading && result?.output && (
          <>
            <h3 className="font-semibold text-white mb-2">Standard Output:</h3>
            <pre className="bg-gray-800 p-2 rounded">{result.output}</pre>
          </>
        )}

        {!isLoading && !result && <div>Console output will appear here after running your code.</div>}
      </TabsContent>

      {/* --- Test Cases Tab --- */}
      {/* <TabsContent className="flex-1 overflow-auto p-3 text-sm text-gray-300" value="testcases">
        {result?.testResults ? (
          <ul className="list-disc pl-5">
            {result.testResults.map((tr, i) => (
              <li
                key={i}
                className={tr.verdict === "ACCEPTED" ? "text-green-400" : "text-red-400"}
              >
                Test {i + 1}: {tr.verdict} | Time: {tr.time}s | Memory: {tr.memory}KB
              </li>
            ))}
          </ul>
        ) : (
          <div>Test cases will be shown here upon submission completion.</div>
        )}
      </TabsContent> */}

      {/* --- Results Tab --- */}
      <TabsContent className="flex-1 overflow-auto p-3 text-sm" value="results">
        {result ? (
          <div className="space-y-3">
            <h3 className="font-bold text-lg">
              Status: <span className={statusColor}>{result.status}</span>
            </h3>
            {/* {result.message && <p>{result.message}</p>} */}
          </div>
        ) : (
          <div>Submission results will be displayed here.</div>
        )}
      </TabsContent>
    </Tabs>
  );
}
