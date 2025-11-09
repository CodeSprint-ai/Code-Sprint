"use client";

import dynamic from "next/dynamic";
import React from "react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface Props {
  language: string;
  code: string;
  setCode: (value: string) => void;
}

export default function CodeEditor({ language, code, setCode }: Props) {
  return (
    <div className="h-full w-full">
      <MonacoEditor
        height="100%"
        width="100%"
        language={language}
        value={code}
        theme="vs-dark"
        onChange={(val) => setCode(val ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          smoothScrolling: true,
        }}
      />
    </div>
  );
}
