import "@/features/marketing/marketing.css";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="marketing-site marketing-auth">{children}</div>;
}
