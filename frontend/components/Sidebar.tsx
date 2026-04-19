"use client";

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
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileCode,
  ListTodo,
  Trophy,
  User,
  LucideIcon,
  Terminal,
  LogOut,
  Zap,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define route type
type RouteItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

// Menu items.
const userRoutes: RouteItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Roadmap", url: "/roadmap", icon: Sparkles },
  { title: "Sprint Mode", url: "/sprint", icon: Zap },
  { title: "Problems", url: "/problems", icon: ListTodo },
  { title: "Submissions", url: "/submission", icon: FileCode },
  { title: "Contest", url: "/contest", icon: Trophy },
  { title: "Profile", url: "/profile", icon: User },
];

const adminRoutes: RouteItem[] = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Roadmap", url: "/roadmap", icon: Sparkles },
  { title: "Sprint Mode", url: "/admin/sprint", icon: Zap },
  { title: "Problems", url: "/admin/problems", icon: ListTodo },
  { title: "Submissions", url: "/admin/submission", icon: FileCode },
  { title: "Contest", url: "/admin/contest", icon: Trophy },
  { title: "Profile", url: "/admin/profile", icon: User },
];

const assignedRoleRoutes = (role: string | undefined): RouteItem[] => {
  if (!role) return [];

  const roleRoutes: Record<string, RouteItem[]> = {
    ADMIN: adminRoutes,
    USER: userRoutes,
  };

  return roleRoutes[role] ?? [];
};

export function Sidebar() {
  const { state } = useSidebar();
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const pathname = usePathname();
  const isExpanded = state === "expanded";

  const isActive = (url: string) => {
    if (url.includes("?")) {
      return pathname === url.split("?")[0];
    }
    return pathname === url || pathname?.startsWith(url + "/");
  };

  return (
    <ShadSidebar
      collapsible="icon"
      className="bg-black/80 backdrop-blur-xl border-r border-white/5 shadow-[5px_0_30px_-5px_rgba(0,0,0,0.8)] relative overflow-hidden"
    >
      {/* Green gradient overlay to blend with main content */}
      <div
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 100% -30%, rgba(34, 197, 94, 0.15), transparent 70%)'
        }}
      />

      {/* Brand Header */}
      <SidebarHeader className="h-24 flex items-center px-4 pt-4 relative overflow-hidden">
        {/* Glow behind logo */}
        <div className="absolute top-1/2 left-6 w-10 h-10 bg-green-500/40 blur-[30px] rounded-full pointer-events-none" />

        <div className="flex items-center gap-3 group cursor-pointer relative z-10">
          <div className="relative flex items-center justify-center w-10 h-10 bg-black border border-green-500/30 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.3)] group-hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] transition-all duration-300">
            <Terminal className="text-green-400 w-5 h-5 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-black rounded-full flex items-center justify-center border border-green-500/30">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_#4ade80]" />
            </div>
          </div>
          {isExpanded && (
            <div className="animate-fade-in">
              <span className="block text-lg font-bold tracking-tight text-white leading-none drop-shadow-md">
                CodeSprint
              </span>
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest bg-green-500/10 px-1.5 py-0.5 rounded mt-1 inline-block border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                AI Powered
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel
            className={cn(
              "text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4 px-2 font-mono",
              !isExpanded && "sr-only"
            )}
          >
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {assignedRoleRoutes(user?.role).map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        "h-12 rounded-xl transition-all duration-300 relative overflow-hidden border",
                        active
                          ? "bg-green-500/10 text-white border-green-500/40 shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)]"
                          : "text-zinc-500 border-transparent hover:text-zinc-200 hover:bg-white/[0.03] hover:border-white/5"
                      )}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-3">
                        {/* Active indicator bar */}
                        {active && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 shadow-[0_0_10px_#22c55e]" />
                        )}
                        <item.icon
                          className={cn(
                            "w-[18px] h-[18px] transition-all duration-300",
                            active
                              ? "text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                              : "text-zinc-500 group-hover:text-zinc-300"
                          )}
                        />
                        <span
                          className={cn(
                            "font-medium relative z-10",
                            active && "text-shadow-sm"
                          )}
                        >
                          {item.title}
                        </span>
                        {/* Active sparkle */}
                        {active && isExpanded && (
                          <Sparkles className="w-3 h-3 text-green-400 absolute right-3 opacity-80 animate-pulse drop-shadow-[0_0_5px_rgba(34,197,94,1)]" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Actions */}
      <SidebarFooter className="p-4">
        {/* Pro Plan Card */}
        {isExpanded && (
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-xl p-4 border border-white/10 mb-4 group hover:border-green-500/30 transition-all cursor-pointer relative overflow-hidden shadow-lg animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {/* Shine line */}
            <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />

            <h4 className="text-xs font-bold text-white mb-1 relative z-10 drop-shadow-md">
              Pro Plan
            </h4>
            <p className="text-[10px] text-zinc-500 mb-3 relative z-10">
              Unlock advanced AI analysis
            </p>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
              <div className="w-3/4 h-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={async () => await logout()}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-400 transition-colors text-xs font-bold hover:bg-red-950/20 rounded-xl group border border-transparent hover:border-red-500/20 hover:shadow-[0_0_15px_-5px_rgba(239,68,68,0.3)]",
            !isExpanded && "justify-center px-0"
          )}
        >
          <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          {isExpanded && <span>Terminate Session</span>}
        </button>
      </SidebarFooter>
    </ShadSidebar>
  );
}
