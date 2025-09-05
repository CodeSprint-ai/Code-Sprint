"use client";

export default function SystemThemeTest() {
  return (
    <div className="p-4 m-4 rounded-md border" style={{
      backgroundColor: 'var(--background)',
      color: 'var(--foreground)'
    }}>
      System theme test: box changes with system theme!
    </div>
  );
}
