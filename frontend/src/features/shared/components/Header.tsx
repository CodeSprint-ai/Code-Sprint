"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, LogOut, Menu, User, Flame } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useSidebar } from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ThemeToggle } from "./ThemeToggle";
import { getDashboardStats } from "@/features/dashboard/api/dashboard.api";
import { toast } from "sonner";
const titles: Record<string, string> = {
  dashboard: "Overview",
  problems: "Problem bank",
  submission: "Submissions",
  roadmap: "Learning roadmap",
  sprint: "Coding sprints",
  contest: "Contest calendar",
  profile: "Profile",
  usage: "AI usage",
  admin: "Support inbox",
};
function AccountAvatar({ url, name }: { url?: string; name?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="app-avatar">
      {url && !failed ? (
        <Image
          src={url}
          alt=""
          fill
          sizes="32px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span>{name?.charAt(0).toUpperCase() || "U"}</span>
      )}
    </span>
  );
}
export default function Header() {
  const { logout } = useAuth();
  const user = useAuthStore((state) => state.user);
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const stats = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    enabled: !!user,
    staleTime: 60000,
  });
  return (
    <header className="app-header">
      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="rounded p-1.5 text-muted-foreground hover:bg-muted"
        >
          <Menu size={18} />
        </button>
        <span className="app-header-title truncate">
          {titles[pathname.split("/")[1]] || "Workspace"}
          {pathname.startsWith("/problems/") &&
            pathname !== "/problems/add" && (
              <span className="ml-2 text-muted-foreground">
                / Coding workspace
              </span>
            )}
        </span>
      </div>
      <div className="app-header-actions">
        {stats.data && (
          <div className="app-streak">
            <Flame size={14} strokeWidth={1.5} />
            <span>{stats.data.currentStreak}-day streak</span>
          </div>
        )}
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="app-profile"
              aria-label="Open account menu"
            >
              <AccountAvatar
                key={user?.avatarUrl}
                url={user?.avatarUrl}
                name={user?.name}
              />
              <span className="hidden sm:inline">
                {user?.name || "Account"}
              </span>
              <ChevronDown size={12} className="text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-60 rounded-md p-1.5 shadow-md"
          >
            <div className="px-2 py-3">
              <p className="text-sm font-medium">
                {user?.name || "Your account"}
              </p>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User size={15} />
                Profile & settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/usage">AI allowance</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                void logout().catch(() =>
                  toast.error("Could not sign out. Please retry."),
                );
              }}
            >
              <LogOut size={15} />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
