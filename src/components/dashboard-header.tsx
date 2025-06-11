
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/language-selector';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DashboardHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored auth data
    localStorage.removeItem('auth');
    navigate('/auth');
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 border-b">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <div className="h-6 w-px bg-border" />
        <h1 className="font-semibold">AI Stock Predictor Pro</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <LanguageSelector />
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}
