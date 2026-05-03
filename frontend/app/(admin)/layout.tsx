// app/(admin)/layout.tsx
"use client";

import Header from "@/components/Dashboard/Header";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div
        className="flex h-screen w-full dark:text-slate-200 text-zinc-800 font-sans dark:selection:bg-green-500/30 dark:selection:text-green-200 selection:bg-green-500/20 selection:text-green-700"
        style={{
          backgroundColor: 'var(--color-brand-dark)',
          backgroundImage: `
            radial-gradient(circle at 70% -20%, rgba(34, 197, 94, 0.12), transparent 50%),
            linear-gradient(to bottom, var(--grid-line-color) 1px, transparent 1px),
            linear-gradient(to right, var(--grid-line-color) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
          backgroundAttachment: 'fixed'
        }}
      >
        <Sidebar />

        <main className="flex-1 flex flex-col min-h-screen relative z-0 overflow-hidden">
          <Header />

          <div className="flex-1 overflow-x-hidden overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
