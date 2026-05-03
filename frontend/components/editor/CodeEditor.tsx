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
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the current effective theme
  const currentTheme = theme === "system" ? systemTheme : theme;
  const editorTheme = currentTheme === "light" ? "vs" : "vs-dark";

  // Prevent hydration mismatch by rendering a skeleton or waiting for mount
  if (!mounted) {
    return <div className="h-full w-full dark:bg-[#1e1e1e] bg-white" />;
  }

  return (
    <div className="h-full w-full">
      <MonacoEditor
        language={language}
        value={code}
        theme={editorTheme}
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
