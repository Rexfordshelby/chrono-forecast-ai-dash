
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Target, Brain, BarChart3, Zap } from 'lucide-react';
import { PredictionVoting } from '@/components/prediction-voting';

const Analysis = () => {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [timeframe, setTimeframe] = useState('1D');

  const analysisData = {
    aiPredictions: [
      {
        symbol: 'AAPL',
        prediction: 'BULLISH',
        confidence: 85,
        targetPrice: 195.50,
        currentPrice: 185.23,
        reasoning: 'Strong Q4 earnings, iPhone 15 demand, services growth',
        timeframe: '24h',
        accuracy: '78%'
      },
      {
        symbol: 'NVDA',
        prediction: 'BULLISH',
        confidence: 92,
        targetPrice: 920.00,
        currentPrice: 875.23,
        reasoning: 'AI chip demand surge, data center expansion, strong guidance',
        timeframe: '24h',
        accuracy: '84%'
      },
      {
        symbol: 'TSLA',
        prediction: 'BEARISH',
        confidence: 73,
        targetPrice: 235.00,
        currentPrice: 245.78,
        reasoning: 'EV competition increasing, delivery concerns, valuation stretched',
        timeframe: '24h',
        accuracy: '71%'
      }
    ],
    technicalSignals: [
      { indicator: 'RSI (14)', value: 67.3, signal: 'NEUTRAL', strength: 'Medium' },
      { indicator: 'MACD', value: 'Bullish Crossover', signal: 'BUY', strength: 'Strong' },
      { indicator: 'Bollinger Bands', value: 'Upper Band Touch', signal: 'SELL', strength: 'Weak' },
      { indicator: 'Moving Average (50)', value: 'Above', signal: 'BUY', strength: 'Medium' },
      { indicator: 'Volume', value: 'Above Average', signal: 'BULLISH', strength: 'Strong' }
    ],
    marketSentiment: {
      overall: 'BULLISH',
      retail: 72,
      institutional: 68,
      options: 'BULLISH',
      newsScore: 8.2,
      socialMedia: 'POSITIVE'
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY':
      case 'BULLISH':
        return 'text-green-600';
      case 'SELL':
      case 'BEARISH':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getSignalBadge = (signal: string) => {
    switch (signal) {
      case 'BUY':
      case 'BULLISH':
        return 'default';
      case 'SELL':
      case 'BEARISH':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">AI Analysis & Predictions</h1>
        <div className="flex gap-2">
          <Select value={selectedStock} onValueChange={setSelectedStock}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AAPL">AAPL</SelectItem>
              <SelectItem value="NVDA">NVDA</SelectItem>
              <SelectItem value="TSLA">TSLA</SelectItem>
              <SelectItem value="GOOGL">GOOGL</SelectItem>
              <SelectItem value="MSFT">MSFT</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1D">1D</SelectItem>
              <SelectItem value="1W">1W</SelectItem>
              <SelectItem value="1M">1M</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="predictions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid gap-6">
            {analysisData.aiPredictions.map((prediction) => (
              <Card key={prediction.symbol} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        {prediction.symbol} - AI Prediction
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={getSignalBadge(prediction.prediction)}>
                          {prediction.prediction}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Confidence: {prediction.confidence}%
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Accuracy: {prediction.accuracy}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Target Price</div>
                      <div className="text-2xl font-bold">${prediction.targetPrice}</div>
                      <div className="text-sm text-muted-foreground">
                        Current: ${prediction.currentPrice}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">AI Reasoning</h4>
                      <p className="text-sm text-muted-foreground">{prediction.reasoning}</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Timeframe</div>
                        <div className="font-semibold">{prediction.timeframe}</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Potential Return</div>
                        <div className={`font-semibold ${prediction.targetPrice > prediction.currentPrice ? 'text-green-600' : 'text-red-600'}`}>
                          {((prediction.targetPrice - prediction.currentPrice) / prediction.currentPrice * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Risk Level</div>
                        <div className="font-semibold">
                          {prediction.confidence > 80 ? 'Low' : prediction.confidence > 60 ? 'Medium' : 'High'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                {/* Confidence bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-muted">
                  <div 
                    className="h-full bg-primary transition-all duration-1000"
                    style={{ width: `${prediction.confidence}%` }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Technical Indicators - {selectedStock}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisData.technicalSignals.map((signal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <div className="font-medium">{signal.indicator}</div>
                      <div className="text-sm text-muted-foreground">{signal.value}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getSignalBadge(signal.signal)}>
                        {signal.signal}
                      </Badge>
                      <div className="text-sm text-muted-foreground min-w-16 text-right">
                        {signal.strength}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Signal Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">3</div>
                  <div className="text-sm text-green-700">Buy Signals</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">1</div>
                  <div className="text-sm text-red-700">Sell Signals</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">1</div>
                  <div className="text-sm text-yellow-700">Neutral Signals</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Market Sentiment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Overall Sentiment</span>
                  <Badge variant="default">{analysisData.marketSentiment.overall}</Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Retail Investors</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${analysisData.marketSentiment.retail}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono">{analysisData.marketSentiment.retail}%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Institutional</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${analysisData.marketSentiment.institutional}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono">{analysisData.marketSentiment.institutional}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Alternative Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Options Flow</span>
                  <Badge variant="default">{analysisData.marketSentiment.options}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>News Score</span>
                  <span className="font-mono">{analysisData.marketSentiment.newsScore}/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Social Media</span>
                  <Badge variant="default">{analysisData.marketSentiment.socialMedia}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <PredictionVoting symbol={selectedStock} />
          
          <Card>
            <CardHeader>
              <CardTitle>Community Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Most Discussed Stocks</span>
                    <span className="text-sm text-muted-foreground">Last 24h</span>
                  </div>
                  <div className="space-y-2">
                    {['NVDA', 'AAPL', 'TSLA', 'META', 'GOOGL'].map((symbol, index) => (
                      <div key={symbol} className="flex justify-between items-center">
                        <span className="font-mono">{symbol}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 bg-muted rounded-full">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${100 - index * 20}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{100 - index * 20}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analysis;
