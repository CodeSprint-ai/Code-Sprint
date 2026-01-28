// app/dashboard/layout.tsx
"use client";

import Header from "@/components/Dashboard/Header";
import DashboardMenu from "@/components/old-landing-page-component/DashboardMenu";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import useAuth from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // useAuth();
  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex flex-col flex-1 min-w-0 border overflow-hidden">

            {/* <SidebarTrigger /> */}
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
