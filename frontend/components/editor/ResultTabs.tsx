// components/editor/ResultTabs.tsx
"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react"; // Assuming you have lucide-react for icons

interface ResultTabsProps {
  // result can be null initially, or hold the output/status object
  result: {
    status: string;
    message: string;
    output?: string; // Used for "Run" operations
    // Add more fields for detailed results like testCaseResults
  } | null;
  isLoading: boolean;
}

export default function ResultTabs({ result, isLoading }: ResultTabsProps) {
  const [tab, setTab] = useState("console");

  const isSuccess = result?.status === "Accepted";
  const statusColor = isSuccess ? "text-green-500" : (result?.status === "Error" ? "text-red-500" : "text-yellow-500");

  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      className="flex flex-col h-full bg-background"
    >
      <TabsList className="bg-muted/40 border-b border-gray-800">
        <TabsTrigger value="console">Console</TabsTrigger>
        <TabsTrigger value="testcases">Test Cases</TabsTrigger>
        <TabsTrigger value="results">Results</TabsTrigger>
      </TabsList>

      {/* --- Console Output Tab --- */}
      <TabsContent
        value="console"
        className="flex-1 overflow-auto p-3 text-sm text-gray-300"
      >
        {/* Display spinner when running/submitting */}
        {isLoading && (
          <div className="flex items-center space-x-2 text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing code...</span>
          </div>
        )}

        {/* Display output if available from a 'Run' operation */}
        {!isLoading && result?.output && (
          <>
            <h3 className="font-semibold text-white mb-2">Standard Output:</h3>
            <pre className="bg-gray-800 p-2 rounded">{result.output}</pre>
          </>
        )}

        {/* Default message */}
        {!isLoading && !result && (
          <div>Console output will appear here after running your code.</div>
        )}
      </TabsContent>

      {/* --- Test Cases Tab (Placeholders) --- */}
      <TabsContent
        value="testcases"
        className="flex-1 overflow-auto p-3 text-sm text-gray-300"
      >
        {/* Placeholder: You would dynamically load test case details here */}
        Test cases will be shown here upon submission completion.
      </TabsContent>

      {/* --- Results Tab (Status and Summary) --- */}
      <TabsContent
        value="results"
        className="flex-1 overflow-auto p-3 text-sm"
      >
        {/* Display spinner when running/submitting */}
        {isLoading && (
          <div className="flex items-center space-x-2 text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Awaiting results...</span>
          </div>
        )}

        {/* Display submission result */}
        {!isLoading && result && (
          <div className="space-y-3">
            <h3 className="font-bold text-lg">
              Status: <span className={statusColor}>{result.status}</span>
            </h3>
            <p>{result.message}</p>
            
            {/* You can add more detailed result components here, e.g., a table showing test case pass/fail */}
            <div className="mt-4 p-3 bg-gray-800 rounded">
              <p className="text-xs text-gray-400">Detailed Report Placeholder</p>
            </div>
          </div>
        )}
        
        {/* Default message */}
        {!isLoading && !result && (
          <div>Submission results will be displayed here.</div>
        )}
      </TabsContent>
    </Tabs>
  );
}