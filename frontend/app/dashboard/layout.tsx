// app/dashboard/layout.tsx
'use client';

import useAuth from "@/hooks/useAuth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useAuth();
  return <div>{children}</div>;
}
