
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Star, RefreshCw } from 'lucide-react';
import { fetchEnhancedAssetData } from '@/lib/enhanced-api';
import { useFavorites } from '@/hooks/useFavorites';
import { PredictionVoting } from './prediction-voting';

interface EnhancedStockCardProps {
  symbol: string;
}

export function EnhancedStockCard({ symbol }: EnhancedStockCardProps) {
  const { favorites, toggleFavorite } = useFavorites();
  
  const { data: stockData, isLoading, error, refetch } = useQuery({
    queryKey: ['enhanced-stock', symbol],
    queryFn: () => fetchEnhancedAssetData(symbol),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded animate-pulse"></div>
          <div className="h-24 bg-muted rounded animate-pulse"></div>
          <div className="h-16 bg-muted rounded animate-pulse"></div>
        </div>
      </Card>
    );
  }

  if (error || !stockData) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p>Failed to load stock data</p>
          <Button variant="outline" onClick={() => refetch()} className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  const priceColor = stockData.change >= 0 ? 'text-profit' : 'text-loss';

  return (
    <Card className="p-6 card-glow">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold font-mono">{stockData.symbol}</h3>
              <Badge variant="secondary">{stockData.name}</Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-bold">${stockData.price.toFixed(2)}</span>
              <div className={`flex items-center gap-1 ${priceColor}`}>
                {stockData.change >= 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                <span className="font-semibold">
                  ${Math.abs(stockData.change).toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
          
          <Button
            variant={favorites.includes(symbol) ? "default" : "outline"}
            size="icon"
            onClick={() => toggleFavorite(symbol)}
          >
            <Star className={`h-4 w-4 ${favorites.includes(symbol) ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Community Voting */}
        <PredictionVoting symbol={symbol} />

        {/* Market Data */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Volume</p>
            <p className="font-semibold">{stockData.volume.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Market Cap</p>
            <p className="font-semibold">
              {stockData.marketCap ? `$${(stockData.marketCap / 1e9).toFixed(1)}B` : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
