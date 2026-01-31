// app/(user)/layout.tsx
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
        className="flex h-screen w-full text-slate-200 font-sans selection:bg-green-500/30 selection:text-green-200"
        style={{
          backgroundColor: '#020202',
          backgroundImage: `
            radial-gradient(circle at 50% -20%, rgba(34, 197, 94, 0.25), transparent 40%),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px)
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
