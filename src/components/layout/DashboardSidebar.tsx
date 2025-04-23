
import { useLocation, Link } from "react-router-dom";
import {
  ChartBar,
  LayoutDashboard,
  LayoutGrid,
  LayoutList,
  ChartGantt,
  Clock,
  FileText,
  MessageSquare,
  BookOpen,
  Users,
  Settings,
  LogOut
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

interface DashboardSidebarProps {
  organizationName?: string;
  plan?: string;
  onLogout?: () => void;
}

export function DashboardSidebar({
  organizationName = "Organization",
  plan = "Free",
  onLogout
}: DashboardSidebarProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard"
    },
    {
      title: "Kanban",
      icon: LayoutGrid,
      path: "/kanban"
    },
    {
      title: "Gantt",
      icon: ChartGantt,
      path: "/gantt"
    },
    {
      title: "Tasks",
      icon: LayoutList,
      path: "/tasks"
    },
    {
      title: "Time",
      icon: Clock,
      path: "/time-tracking"
    },
    {
      title: "Files",
      icon: FileText,
      path: "/files"
    },
    {
      title: "Chat",
      icon: MessageSquare,
      path: "/chat"
    },
    {
      title: "Notes",
      icon: BookOpen,
      path: "/notes"
    },
    {
      title: "Team",
      icon: Users,
      path: "/team"
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings"
    }
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="text-xl font-bold">{organizationName}</div>
          <div className="text-sm text-muted-foreground">{plan} Plan</div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild
                  isActive={isActive(item.path)}
                  tooltip={item.title}
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {onLogout && (
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={onLogout}
                  tooltip="Logout"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
