
import { TrendingUp, Star, History, Settings, BarChart3, Brain, User, LineChart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
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
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  favorites: string[];
  onSelectStock: (symbol: string) => void;
  selectedStock: string;
}

export function AppSidebar({ favorites, onSelectStock, selectedStock }: AppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      path: "/",
    },
    {
      title: "Markets",
      icon: LineChart,
      path: "/markets",
    },
    {
      title: "Analysis",
      icon: Brain,
      path: "/analysis",
    },
    {
      title: "Profile",
      icon: User,
      path: "/profile",
    },
    {
      title: "History",
      icon: History,
      path: "/history",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">Chronos</h1>
            <p className="text-sm text-sidebar-foreground/60">AI Predictions</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => navigate(item.path)}
                    isActive={location.pathname === item.path}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Favorites
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {favorites.map((symbol) => (
                <SidebarMenuItem key={symbol}>
                  <SidebarMenuButton 
                    onClick={() => onSelectStock(symbol)}
                    isActive={selectedStock === symbol}
                    className="justify-between"
                  >
                    <span className="font-mono font-semibold">{symbol}</span>
                    <TrendingUp className="h-3 w-3 text-profit" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-sidebar-foreground/40 text-center">
          AI-powered predictions
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
