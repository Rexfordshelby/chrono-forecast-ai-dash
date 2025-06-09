
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import { fetchChartData, fetchEnhancedAssetData, ChartData, EnhancedAssetData } from '@/lib/enhanced-api';

interface AdvancedChartProps {
  symbol: string;
}

interface ProcessedChartData extends ChartData {
  sma20?: number;
  sma50?: number;
  rsi?: number;
  bollinger_upper?: number;
  bollinger_lower?: number;
}

const TIME_INTERVALS = [
  { value: '1m', label: '1M' },
  { value: '5m', label: '5M' },
  { value: '15m', label: '15M' },
  { value: '30m', label: '30M' },
  { value: '1h', label: '1H' },
  { value: '1d', label: '1D' }
];

const TIME_PERIODS = [
  { value: '1d', label: '1D' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '90d', label: '3M' },
  { value: '1y', label: '1Y' },
  { value: 'max', label: 'MAX' }
];

export function AdvancedChart({ symbol }: AdvancedChartProps) {
  const [chartData, setChartData] = useState<ProcessedChartData[]>([]);
  const [assetData, setAssetData] = useState<EnhancedAssetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [interval, setInterval] = useState('1d');
  const [period, setPeriod] = useState('30d');
  const [showIndicators, setShowIndicators] = useState({
    sma20: true,
    sma50: true,
    rsi: false,
    bollinger: false
  });

  useEffect(() => {
    loadChartData();
    loadAssetData();
  }, [symbol, interval, period]);

  useEffect(() => {
    if (chartData.length > 0) {
      const processedData = addTechnicalIndicators(chartData);
      setChartData(processedData);
    }
  }, [showIndicators]);

  const loadChartData = async () => {
    setLoading(true);
    try {
      const data = await fetchChartData(symbol, interval as any, period);
      const processedData = addTechnicalIndicators(data);
      setChartData(processedData);
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAssetData = async () => {
    try {
      const data = await fetchEnhancedAssetData(symbol);
      setAssetData(data);
    } catch (error) {
      console.error('Error loading asset data:', error);
    }
  };

  const addTechnicalIndicators = (data: ChartData[]): ProcessedChartData[] => {
    if (data.length === 0) return [];

    const processedData: ProcessedChartData[] = [...data];

    // Simple Moving Averages
    if (showIndicators.sma20) {
      for (let i = 19; i < processedData.length; i++) {
        const sum = processedData.slice(i - 19, i + 1).reduce((acc, item) => acc + item.close, 0);
        processedData[i].sma20 = sum / 20;
      }
    }

    if (showIndicators.sma50) {
      for (let i = 49; i < processedData.length; i++) {
        const sum = processedData.slice(i - 49, i + 1).reduce((acc, item) => acc + item.close, 0);
        processedData[i].sma50 = sum / 50;
      }
    }

    // RSI (Relative Strength Index)
    if (showIndicators.rsi) {
      for (let i = 14; i < processedData.length; i++) {
        const gains: number[] = [];
        const losses: number[] = [];
        
        for (let j = i - 13; j <= i; j++) {
          const change = processedData[j].close - processedData[j - 1]?.close || 0;
          if (change > 0) gains.push(change);
          else losses.push(Math.abs(change));
        }
        
        const avgGain = gains.reduce((sum, gain) => sum + gain, 0) / 14;
        const avgLoss = losses.reduce((sum, loss) => sum + loss, 0) / 14;
        
        if (avgLoss === 0) {
          processedData[i].rsi = 100;
        } else {
          const rs = avgGain / avgLoss;
          processedData[i].rsi = 100 - (100 / (1 + rs));
        }
      }
    }

    // Bollinger Bands
    if (showIndicators.bollinger) {
      for (let i = 19; i < processedData.length; i++) {
        const slice = processedData.slice(i - 19, i + 1);
        const sma = slice.reduce((acc, item) => acc + item.close, 0) / 20;
        const variance = slice.reduce((acc, item) => acc + Math.pow(item.close - sma, 2), 0) / 20;
        const stdDev = Math.sqrt(variance);
        
        processedData[i].bollinger_upper = sma + (2 * stdDev);
        processedData[i].bollinger_lower = sma - (2 * stdDev);
      }
    }

    return processedData;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    if (interval === '1d') {
      return date.toLocaleDateString();
    } else {
      return date.toLocaleTimeString();
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{formatTimestamp(label)}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span>Open:</span>
              <span>${data.open?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>High:</span>
              <span>${data.high?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Low:</span>
              <span>${data.low?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Close:</span>
              <span>${data.close?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Volume:</span>
              <span>{(data.volume / 1000000).toFixed(2)}M</span>
            </div>
            {data.rsi && (
              <div className="flex justify-between gap-4">
                <span>RSI:</span>
                <span>{data.rsi.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold">{symbol}</h3>
            {assetData && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{assetData.category.toUpperCase()}</Badge>
                <div className="text-2xl font-semibold">
                  ${assetData.price.toFixed(assetData.category === 'forex' ? 4 : 2)}
                </div>
                <div className={`flex items-center gap-1 ${
                  assetData.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {assetData.changePercent >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span>{assetData.changePercent.toFixed(2)}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Chart Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
            >
              <Activity className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Time Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Interval:</span>
            <Select value={interval} onValueChange={setInterval}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_INTERVALS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Period:</span>
            <div className="flex gap-1">
              {TIME_PERIODS.map((item) => (
                <Button
                  key={item.value}
                  variant={period === item.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPeriod(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Indicators */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Indicators:</span>
          <div className="flex gap-2">
            {Object.entries(showIndicators).map(([key, enabled]) => (
              <Button
                key={key}
                variant={enabled ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowIndicators(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
              >
                {key.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={formatTimestamp}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={['dataMin - 5', 'dataMax + 5']}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Main price line */}
              <Line
                type="monotone"
                dataKey="close"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="Price"
              />
              
              {/* Technical Indicators */}
              {showIndicators.sma20 && (
                <Line
                  type="monotone"
                  dataKey="sma20"
                  stroke="#f59e0b"
                  strokeWidth={1}
                  dot={false}
                  name="SMA 20"
                  strokeDasharray="5 5"
                />
              )}
              
              {showIndicators.sma50 && (
                <Line
                  type="monotone"
                  dataKey="sma50"
                  stroke="#ef4444"
                  strokeWidth={1}
                  dot={false}
                  name="SMA 50"
                  strokeDasharray="5 5"
                />
              )}
              
              {showIndicators.bollinger && (
                <>
                  <Line
                    type="monotone"
                    dataKey="bollinger_upper"
                    stroke="#8b5cf6"
                    strokeWidth={1}
                    dot={false}
                    name="Bollinger Upper"
                    strokeDasharray="2 2"
                  />
                  <Line
                    type="monotone"
                    dataKey="bollinger_lower"
                    stroke="#8b5cf6"
                    strokeWidth={1}
                    dot={false}
                    name="Bollinger Lower"
                    strokeDasharray="2 2"
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* RSI Chart */}
        {showIndicators.rsi && (
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp"
                  tickFormatter={formatTimestamp}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip />
                <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="2 2" />
                <ReferenceLine y={30} stroke="#10b981" strokeDasharray="2 2" />
                <Line
                  type="monotone"
                  dataKey="rsi"
                  stroke="#6366f1"
                  strokeWidth={1}
                  dot={false}
                  name="RSI"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Key Metrics */}
        {assetData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Market Cap</p>
              <p className="font-semibold">
                {assetData.marketCap ? `$${(assetData.marketCap / 1000000000).toFixed(2)}B` : 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Volume</p>
              <p className="font-semibold">
                {(assetData.volume / 1000000).toFixed(2)}M
              </p>
            </div>
            <div className="p-3 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground">24h High</p>
              <p className="font-semibold">
                ${assetData.high24h?.toFixed(2) || 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground">24h Low</p>
              <p className="font-semibold">
                ${assetData.low24h?.toFixed(2) || 'N/A'}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
