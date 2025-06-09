
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine, Area, AreaChart, CandlestickChart } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Activity, Volume2, Target, AlertTriangle, Info } from 'lucide-react';
import { fetchChartData, fetchEnhancedAssetData, ChartData, EnhancedAssetData } from '@/lib/enhanced-api';

interface AdvancedChartProps {
  symbol: string;
}

interface ProcessedChartData extends ChartData {
  sma20?: number;
  sma50?: number;
  ema12?: number;
  ema26?: number;
  macd?: number;
  macdSignal?: number;
  rsi?: number;
  bollinger_upper?: number;
  bollinger_lower?: number;
  bollinger_middle?: number;
  volume_sma?: number;
  support?: number;
  resistance?: number;
}

const TIME_INTERVALS = [
  { value: '1m', label: '1M' },
  { value: '5m', label: '5M' },
  { value: '15m', label: '15M' },
  { value: '30m', label: '30M' },
  { value: '1h', label: '1H' },
  { value: '4h', label: '4H' },
  { value: '1d', label: '1D' }
];

const TIME_PERIODS = [
  { value: '1d', label: '1D' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '90d', label: '3M' },
  { value: '180d', label: '6M' },
  { value: '1y', label: '1Y' },
  { value: '2y', label: '2Y' },
  { value: 'max', label: 'MAX' }
];

