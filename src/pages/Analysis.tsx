
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, TrendingUp, TrendingDown, Brain, Target, LineChart, BarChart3 } from 'lucide-react';
import { SimpleTradingSignals } from '@/components/simple-trading-signals';
import { AdvancedChart } from '@/components/advanced-chart';

const Analysis = () => {
  const navigate = useNavigate();
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [searchTerm, setSearchTerm] = useState('');

  // Simplified prediction data
  const predictions = [
    { symbol: 'AAPL', prediction: 'BUY', confidence: 78, target: 185.50 },
    { symbol: 'TSLA', prediction: 'SELL', confidence: 72, target: 220.00 },
    { symbol: 'MSFT', prediction: 'STRONG_BUY', confidence: 85, target: 445.00 },
    { symbol: 'GOOGL', prediction: 'HOLD', confidence: 65, target: 145.00 }
  ];

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
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="h-8 w-8" />
          Trading Analysis & Signals
        </h1>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stocks (AAPL, TSLA, MSFT...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && searchTerm.trim()) {
                setSelectedStock(searchTerm.toUpperCase().trim());
                setSearchTerm('');
              }
            }}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="signals" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="signals">Trading Signals</TabsTrigger>
          <TabsTrigger value="predictions">Quick Predictions</TabsTrigger>
          <TabsTrigger value="chart">Price Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="signals" className="space-y-6">
          <div className="text-center mb-4">
            <p className="text-muted-foreground">
              Currently analyzing: <span className="font-bold">{selectedStock}</span>
            </p>
          </div>
          <SimpleTradingSignals symbol={selectedStock} />
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {predictions.map((pred) => (
              <Card 
                key={pred.symbol} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedStock(pred.symbol)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg">{pred.symbol}</h3>
                    <Badge 
                      variant={
                        pred.prediction.includes('BUY') ? 'default' : 
                        pred.prediction.includes('SELL') ? 'destructive' : 
                        'secondary'
                      }
                    >
                      {pred.prediction}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Target:</span>
                      <span className="font-mono font-semibold">${pred.target}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Confidence:</span>
                      <span className="font-semibold">{pred.confidence}%</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-3" 
                    variant="outline"
                    size="sm"
                  >
                    Analyze {pred.symbol}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chart" className="space-y-6">
          <AdvancedChart symbol={selectedStock} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analysis;
