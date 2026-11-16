"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { secondaryClass } from "./PublicShell";
export function CookieControls() {
  const { setTheme } = useTheme();
  const [message, setMessage] = useState("");
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">Essential storage</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Sign-in, session continuity, and security. Required for account
            features.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-700 dark:text-emerald-400">
          Always active
        </span>
      </div>
      <div>
        <h3 className="font-semibold">Optional analytics and advertising</h3>
        <p className="mt-1 text-sm text-zinc-500">
          No optional analytics or advertising integration is enabled by this
          beta setup. There is no consent switch for a category that is not in
          use. Any future integration must respect an updated choice before
          loading.
        </p>
      </div>
      <button
        type="button"
        className={secondaryClass}
        onClick={() => {
          setTheme("system");
          setMessage("Appearance preference reset to your device setting.");
        }}
      >
        Use device appearance
      </button>
      <p
        role="status"
        className="text-sm text-emerald-700 dark:text-emerald-400"
      >
        {message}
      </p>
    </div>
  );
}