export function AdvancedChart({ symbol }: AdvancedChartProps) {
  const [chartData, setChartData] = useState<ProcessedChartData[]>([]);
  const [assetData, setAssetData] = useState<EnhancedAssetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'area' | 'candlestick' | 'volume'>('line');
  const [interval, setInterval] = useState('1d');
  const [period, setPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('price');
  const [showIndicators, setShowIndicators] = useState({
    sma20: true,
    sma50: true,
    ema12: false,
    ema26: false,
    macd: false,
    rsi: false,
    bollinger: false,
    volume: true,
    support_resistance: true
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

    // Exponential Moving Averages
    if (showIndicators.ema12) {
      let ema = processedData[0].close;
      const multiplier = 2 / (12 + 1);
      for (let i = 0; i < processedData.length; i++) {
        ema = (processedData[i].close * multiplier) + (ema * (1 - multiplier));
        processedData[i].ema12 = ema;
      }
    }

    if (showIndicators.ema26) {
      let ema = processedData[0].close;
      const multiplier = 2 / (26 + 1);
      for (let i = 0; i < processedData.length; i++) {
        ema = (processedData[i].close * multiplier) + (ema * (1 - multiplier));
        processedData[i].ema26 = ema;
      }
    }

    // MACD
    if (showIndicators.macd && processedData[0].ema12 && processedData[0].ema26) {
      for (let i = 0; i < processedData.length; i++) {
        if (processedData[i].ema12 && processedData[i].ema26) {
          processedData[i].macd = processedData[i].ema12! - processedData[i].ema26!;
        }
      }
    }

    // RSI
    if (showIndicators.rsi) {
      for (let i = 14; i < processedData.length; i++) {
        const gains: number[] = [];
        const losses: number[] = [];
        
        for (let j = i - 13; j <= i; j++) {
          const change = processedData[j].close - (processedData[j - 1]?.close || processedData[j].close);
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
        
        processedData[i].bollinger_middle = sma;
        processedData[i].bollinger_upper = sma + (2 * stdDev);
        processedData[i].bollinger_lower = sma - (2 * stdDev);
      }
    }

    // Volume SMA
    if (showIndicators.volume) {
      for (let i = 19; i < processedData.length; i++) {
        const sum = processedData.slice(i - 19, i + 1).reduce((acc, item) => acc + item.volume, 0);
        processedData[i].volume_sma = sum / 20;
      }
    }

    // Support and Resistance
    if (showIndicators.support_resistance) {
      const prices = processedData.map(item => item.close);
      const support = Math.min(...prices);
      const resistance = Math.max(...prices);
      
      processedData.forEach(item => {
        item.support = support;
        item.resistance = resistance;
      });
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
        <div className="bg-background border rounded-lg p-4 shadow-lg min-w-64">
          <p className="font-semibold mb-2">{formatTimestamp(label)}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span>Open:</span>
              <span className="font-medium">${data.open?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>High:</span>
              <span className="font-medium text-green-500">${data.high?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Low:</span>
              <span className="font-medium text-red-500">${data.low?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Close:</span>
              <span className="font-medium">${data.close?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between col-span-2">
              <span>Volume:</span>
              <span className="font-medium">{(data.volume / 1000000).toFixed(2)}M</span>
            </div>
            {data.rsi && (
              <div className="flex justify-between">
                <span>RSI:</span>
                <span className={`font-medium ${data.rsi > 70 ? 'text-red-500' : data.rsi < 30 ? 'text-green-500' : ''}`}>
                  {data.rsi.toFixed(2)}
                </span>
              </div>
            )}
            {data.macd && (
              <div className="flex justify-between">
                <span>MACD:</span>
                <span className="font-medium">{data.macd.toFixed(4)}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const getMarketSignals = () => {
    if (chartData.length === 0) return [];
    
    const latest = chartData[chartData.length - 1];
    const signals = [];

    if (latest.rsi) {
      if (latest.rsi > 70) signals.push({ type: 'warning', message: 'RSI indicates overbought conditions' });
      if (latest.rsi < 30) signals.push({ type: 'success', message: 'RSI indicates oversold conditions' });
    }

    if (latest.sma20 && latest.sma50) {
      if (latest.sma20 > latest.sma50) signals.push({ type: 'success', message: 'Golden Cross: SMA20 above SMA50' });
      if (latest.sma20 < latest.sma50) signals.push({ type: 'warning', message: 'Death Cross: SMA20 below SMA50' });
    }

    if (latest.bollinger_upper && latest.bollinger_lower) {
      if (latest.close > latest.bollinger_upper) signals.push({ type: 'warning', message: 'Price above Bollinger upper band' });
      if (latest.close < latest.bollinger_lower) signals.push({ type: 'success', message: 'Price below Bollinger lower band' });
    }

    return signals;
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

          {/* Chart Type Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
            >
              <Activity className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === 'area' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('area')}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === 'volume' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('volume')}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Market Signals */}
        {getMarketSignals().length > 0 && (
          <div className="grid gap-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Target className="h-4 w-4" />
              Market Signals
            </h4>
            <div className="grid gap-2">
              {getMarketSignals().map((signal, index) => (
                <div key={index} className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                  signal.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {signal.type === 'success' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  {signal.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time Controls */}
        <div className="flex items-center gap-4 flex-wrap">
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

        {/* Chart Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="price">Price Chart</TabsTrigger>
            <TabsTrigger value="volume">Volume Analysis</TabsTrigger>
            <TabsTrigger value="indicators">Technical Indicators</TabsTrigger>
            <TabsTrigger value="analysis">Deep Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="price" className="space-y-4">
            {/* Technical Indicators Controls */}
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm font-medium">Indicators:</span>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(showIndicators).map(([key, enabled]) => (
                  <Button
                    key={key}
                    variant={enabled ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowIndicators(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                  >
                    {key.toUpperCase().replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>

            {/* Main Price Chart */}
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'area' ? (
                  <AreaChart data={chartData}>
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
                    
                    <Area
                      type="monotone"
                      dataKey="close"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.1}
                    />
                    
                    {/* Technical Indicators */}
                    {showIndicators.sma20 && (
                      <Line
                        type="monotone"
                        dataKey="sma20"
                        stroke="#f59e0b"
                        strokeWidth={1}
                        dot={false}
                        strokeDasharray="5 5"
                      />
                    )}
                    
                    {showIndicators.support_resistance && (
                      <>
                        <ReferenceLine y={chartData[0]?.support} stroke="#10b981" strokeDasharray="2 2" />
                        <ReferenceLine y={chartData[0]?.resistance} stroke="#ef4444" strokeDasharray="2 2" />
                      </>
                    )}
                  </AreaChart>
                ) : (
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
                    
                    <Line
                      type="monotone"
                      dataKey="close"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                    />
                    
                    {/* Technical Indicators */}
                    {showIndicators.sma20 && (
                      <Line
                        type="monotone"
                        dataKey="sma20"
                        stroke="#f59e0b"
                        strokeWidth={1}
                        dot={false}
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
                          strokeDasharray="2 2"
                        />
                        <Line
                          type="monotone"
                          dataKey="bollinger_lower"
                          stroke="#8b5cf6"
                          strokeWidth={1}
                          dot={false}
                          strokeDasharray="2 2"
                        />
                      </>
                    )}
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="volume" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp"
                    tickFormatter={formatTimestamp}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="volume" fill="#6366f1" />
                  {showIndicators.volume && (
                    <Line
                      type="monotone"
                      dataKey="volume_sma"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={false}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="indicators" className="space-y-4">
            {/* RSI Chart */}
            {showIndicators.rsi && (
              <div className="h-32">
                <h4 className="font-semibold mb-2">RSI (Relative Strength Index)</h4>
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
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* MACD Chart */}
            {showIndicators.macd && (
              <div className="h-32">
                <h4 className="font-semibold mb-2">MACD</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp"
                      tickFormatter={formatTimestamp}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <ReferenceLine y={0} stroke="#64748b" />
                    <Line
                      type="monotone"
                      dataKey="macd"
                      stroke="#3b82f6"
                      strokeWidth={1}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            {/* Key Metrics */}
            {assetData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-accent/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="text-lg font-semibold">
                    {assetData.marketCap ? `$${(assetData.marketCap / 1000000000).toFixed(2)}B` : 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-accent/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Volume (24h)</p>
                  <p className="text-lg font-semibold">
                    {(assetData.volume / 1000000).toFixed(2)}M
                  </p>
                </div>
                <div className="p-4 bg-accent/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">24h High</p>
                  <p className="text-lg font-semibold text-green-500">
                    ${assetData.high24h?.toFixed(2) || 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-accent/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">24h Low</p>
                  <p className="text-lg font-semibold text-red-500">
                    ${assetData.low24h?.toFixed(2) || 'N/A'}
                  </p>
                </div>
                {assetData.additionalMetrics?.pe_ratio && (
                  <div className="p-4 bg-accent/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">P/E Ratio</p>
                    <p className="text-lg font-semibold">
                      {assetData.additionalMetrics.pe_ratio.toFixed(2)}
                    </p>
                  </div>
                )}
                {assetData.additionalMetrics?.dividend_yield && (
                  <div className="p-4 bg-accent/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Dividend Yield</p>
                    <p className="text-lg font-semibold">
                      {assetData.additionalMetrics.dividend_yield.toFixed(2)}%
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Company Information */}
            {assetData && (
              <div className="grid gap-4">
                <div className="p-4 bg-accent/50 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Company Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {assetData.sector && (
                      <div>
                        <span className="text-muted-foreground">Sector:</span>
                        <span className="ml-2 font-medium">{assetData.sector}</span>
                      </div>
                    )}
                    {assetData.industry && (
                      <div>
                        <span className="text-muted-foreground">Industry:</span>
                        <span className="ml-2 font-medium">{assetData.industry}</span>
                      </div>
                    )}
                    {assetData.exchange && (
                      <div>
                        <span className="text-muted-foreground">Exchange:</span>
                        <span className="ml-2 font-medium">{assetData.exchange}</span>
                      </div>
                    )}
                    {assetData.country && (
                      <div>
                        <span className="text-muted-foreground">Country:</span>
                        <span className="ml-2 font-medium">{assetData.country}</span>
                      </div>
                    )}
                  </div>
                  {assetData.description && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      {assetData.description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
