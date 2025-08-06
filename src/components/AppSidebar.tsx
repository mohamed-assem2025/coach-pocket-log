import { BarChart3, Users, Calendar, CreditCard, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  currentView: string;
  onViewDashboard: () => void;
  onViewClients: () => void;
  onSignOut: () => void;
}

const navigationItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    view: "dashboard",
  },
  {
    title: "Clients",
    icon: Users,
    view: "clients",
  },
];

export function AppSidebar({ currentView, onViewDashboard, onViewClients, onSignOut }: AppSidebarProps) {
  const handleItemClick = (view: string) => {
    if (view === "dashboard") {
      onViewDashboard();
    } else if (view === "clients") {
      onViewClients();
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="px-3 py-2">
          <h2 className="text-lg font-semibold">Coaching App</h2>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.view}>
                  <SidebarMenuButton
                    onClick={() => handleItemClick(item.view)}
                    isActive={currentView === item.view}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onSignOut}>
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}