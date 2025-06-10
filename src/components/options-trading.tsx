
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calculator, Target, Activity } from 'lucide-react';

interface OptionContract {
  symbol: string;
  strike: number;
  expiry: string;
  type: 'CALL' | 'PUT';
  bid: number;
  ask: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

export function OptionsTrading() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [calculatorInputs, setCalculatorInputs] = useState({
    stockPrice: 175,
    strikePrice: 180,
    timeToExpiry: 30,
    riskFreeRate: 5,
    volatility: 25,
    optionType: 'CALL' as 'CALL' | 'PUT'
  });

  const optionChain: OptionContract[] = [
    {
      symbol: 'AAPL240315C00170000',
      strike: 170,
      expiry: '2024-03-15',
      type: 'CALL',
      bid: 7.50,
      ask: 7.60,
      volume: 1250,
      openInterest: 5600,
      impliedVolatility: 0.22,
      delta: 0.65,
      gamma: 0.035,
      theta: -0.12,
      vega: 0.18
    },
    {
      symbol: 'AAPL240315C00175000',
      strike: 175,
      expiry: '2024-03-15',
      type: 'CALL',
      bid: 4.80,
      ask: 4.90,
      volume: 2100,
      openInterest: 8900,
      impliedVolatility: 0.24,
      delta: 0.52,
      gamma: 0.042,
      theta: -0.15,
      vega: 0.21
    },
    {
      symbol: 'AAPL240315P00170000',
      strike: 170,
      expiry: '2024-03-15',
      type: 'PUT',
      bid: 2.30,
      ask: 2.40,
      volume: 890,
      openInterest: 3400,
      impliedVolatility: 0.21,
      delta: -0.35,
      gamma: 0.035,
      theta: -0.10,
      vega: 0.16
    }
  ];

  const strategies = [
    {
      name: 'Covered Call',
      description: 'Own stock + Sell call option',
      maxProfit: 'Strike - Stock Price + Premium',
      maxLoss: 'Stock Price - Premium',
      breakeven: 'Stock Price - Premium',
      outlook: 'Neutral to Slightly Bullish'
    },
    {
      name: 'Protective Put',
      description: 'Own stock + Buy put option',
      maxProfit: 'Unlimited',
      maxLoss: 'Stock Price - Strike + Premium',
      breakeven: 'Stock Price + Premium',
      outlook: 'Bullish with Downside Protection'
    },
    {
      name: 'Iron Condor',
      description: 'Sell put spread + Sell call spread',
      maxProfit: 'Net Premium Received',
      maxLoss: 'Strike Width - Net Premium',
      breakeven: 'Two breakeven points',
      outlook: 'Neutral (Low Volatility)'
    }
  ];

