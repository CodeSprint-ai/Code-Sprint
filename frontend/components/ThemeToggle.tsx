"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const toggleTheme = (e: React.MouseEvent) => {
    let nextTheme = "system";
    if (theme === "system") nextTheme = "light";
    else if (theme === "light") nextTheme = "dark";
    else if (theme === "dark") nextTheme = "system";

    // @ts-ignore - View Transitions API
    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // @ts-ignore
    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: theme === "dark" ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 1000,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: theme === "dark"
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full border border-border p-2 hover:bg-accent transition-colors cursor-pointer"
      aria-label="Toggle theme"
      id="theme-toggle"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-foreground" />
      ) : theme === "light" ? (
        <Moon className="h-4 w-4 text-foreground" />
      ) : (
        <Monitor className="h-4 w-4 text-foreground" />
      )}
    </button>
  );
}
