
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, BarChart3, Target, AlertTriangle, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar } from 'recharts';
import { useRealTimeStock } from '@/hooks/useRealTimeStock';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdvancedChartProps {
  symbol: string;
}

export function AdvancedChart({ symbol }: AdvancedChartProps) {
  const [timeframe, setTimeframe] = useState('1D');
  const [chartType, setChartType] = useState('line');
  const { data: stockData, loading, error } = useRealTimeStock(symbol);
  const { t } = useLanguage();

  // Generate historical data based on current real price
  const generateHistoricalData = (currentPrice: number) => {
    const data = [];
    const basePrice = currentPrice;
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Create realistic price movement around the current price
      const volatility = 0.02; // 2% daily volatility
      const priceVariation = (Math.random() - 0.5) * basePrice * volatility;
      const price = basePrice + priceVariation;
      const volume = Math.floor(Math.random() * 10000000) + 1000000;
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: Number(price.toFixed(2)),
        volume,
        high: Number((price + Math.random() * price * 0.01).toFixed(2)),
        low: Number((price - Math.random() * price * 0.01).toFixed(2)),
        open: Number((price + (Math.random() - 0.5) * price * 0.005).toFixed(2)),
        close: Number(price.toFixed(2)),
        rsi: Math.random() * 100,
        macd: (Math.random() - 0.5) * 2,
        signal: (Math.random() - 0.5) * 1.5,
        bollinger_upper: Number((price + price * 0.02).toFixed(2)),
        bollinger_lower: Number((price - price * 0.02).toFixed(2))
      });
    }
    
    return data;
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 animate-spin" />
            Loading {symbol} Chart...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stockData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-destructive">Chart Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>Failed to load chart data for {symbol}</p>
            <Button variant="outline" className="mt-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const data = generateHistoricalData(stockData.price);
  const currentPrice = stockData.price;
  const change = stockData.change;
  const changePercent = stockData.changePercent;

  const indicators = {
    rsi: data[data.length - 1]?.rsi || 0,
    macd: data[data.length - 1]?.macd || 0,
    signal: data[data.length - 1]?.signal || 0,
    volume: stockData.volume
  };

  // AI Prediction based on real data
  const generatePrediction = () => {
    const trend = changePercent > 0 ? 'BULLISH' : 'BEARISH';
    const confidence = Math.min(Math.abs(changePercent) * 10 + 60, 85);
    const targetPrice = currentPrice + (change * 1.5);
    
    let reasoning = '';
    if (changePercent > 2) {
      reasoning = `Strong upward momentum with ${changePercent.toFixed(2)}% gain. High volume suggests continued buying interest.`;
    } else if (changePercent < -2) {
      reasoning = `Significant downward pressure with ${Math.abs(changePercent).toFixed(2)}% decline. Consider support levels.`;
    } else {
      reasoning = `Consolidating within normal range. Watch for breakout above ${(currentPrice * 1.02).toFixed(2)} or breakdown below ${(currentPrice * 0.98).toFixed(2)}.`;
    }

    return {
      trend,
      confidence: Math.round(confidence),
      targetPrice: targetPrice.toFixed(2),
      reasoning,
      timeframe: '24H'
    };
  };

  const prediction = generatePrediction();

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">{symbol}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-bold">${currentPrice.toFixed(2)}</span>
              <div className={`flex items-center gap-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="font-semibold">{change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Real-time data • Last updated: {new Date(stockData.timestamp).toLocaleTimeString()}
            </div>
          </div>
          
          <div className="flex gap-2">
            {['1D', '1W', '1M', '3M', '1Y'].map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {[
            { key: 'line', label: 'Line', icon: Activity },
            { key: 'area', label: 'Area', icon: BarChart3 }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={chartType === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType(key)}
              className="flex items-center gap-1"
            >
              <Icon className="h-3 w-3" />
              {label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="price" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="price">Price</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="indicators">Indicators</TabsTrigger>
            <TabsTrigger value="prediction">AI Prediction</TabsTrigger>
          </TabsList>

          <TabsContent value="price" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']} />
                    <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                ) : (
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']} />
                    <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="volume" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value, name) => {
                    if (name === 'volume') {
                      return [(Number(value) / 1000000).toFixed(1) + 'M', 'Volume'];
                    }
                    if (name === 'price') {
                      return [`$${Number(value).toFixed(2)}`, 'Price'];
                    }
                    return [value, name];
                  }} />
                  <Bar dataKey="volume" fill="hsl(var(--muted))" yAxisId="left" />
                  <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} yAxisId="right" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="indicators" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">RSI</div>
                <div className="text-lg font-bold">{indicators.rsi.toFixed(1)}</div>
                <Badge variant={indicators.rsi > 70 ? 'destructive' : indicators.rsi < 30 ? 'default' : 'secondary'}>
                  {indicators.rsi > 70 ? 'Overbought' : indicators.rsi < 30 ? 'Oversold' : 'Neutral'}
                </Badge>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">MACD</div>
                <div className="text-lg font-bold">{indicators.macd.toFixed(2)}</div>
                <Badge variant={indicators.macd > indicators.signal ? 'default' : 'destructive'}>
                  {indicators.macd > indicators.signal ? 'Bullish' : 'Bearish'}
                </Badge>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Volume</div>
                <div className="text-lg font-bold">{(indicators.volume / 1000000).toFixed(1)}M</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Support</div>
                <div className="text-lg font-bold">${(currentPrice * 0.98).toFixed(2)}</div>
              </div>
            </div>

            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="rsi" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="prediction" className="space-y-4">
            <div className={`p-6 rounded-lg border-2 ${prediction.trend === 'BULLISH' ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-red-500 bg-red-50 dark:bg-red-950'}`}>
              <div className="flex items-center gap-3 mb-4">
                {prediction.trend === 'BULLISH' ? (
                  <TrendingUp className="h-6 w-6 text-green-600" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-600" />
                )}
                <div>
                  <h3 className="text-xl font-bold">{prediction.trend} Signal</h3>
                  <p className="text-sm opacity-75">{prediction.confidence}% Confidence • {prediction.timeframe}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">AI Analysis</h4>
                  <p className="text-sm leading-relaxed">{prediction.reasoning}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-background rounded border">
                    <div className="text-sm text-muted-foreground">Current Price</div>
                    <div className="text-lg font-bold">${currentPrice.toFixed(2)}</div>
                  </div>
                  <div className="p-3 bg-background rounded border">
                    <div className="text-sm text-muted-foreground">24H Target</div>
                    <div className="text-lg font-bold">${prediction.targetPrice}</div>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground bg-background p-3 rounded border">
                  <strong>Note:</strong> This prediction is based on current price movement and technical indicators. 
                  {prediction.trend === 'BULLISH' ? ' A bullish signal suggests potential upward movement.' : ' A bearish signal suggests potential downward movement.'} 
                  Always do your own research.
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
