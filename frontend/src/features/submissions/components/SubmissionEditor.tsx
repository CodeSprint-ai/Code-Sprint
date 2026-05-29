import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
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
import { initSocket } from "@/lib/socket-io";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const DEFAULT_CODE: Record<string, string> = {
  javascript: `// write your code here\nconsole.log('hello world')`,
  python: `# write your code here\nprint('hello world')`,
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint main(){ cout<<"hello"; }`,
};

export default function SubmissionEditor({ problem }: any) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(DEFAULT_CODE["python"]);
  // const socket = initSocket();

  const { createSubmission } = useSubmission(problem?.uuid);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCode(DEFAULT_CODE[language] ?? "");
  }, [language]);

  // Use resolvedTheme with a fallback check for the .dark class
  const isDark = mounted 
    ? (resolvedTheme === 'dark' || (resolvedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches))
    : true; // Default to dark during SSR/initial mount

  const editorTheme = isDark ? "vs-dark" : "vs";

  const handleEditorBeforeMount = (monaco: any) => {
    // Re-define github-light just in case we want it
    monaco.editor.defineTheme('github-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a737d' },
        { token: 'keyword', foreground: 'd73a49' },
        { token: 'identifier', foreground: '6f42c1' },
        { token: 'string', foreground: '032f62' },
        { token: 'number', foreground: '005cc5' },
        { token: 'type', foreground: '005cc5' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#24292e',
        'editor.lineHighlightBackground': '#f6f8fa',
        'editorCursor.foreground': '#24292e',
        'editorIndentGuide.background': '#d1d5da',
        'editor.selectionBackground': '#0366d625',
        'editor.inactiveSelectionBackground': '#0366d615',
      }
    });
  };

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

  if (!mounted) {
    return <div className="h-[520px] w-full dark:bg-[#1e1e1e] bg-white border rounded-md" />;
  }

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
          key={editorTheme}
          height="100%"
          defaultLanguage={language}
          language={language}
          value={code}
          theme={editorTheme}
          beforeMount={handleEditorBeforeMount}
          onChange={(val) => setCode(val ?? "")}
          options={{ minimap: { enabled: false }, fontSize: 14 }}
        />
      </div>
    </div>
  );
}
