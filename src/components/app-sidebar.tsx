
import { TrendingUp, Star, History, Settings, BarChart3 } from 'lucide-react';
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
  const menuItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      action: () => {},
    },
    {
      title: "History",
      icon: History,
      action: () => {},
    },
    {
      title: "Settings",
      icon: Settings,
      action: () => {},
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
                  <SidebarMenuButton onClick={item.action}>
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
