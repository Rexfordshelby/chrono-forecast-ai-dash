
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, TrendingUp, TrendingDown, Brain, Target, LineChart, BarChart3 } from 'lucide-react';
import { AdvancedChart } from '@/components/advanced-chart';

const Analysis = () => {
  const navigate = useNavigate();
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock analysis data
  const analysisData = {
    aiPredictions: [
      { symbol: 'AAPL', prediction: 'BULLISH', confidence: 85, target: 185.50, timeframe: '30 days' },
      { symbol: 'TSLA', prediction: 'BEARISH', confidence: 72, target: 220.00, timeframe: '30 days' },
      { symbol: 'GOOGL', prediction: 'NEUTRAL', confidence: 65, target: 145.00, timeframe: '30 days' },
      { symbol: 'RELIANCE', prediction: 'BULLISH', confidence: 78, target: 2950.00, timeframe: '30 days' }
    ],
    technicalIndicators: {
      rsi: 68.5,
      macd: 2.45,
      sma20: 175.32,
      sma50: 168.90,
      bollinger: { upper: 182.45, lower: 165.78 }
    },
    marketSentiment: {
      overall: 'BULLISH',
      bullish: 65,
      bearish: 25,
      neutral: 10
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/markets')}>
            Markets
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
            Profile
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/features')}>
            Features
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="h-8 w-8" />
          AI Analysis & Predictions
        </h1>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for analysis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="predictions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
          <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
          <TabsTrigger value="sentiment">Market Sentiment</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisData.aiPredictions.map((prediction) => (
              <Card key={prediction.symbol} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{prediction.symbol}</h3>
                      <p className="text-sm text-muted-foreground">{prediction.timeframe}</p>
                    </div>
                    <Badge 
                      variant={
                        prediction.prediction === 'BULLISH' ? 'default' : 
                        prediction.prediction === 'BEARISH' ? 'destructive' : 
                        'secondary'
                      }
                    >
                      {prediction.prediction}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Target Price:</span>
                      <span className="font-mono font-semibold">${prediction.target}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence:</span>
                      <span className="font-semibold">{prediction.confidence}%</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    onClick={() => setSelectedStock(prediction.symbol)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">RSI</h3>
                <p className="text-2xl font-bold">{analysisData.technicalIndicators.rsi}</p>
                <p className="text-sm text-muted-foreground">Overbought territory</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <LineChart className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">MACD</h3>
                <p className="text-2xl font-bold">{analysisData.technicalIndicators.macd}</p>
                <p className="text-sm text-muted-foreground">Bullish signal</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">SMA 20</h3>
                <p className="text-2xl font-bold">${analysisData.technicalIndicators.sma20}</p>
                <p className="text-sm text-muted-foreground">Short-term trend</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">SMA 50</h3>
                <p className="text-2xl font-bold">${analysisData.technicalIndicators.sma50}</p>
                <p className="text-sm text-muted-foreground">Medium-term trend</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Bollinger Bands Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Upper Band</p>
                  <p className="text-xl font-bold">${analysisData.technicalIndicators.bollinger.upper}</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Lower Band</p>
                  <p className="text-xl font-bold">${analysisData.technicalIndicators.bollinger.lower}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Sentiment Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <Badge 
                  variant="default" 
                  className="text-lg px-4 py-2"
                >
                  {analysisData.marketSentiment.overall}
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="font-semibold text-green-700 dark:text-green-400">Bullish</p>
                  <p className="text-2xl font-bold">{analysisData.marketSentiment.bullish}%</p>
                </div>
                
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <TrendingDown className="h-8 w-8 mx-auto mb-2 text-red-600" />
                  <p className="font-semibold text-red-700 dark:text-red-400">Bearish</p>
                  <p className="text-2xl font-bold">{analysisData.marketSentiment.bearish}%</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Target className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <p className="font-semibold text-gray-700 dark:text-gray-400">Neutral</p>
                  <p className="text-2xl font-bold">{analysisData.marketSentiment.neutral}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <AdvancedChart symbol={selectedStock} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analysis;
