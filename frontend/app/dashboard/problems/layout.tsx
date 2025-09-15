// app/dashboard/layout.tsx
"use client";

import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import useAuth from "@/hooks/useAuth";

export default function ProblemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // useAuth();
  return (
      <main>
        {children}
      </main>
  );
}
