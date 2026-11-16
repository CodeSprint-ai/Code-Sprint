"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Braces } from "lucide-react";
const samples = {
  Python: [
    "class Solution:",
    "    def twoSum(self, nums, target):",
    "        # Find two distinct indices",
    "        # whose values add to target.",
    "",
    "        # Your approach starts here.",
    "        pass",
  ],
  Java: [
    "class Solution {",
    "    public int[] twoSum(",
    "        int[] nums, int target) {",
    "        // Work through your approach.",
    "        return new int[]{};",
    "    }",
    "}",
  ],
  "C++": [
    "class Solution {",
    "public:",
    "    vector<int> twoSum(",
    "        vector<int>& nums, int target) {",
    "        // Work through your approach.",
    "        return {};",
    "    }",
    "};",
  ],
} as const;
export function WorkspacePreview() {
  const [language, setLanguage] = useState<keyof typeof samples>("Python");
  return (
    <figure>
      <div className="m-preview">
        <div className="m-preview-top">
          <span>
            <strong>Workspace</strong> / two-sum
          </span>
          <Braces size={15} />
        </div>
        <div className="m-preview-body">
          <div className="m-code-editor">
            <div className="m-language-tabs" aria-label="Preview language">
              {(Object.keys(samples) as (keyof typeof samples)[]).map(
                (name) => (
                  <button
                    type="button"
                    key={name}
                    aria-pressed={language === name}
                    onClick={() => setLanguage(name)}
                  >
                    {name}
                  </button>
                ),
              )}
            </div>
            <pre
              className="m-code-lines"
              aria-label={`${language} starter code`}
            >
              <code>
                {samples[language].map((line, index) => (
                  <span
                    key={index}
                    className={`m-code-line ${line.includes("#") || line.includes("//") ? "m-code-comment" : ""}`}
                  >
                    <span className="m-line-number" aria-hidden="true">
                      {index + 1}
                    </span>
                    {line || " "}
                  </span>
                ))}
              </code>
            </pre>
          </div>
          <aside className="m-preview-aside">
            <p className="m-small-label">Thinking direction</p>
            <h3>Start with what you know.</h3>
            <p>
              For each number, what other value would you need to reach the
              target?
            </p>
            <p>A small nudge to help you find your own approach.</p>
            <Link href="/platform/ai-tutor">
              How hints work
              <ArrowUpRight size={12} />
            </Link>
          </aside>
        </div>
        <div className="m-preview-bottom">
          <span>
            Two Sum <span className="m-muted">/ Arrays</span>
          </span>
          <span>Python · Java · C++</span>
        </div>
      </div>
      <figcaption className="m-preview-caption">
        Workspace preview. Choose a language to explore the starter code.
      </figcaption>
    </figure>
  );
}
