
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/language-selector';
import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';

export function DashboardHeader() {
  const { logout } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 border-b">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <div className="h-6 w-px bg-border" />
        <h1 className="font-semibold">AI Stock Predictor Pro</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <LanguageSelector />
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}
