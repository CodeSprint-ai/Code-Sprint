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
    url: "/submission",
    icon: FileText,
  },
  {
    title: "Problems",
    url: "/problems",
    icon: BookOpen,
  },
  {
    title: "Contest",
    url: "/contest",
    icon: Trophy,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];

export function Sidebar() {
  const { state } = useSidebar();

  return (
    <ShadSidebar collapsible="icon" className="static h-full" >
      <SidebarContent>
        <SidebarGroup>
          
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
