// app/dashboard/layout.tsx
"use client";

import Header from "@/components/Dashboard/Header";
import DashboardMenu from "@/components/DashboardMenu";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
// import useAuth from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // useAuth();
  return (
    // <SidebarProvider>
    //   <div className="flex flex-col lg:h-screen">
    //     <Header />
    //     <div className="flex flex-1">
    //       <Sidebar />
    //       <main className="flex flex-col flex-1 border ">
    //         <SidebarTrigger />
    //         {children}
    //       </main>
    //     </div>
    //   </div>
    // </SidebarProvider>

    <SidebarProvider>
      <div className="flex flex-col h-screen w-full">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex flex-col flex-1 min-w-0 border overflow-hidden">


            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
