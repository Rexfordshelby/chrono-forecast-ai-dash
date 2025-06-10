
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Star, RefreshCw, Activity } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useRealTimeStock } from '@/hooks/useRealTimeStock';
import { useLanguage } from '@/contexts/LanguageContext';
import { PredictionVoting } from './prediction-voting';

interface EnhancedStockCardProps {
  symbol: string;
}

export function EnhancedStockCard({ symbol }: EnhancedStockCardProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const { data: stockData, loading, error } = useRealTimeStock(symbol);
  const { t } = useLanguage();

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded animate-pulse"></div>
          <div className="h-24 bg-muted rounded animate-pulse"></div>
          <div className="h-16 bg-muted rounded animate-pulse"></div>
          <div className="text-center text-muted-foreground">
            <Activity className="h-6 w-6 mx-auto mb-2 animate-spin" />
            <p>{t('common.loading')}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error || !stockData) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p>{t('common.error')}: Failed to load stock data</p>
          <Button variant="outline" className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('common.retry')}
          </Button>
        </div>
      </Card>
    );
  }

  const priceColor = stockData.change >= 0 ? 'text-profit' : 'text-loss';
  const isRealTime = Date.now() - stockData.timestamp < 60000; // Less than 1 minute old

  return (
    <Card className="p-6 card-glow">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold font-mono">{stockData.symbol}</h3>
              <Badge variant={isRealTime ? "default" : "secondary"} className="text-xs">
                {isRealTime ? "LIVE" : "DELAYED"}
              </Badge>
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
            <div className="text-sm text-muted-foreground mt-1">
              Last updated: {new Date(stockData.timestamp).toLocaleTimeString()}
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
            <p className="text-sm text-muted-foreground">{t('stock.volume')}</p>
            <p className="font-semibold">{stockData.volume.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">24h Range</p>
            <p className="font-semibold text-sm">
              ${(stockData.price * 0.95).toFixed(2)} - ${(stockData.price * 1.05).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Real-time Indicator */}
        <div className="flex items-center justify-center gap-2 p-2 bg-muted/50 rounded-lg">
          <div className={`w-2 h-2 rounded-full ${isRealTime ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
          <span className="text-xs text-muted-foreground">
            {isRealTime ? 'Real-time data' : 'Delayed data'}
          </span>
        </div>
      </div>
    </Card>
  );
}
