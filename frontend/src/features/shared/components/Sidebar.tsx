"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileCode,
  ListTodo,
  Trophy,
  User,
  Terminal,
  LogOut,
  Timer,
  Map,
  Gauge,
  Inbox,
  HelpCircle,
} from "lucide-react";
import {
  Sidebar as ShadSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarFooter,
} from "./ui/sidebar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRole } from "@/features/shared/hooks/useRole";
import { useMounted } from "@/features/shared/hooks/useMounted";
import { toast } from "sonner";
const routes = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Problem bank", url: "/problems", icon: ListTodo },
  { title: "Submissions", url: "/submission", icon: FileCode },
  { title: "Learning roadmap", url: "/roadmap", icon: Map },
  { title: "Coding sprints", url: "/sprint", icon: Timer },
  { title: "Contest calendar", url: "/contest", icon: Trophy },
  { title: "AI usage", url: "/usage", icon: Gauge },
  { title: "Profile", url: "/profile", icon: User },
];
export function Sidebar() {
  const { state } = useSidebar();
  const pathname = usePathname();
  const { logout, isLoading } = useAuth();
  const { isAdmin } = useRole();
  const mounted = useMounted();
  const expanded = state === "expanded";
  const items = [
    ...routes,
    ...(mounted && isAdmin
      ? [{ title: "Support inbox", url: "/admin/inbox", icon: Inbox }]
      : []),
  ];
  return (
    <ShadSidebar
      collapsible="icon"
      className="border-r border-border bg-background"
    >
      <SidebarHeader className="h-16 justify-center border-b border-border px-4">
        <Link
          href="/dashboard"
          className="app-navigation-brand"
          aria-label="CodeSprint dashboard"
        >
          <Terminal size={22} strokeWidth={1.6} />
          {expanded && <span>CodeSprint</span>}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-3 pt-6">
          <SidebarGroupLabel
            className={
              expanded
                ? "mb-2 px-2 text-[10px] font-medium tracking-wider text-muted-foreground uppercase"
                : "sr-only"
            }
          >
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={
                      pathname === item.url ||
                      pathname.startsWith(item.url + "/")
                    }
                    className="app-navigation-link"
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 px-3"
                    >
                      <item.icon size={17} strokeWidth={1.6} />
                      <span className="text-xs">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-2 border-t border-border p-3">
        {expanded && (
          <div className="px-3 pb-3 pt-2">
            <p className="text-xs font-medium">Free Beta</p>
            <Link
              href="/usage"
              className="mt-1 block text-[11px] text-muted-foreground hover:underline"
            >
              View your AI allowance
            </Link>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Help & feedback"
              className="app-navigation-link"
            >
              <Link href="/contact">
                <HelpCircle size={17} />
                <span className="text-xs">Help & feedback</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              disabled={isLoading}
              onClick={() => {
                void logout().catch(() =>
                  toast.error("Could not sign out. Please retry."),
                );
              }}
              className="app-navigation-link"
            >
              <LogOut size={17} />
              <span className="text-xs">Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadSidebar>
  );
}
