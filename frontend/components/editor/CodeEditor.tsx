"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface Props {
  language: string;
  code: string;
  setCode: (value: string) => void;
}

export default function CodeEditor({ language, code, setCode }: Props) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // resolvedTheme is the final computed theme (handles "system" internally)
  const editorTheme = resolvedTheme === "light" ? "github-light" : "vs-dark";

  const handleEditorBeforeMount = (monaco: any) => {
    // Define github-light theme
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

  if (!mounted) {
    return <div className="h-full w-full bg-white dark:bg-[#1e1e1e]" />;
  }

  return (
    <div className="h-full w-full">
      <MonacoEditor
        key={editorTheme}
        language={language}
        value={code}
        theme={editorTheme}
        beforeMount={handleEditorBeforeMount}
        onChange={(val) => setCode(val ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          smoothScrolling: true,
        }}
        height="100%"
      />
    </div>
  );
}
