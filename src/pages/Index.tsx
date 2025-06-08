
import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import { StockSearch } from '@/components/stock-search';
import { EnhancedStockCard } from '@/components/enhanced-stock-card';
import { PredictionHistory } from '@/components/prediction-history';
import { NewsSection } from '@/components/news-section';
import { useFavorites } from '@/hooks/useFavorites';

const Index = () => {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const { favorites } = useFavorites();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar 
          favorites={favorites}
          onSelectStock={setSelectedStock}
          selectedStock={selectedStock}
        />
        <main className="flex-1 flex flex-col">
          <DashboardHeader />
          <div className="flex-1 p-6 space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 space-y-6">
                <StockSearch 
                  onSelectStock={setSelectedStock}
                  selectedStock={selectedStock}
                />
                <EnhancedStockCard symbol={selectedStock} />
                <NewsSection symbol={selectedStock} />
              </div>
              <div className="lg:w-80">
                <PredictionHistory />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
