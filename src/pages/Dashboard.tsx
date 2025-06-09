
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFavorites } from '@/hooks/useFavorites';

const Dashboard = () => {
  const [selectedAsset, setSelectedAsset] = useState('AAPL');
  const { favorites } = useFavorites();

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
          <div className="flex-1 p-6">
            <Tabs defaultValue="trading" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="trading">Trading</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
                <TabsTrigger value="premium">Premium</TabsTrigger>
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
              
              <TabsContent value="portfolio" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <PortfolioTracker />
                  <div className="space-y-6">
                    <AlertsSystem />
                    <div className="lg:block hidden">
                      <Leaderboard />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="community" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Leaderboard />
                  <div className="space-y-6">
                    <PredictionHistory />
                    <EnhancedStockCard symbol={selectedAsset} />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="premium" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <PremiumAnalytics />
                  <div className="space-y-6">
                    <PortfolioTracker />
                    <AlertsSystem />
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
