"use client";
import Header from "@/features/shared/components/Header";
import { Sidebar } from "@/features/shared/components/Sidebar";
import { SidebarProvider } from "@/features/shared/components/ui/sidebar";
import "@/features/marketing/marketing.css";
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="product-app flex h-screen w-full overflow-hidden">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          <Header />
          <div className="flex-1 overflow-x-hidden overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
