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
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import {
  Home,
  FileText,
  BookOpen,
  Trophy,
  User,
  LucideIcon,
} from "lucide-react";

// Define route type
type RouteItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

// Menu items.
const userRoutes: RouteItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Submission", url: "/submission", icon: FileText },
  { title: "Problems", url: "/problems", icon: BookOpen },
  { title: "Contest", url: "/contest", icon: Trophy },
  { title: "Profile", url: "/profile", icon: User },
];

const adminRoutes: RouteItem[] = [
  { title: "Dashboard", url: "/admin/dashboard", icon: Home },
  { title: "Submission", url: "/admin/submission", icon: FileText },
  { title: "Problems", url: "/admin/problems", icon: BookOpen },
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

console.log({user});


  return (
    <ShadSidebar collapsible="icon" className="static h-full">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4">Tabs</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {assignedRoleRoutes(user?.role).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="h-14" asChild>
                    <Link href={item.url} className="p-4">
                      <item.icon size={300} className="h-16" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </ShadSidebar>
  );
}
