
import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import { AdvancedAssetSearch } from '@/components/advanced-asset-search';
import { AdvancedChart } from '@/components/advanced-chart';
import { EnhancedStockCard } from '@/components/enhanced-stock-card';
import { PredictionHistory } from '@/components/prediction-history';
import { NewsSection } from '@/components/news-section';
import { PortfolioTracker } from '@/components/portfolio-tracker';
import { Leaderboard } from '@/components/leaderboard';
import { PremiumAnalytics } from '@/components/premium-analytics';
import { AlertsSystem } from '@/components/alerts-system';
import { AdvancedAnalytics } from '@/components/advanced-analytics';
import { SocialTrading } from '@/components/social-trading';
import { OptionsTrading } from '@/components/options-trading';
import { AlgorithmicTrading } from '@/components/algorithmic-trading';
import { EconomicCalendar } from '@/components/economic-calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Brain, User, BarChart3, Calendar, Bot, Users, Target } from 'lucide-react';

const Dashboard = () => {
  const [selectedAsset, setSelectedAsset] = useState('AAPL');
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar 
          favorites={favorites}
          onSelectStock={setSelectedAsset}
          selectedStock={selectedAsset}
        />
        <main className="flex-1 flex flex-col">
          <DashboardHeader />
          
          {/* Quick Navigation Bar */}
          <div className="p-4 border-b bg-muted/50">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/markets')}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Markets
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/analysis')}
                className="flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                Analysis
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Profile
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/features')}
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Features
              </Button>
            </div>
          </div>

          <div className="flex-1 p-6">
            <Tabs defaultValue="trading" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="trading">Trading</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
                <TabsTrigger value="algo">Algo Trading</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trading" className="space-y-6">
                <div className="grid lg:grid-cols-12 gap-6">
                  {/* Left Panel - Asset Search */}
                  <div className="lg:col-span-3 space-y-6">
                    <AdvancedAssetSearch 
                      onSelectAsset={setSelectedAsset}
                      selectedAsset={selectedAsset}
                    />
                    <AlertsSystem />
                  </div>
                  
                  {/* Main Panel - Charts and Analysis */}
                  <div className="lg:col-span-9 space-y-6">
                    <AdvancedChart symbol={selectedAsset} />
                    <div className="grid lg:grid-cols-2 gap-6">
                      <EnhancedStockCard symbol={selectedAsset} />
                      <NewsSection symbol={selectedAsset} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <AdvancedAnalytics />
                  <div className="space-y-6">
                    <PortfolioTracker />
                    <PremiumAnalytics />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <SocialTrading />
                  <div className="space-y-6">
                    <Leaderboard />
                    <PredictionHistory />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="options" className="space-y-6">
                <OptionsTrading />
              </TabsContent>

              <TabsContent value="algo" className="space-y-6">
                <AlgorithmicTrading />
              </TabsContent>

              <TabsContent value="calendar" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <EconomicCalendar />
                  <div className="space-y-6">
                    <AlertsSystem />
                    <NewsSection symbol={selectedAsset} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
