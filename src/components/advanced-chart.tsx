
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, BarChart3, Target, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar } from 'recharts';

interface AdvancedChartProps {
  symbol: string;
}

// Mock data for demonstration
const generateMockData = (symbol: string) => {
  const basePrice = Math.random() * 1000 + 100;
  const data = [];
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const price = basePrice + (Math.random() - 0.5) * 50;
    const volume = Math.floor(Math.random() * 1000000) + 100000;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Number(price.toFixed(2)),
      volume,
      high: Number((price + Math.random() * 10).toFixed(2)),
      low: Number((price - Math.random() * 10).toFixed(2)),
      open: Number((price + (Math.random() - 0.5) * 5).toFixed(2)),
      close: Number(price.toFixed(2)),
      rsi: Math.random() * 100,
      macd: (Math.random() - 0.5) * 10,
      signal: (Math.random() - 0.5) * 8,
      bollinger_upper: Number((price + 20).toFixed(2)),
      bollinger_lower: Number((price - 20).toFixed(2))
    });
  }
  
  return data;
};

export function AdvancedChart({ symbol }: AdvancedChartProps) {
  const [timeframe, setTimeframe] = useState('1D');
  const [chartType, setChartType] = useState('line');
  
  const data = generateMockData(symbol);
  const currentPrice = data[data.length - 1]?.price || 0;
  const previousPrice = data[data.length - 2]?.price || 0;
  const change = currentPrice - previousPrice;
  const changePercent = (change / previousPrice) * 100;

  const indicators = {
    rsi: data[data.length - 1]?.rsi || 0,
    macd: data[data.length - 1]?.macd || 0,
    signal: data[data.length - 1]?.signal || 0,
    volume: data[data.length - 1]?.volume || 0
  };

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
            { key: 'area', label: 'Area', icon: BarChart3 },
            { key: 'candlestick', label: 'Candlestick', icon: Target }
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
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="price" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' && (
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                )}
                {chartType === 'area' && (
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip />
                    <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                  </AreaChart>
                )}
                {chartType === 'candlestick' && (
                  <ComposedChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip />
                    <Bar dataKey="high" fill="hsl(var(--primary))" />
                    <Line type="monotone" dataKey="close" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
                  </ComposedChart>
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
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="volume" fill="hsl(var(--muted))" />
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
                <div className="text-sm text-muted-foreground">Volatility</div>
                <div className="text-lg font-bold">{(Math.random() * 5 + 1).toFixed(1)}%</div>
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

          <TabsContent value="analysis" className="space-y-4">
            <div className="grid gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold">Technical Analysis</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on current indicators, {symbol} shows {changePercent > 0 ? 'bullish' : 'bearish'} momentum. 
                  RSI at {indicators.rsi.toFixed(1)} suggests the stock is {indicators.rsi > 70 ? 'overbought' : indicators.rsi < 30 ? 'oversold' : 'in neutral territory'}.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Support & Resistance</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Resistance:</span>
                      <span className="font-mono">${(currentPrice + 15).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Support:</span>
                      <span className="font-mono">${(currentPrice - 12).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Key Levels</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>52W High:</span>
                      <span className="font-mono">${(currentPrice + 45).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>52W Low:</span>
                      <span className="font-mono">${(currentPrice - 35).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
