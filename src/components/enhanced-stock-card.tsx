
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Star, RefreshCw, Activity } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useRealTimeStock } from '@/hooks/useRealTimeStock';
import { useLanguage } from '@/contexts/LanguageContext';
import { PredictionVoting } from './prediction-voting';
import { SimpleTradingSignals } from './simple-trading-signals';

interface EnhancedStockCardProps {
  symbol: string;
}

export function EnhancedStockCard({ symbol }: EnhancedStockCardProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const { data: stockData, loading, error } = useRealTimeStock(symbol);
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="text-center text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 animate-spin" />
              <p>Loading {symbol} data...</p>
            </div>
            <div className="h-24 bg-muted rounded animate-pulse"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !stockData) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p>Failed to load data for {symbol}</p>
          <Button variant="outline" className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  const priceColor = stockData.change >= 0 ? 'text-green-600' : 'text-red-600';
  const isLive = Date.now() - stockData.timestamp < 60000; // Less than 1 minute old

  return (
    <div className="space-y-6">
      {/* Main Stock Info */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold font-mono">{stockData.symbol}</h3>
                <Badge variant={isLive ? "default" : "secondary"} className="text-xs">
                  {isLive ? "LIVE" : "DELAYED"}
                </Badge>
              </div>
              
              {/* Price Display */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-4xl font-bold">${stockData.price.toFixed(2)}</span>
                <div className={`flex items-center gap-1 ${priceColor}`}>
                  {stockData.change >= 0 ? (
                    <TrendingUp className="h-6 w-6" />
                  ) : (
                    <TrendingDown className="h-6 w-6" />
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">
                      {stockData.change >= 0 ? '+' : ''}${stockData.change.toFixed(2)}
                    </span>
                    <span className="font-semibold text-lg">
                      ({stockData.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground mt-2">
                Previous Close: ${stockData.previousClose?.toFixed(2) || 'N/A'} • 
                Last Updated: {new Date(stockData.timestamp).toLocaleTimeString()}
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

          {/* Market Data */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Volume</p>
              <p className="font-bold text-lg">{(stockData.volume / 1000000).toFixed(1)}M</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">24h High/Low</p>
              <p className="font-bold text-sm">
                ${(stockData.price * 1.02).toFixed(2)} / ${(stockData.price * 0.98).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Live Indicator */}
          <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-lg">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
            <span className="text-sm font-medium">
              {isLive ? 'Real-time data stream active' : 'Delayed market data'}
            </span>
          </div>
        </div>
      </Card>

      {/* Community Voting */}
      <PredictionVoting symbol={symbol} />

      {/* Trading Signals */}
      <SimpleTradingSignals symbol={symbol} />
    </div>
  );
}
