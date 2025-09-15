import {
  Sidebar as ShadSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Home, FileText, BookOpen, Trophy, User, CodeXml } from "lucide-react";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Submission",
    url: "/dashboard/submission",
    icon: FileText,
  },
  {
    title: "Problems",
    url: "/dashboard/problems",
    icon: BookOpen,
  },
  {
    title: "Contest",
    url: "/dashboard/contest",
    icon: Trophy,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
];

export function Sidebar() {
  const { state } = useSidebar();

  return (
    <ShadSidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className={`flex  ${state === "expanded" ? "space-x-4 p-4" : "pl-1 py-2"} `}>
            <CodeXml />
            {state === "expanded" && <span>Code Sprint</span>}
          </div>
          <SidebarGroupLabel className="px-4">Tabs</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="h-14" asChild>
                    <a href={item.url} className="p-4">
                      <item.icon size={300} className="h-16" />
                      <span>{item.title}</span>
                    </a>
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
