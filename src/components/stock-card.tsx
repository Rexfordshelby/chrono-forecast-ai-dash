
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { PredictionVoting } from '@/components/prediction-voting';
import { fetchStockData, generateAIPrediction } from '@/lib/api';

interface StockCardProps {
  symbol: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function StockCard({ symbol, isFavorite, onToggleFavorite }: StockCardProps) {
  const [prediction, setPrediction] = useState<any>(null);

  const { data: stockData, isLoading, error } = useQuery({
    queryKey: ['stock', symbol],
    queryFn: () => fetchStockData(symbol),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  useEffect(() => {
    if (stockData) {
      const aiPrediction = generateAIPrediction(stockData);
      setPrediction(aiPrediction);
    }
  }, [stockData]);

  if (isLoading) {
    return (
      <Card className="p-6 card-glow animate-pulse">
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-destructive/50">
        <div className="text-center text-destructive">
          <Activity className="h-8 w-8 mx-auto mb-2" />
          <p>Failed to load stock data for {symbol}</p>
          <p className="text-sm text-muted-foreground">Please try again later</p>
        </div>
      </Card>
    );
  }

  const priceChange = stockData?.change || 0;
  const changePercent = stockData?.changePercent || 0;
  const isPositive = priceChange >= 0;

  return (
    <Card className="p-6 card-glow">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold font-mono">{symbol}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleFavorite}
                className="h-8 w-8"
              >
                <Star className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">{stockData?.name}</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            LIVE
          </Badge>
        </div>

        {/* Price Info */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">${stockData?.price?.toFixed(2) || '0.00'}</span>
            <div className={`flex items-center gap-1 ${isPositive ? 'text-profit' : 'text-loss'}`}>
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="font-semibold">
                ${Math.abs(priceChange).toFixed(2)} ({Math.abs(changePercent).toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* AI Prediction */}
        {prediction && (
          <div className={`p-4 rounded-lg ${prediction.direction === 'UP' ? 'prediction-up' : 'prediction-down'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4" />
                24h AI Prediction
              </h3>
              <Badge 
                variant={prediction.direction === 'UP' ? 'default' : 'destructive'}
                className="font-mono"
              >
                {prediction.direction === 'UP' ? '⬆️' : '⬇️'} {prediction.confidence}% {prediction.direction}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{prediction.reasoning}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Target Price:</span>
                <p className="font-semibold">${prediction.targetPrice}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Sentiment:</span>
                <p className={`font-semibold ${prediction.sentiment > 0 ? 'text-profit' : prediction.sentiment < 0 ? 'text-loss' : 'text-neutral'}`}>
                  {prediction.sentiment > 0 ? 'Bullish' : prediction.sentiment < 0 ? 'Bearish' : 'Neutral'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Prediction Voting */}
        <PredictionVoting symbol={symbol} prediction={prediction} />
      </div>
    </Card>
  );
}
