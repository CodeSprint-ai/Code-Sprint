import { PublicShell } from "@/features/marketing/PublicShell";
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicShell>{children}</PublicShell>;
}