  const calculateBlackScholes = () => {
    // Simplified Black-Scholes calculation for demo
    const { stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility, optionType } = calculatorInputs;
    const t = timeToExpiry / 365;
    const d1 = (Math.log(stockPrice / strikePrice) + (riskFreeRate / 100 + Math.pow(volatility / 100, 2) / 2) * t) / 
               ((volatility / 100) * Math.sqrt(t));
    const d2 = d1 - (volatility / 100) * Math.sqrt(t);
    
    // Simplified calculation
    const theoreticalPrice = optionType === 'CALL' ? 
      stockPrice * 0.6 - strikePrice * Math.exp(-riskFreeRate / 100 * t) * 0.4 :
      strikePrice * Math.exp(-riskFreeRate / 100 * t) * 0.4 - stockPrice * 0.6;
      
    return Math.max(theoreticalPrice, 0);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Options Trading
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chain" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chain">Option Chain</TabsTrigger>
            <TabsTrigger value="calculator">Greeks Calculator</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="chain" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AAPL">AAPL</SelectItem>
                  <SelectItem value="MSFT">MSFT</SelectItem>
                  <SelectItem value="GOOGL">GOOGL</SelectItem>
                  <SelectItem value="TSLA">TSLA</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">Current Price: $175.50</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Strike</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Bid/Ask</th>
                    <th className="text-left p-2">Volume</th>
                    <th className="text-left p-2">OI</th>
                    <th className="text-left p-2">IV</th>
                    <th className="text-left p-2">Delta</th>
                    <th className="text-left p-2">Gamma</th>
                    <th className="text-left p-2">Theta</th>
                  </tr>
                </thead>
                <tbody>
                  {optionChain.map((option, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-mono">{option.strike}</td>
                      <td className="p-2">
                        <Badge variant={option.type === 'CALL' ? 'default' : 'destructive'}>
                          {option.type}
                        </Badge>
                      </td>
                      <td className="p-2 font-mono">{option.bid.toFixed(2)}/{option.ask.toFixed(2)}</td>
                      <td className="p-2">{option.volume.toLocaleString()}</td>
                      <td className="p-2">{option.openInterest.toLocaleString()}</td>
                      <td className="p-2">{(option.impliedVolatility * 100).toFixed(1)}%</td>
                      <td className="p-2">{option.delta.toFixed(3)}</td>
                      <td className="p-2">{option.gamma.toFixed(3)}</td>
                      <td className="p-2">{option.theta.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="stockPrice">Stock Price</Label>
                  <Input
                    id="stockPrice"
                    type="number"
                    value={calculatorInputs.stockPrice}
                    onChange={(e) => setCalculatorInputs({...calculatorInputs, stockPrice: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="strikePrice">Strike Price</Label>
                  <Input
                    id="strikePrice"
                    type="number"
                    value={calculatorInputs.strikePrice}
                    onChange={(e) => setCalculatorInputs({...calculatorInputs, strikePrice: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="timeToExpiry">Days to Expiry</Label>
                  <Input
                    id="timeToExpiry"
                    type="number"
                    value={calculatorInputs.timeToExpiry}
                    onChange={(e) => setCalculatorInputs({...calculatorInputs, timeToExpiry: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="volatility">Implied Volatility (%)</Label>
                  <Input
                    id="volatility"
                    type="number"
                    value={calculatorInputs.volatility}
                    onChange={(e) => setCalculatorInputs({...calculatorInputs, volatility: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="optionType">Option Type</Label>
                  <Select 
                    value={calculatorInputs.optionType} 
                    onValueChange={(value: 'CALL' | 'PUT') => setCalculatorInputs({...calculatorInputs, optionType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CALL">Call</SelectItem>
                      <SelectItem value="PUT">Put</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Theoretical Price</h4>
                  <div className="text-2xl font-bold">${calculateBlackScholes().toFixed(2)}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg text-center">
                    <div className="text-sm text-muted-foreground">Delta</div>
                    <div className="font-bold">0.523</div>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <div className="text-sm text-muted-foreground">Gamma</div>
                    <div className="font-bold">0.042</div>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <div className="text-sm text-muted-foreground">Theta</div>
                    <div className="font-bold">-0.15</div>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <div className="text-sm text-muted-foreground">Vega</div>
                    <div className="font-bold">0.21</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="strategies" className="space-y-4">
            {strategies.map((strategy, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="mb-3">
                  <h4 className="font-semibold">{strategy.name}</h4>
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Max Profit:</span> {strategy.maxProfit}
                  </div>
                  <div>
                    <span className="font-medium">Max Loss:</span> {strategy.maxLoss}
                  </div>
                  <div>
                    <span className="font-medium">Breakeven:</span> {strategy.breakeven}
                  </div>
                  <div>
                    <span className="font-medium">Outlook:</span> {strategy.outlook}
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="grid gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <h4 className="font-semibold mb-2">Market Sentiment</h4>
                <div className="text-sm">
                  <p>Put/Call Ratio: <span className="font-mono">0.85</span> (Slightly Bearish)</p>
                  <p>VIX Level: <span className="font-mono">18.5</span> (Low Volatility)</p>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <h4 className="font-semibold mb-2">Unusual Activity</h4>
                <div className="text-sm space-y-1">
                  <p>AAPL 180 Calls - Volume: 15K (10x avg)</p>
                  <p>MSFT 410 Puts - Volume: 8K (5x avg)</p>
                  <p>TSLA 900 Calls - Volume: 12K (8x avg)</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
