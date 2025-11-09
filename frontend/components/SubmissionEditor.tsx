import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useSubmission } from "@/hooks/useSubmission";
import useSocket from "@/lib/socket-io";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const DEFAULT_CODE: Record<string, string> = {
  javascript: `// write your code here\nconsole.log('hello world')`,
  python: `# write your code here\nprint('hello world')`,
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint main(){ cout<<"hello"; }`,
};

export default function SubmissionEditor({ problem }: any) {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(DEFAULT_CODE["python"]);
  const socket = useSocket();

  const { createSubmission } = useSubmission(problem?.uuid);

  useEffect(() => {
    setCode(DEFAULT_CODE[language] ?? "");
  }, [language]);

  const handleSubmit = async () => {
    try {
      const resp = await createSubmission({
        code,
        language,
        problemUuid: problem.uuid,
        slug: problem.slug,
      });
      console.log("✅ Submitted successfully:", resp);
    } catch (error) {
      console.error("❌ Submission failed:", error);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* ✅ Correct Select Structure */}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
            </SelectContent>
          </Select>

          <span className="text-sm text-muted-foreground">
            Selected: {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setCode(DEFAULT_CODE[language] ?? "")}
          >
            Reset
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>

      <div className="h-[520px] border rounded-md overflow-hidden">
        <MonacoEditor
          height="100%"
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={(val) => setCode(val ?? "")}
          options={{ minimap: { enabled: false }, fontSize: 14 }}
        />
      </div>
    </div>
  );
}
