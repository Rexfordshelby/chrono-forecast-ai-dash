
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Bot, Play, Pause, Settings, TrendingUp, Code, BarChart3 } from 'lucide-react';

interface Algorithm {
  id: string;
  name: string;
  strategy: string;
  status: 'active' | 'paused' | 'stopped';
  performance: number;
  trades: number;
  winRate: number;
  maxDrawdown: number;
  createdAt: string;
}

interface Backtest {
  date: string;
  portfolio: number;
  benchmark: number;
  drawdown: number;
}

export function AlgorithmicTrading() {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([
    {
      id: '1',
      name: 'Momentum Breakout',
      strategy: 'Moving Average Crossover',
      status: 'active',
      performance: 18.5,
      trades: 45,
      winRate: 67,
      maxDrawdown: -12.3,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Mean Reversion',
      strategy: 'RSI Oversold/Overbought',
      status: 'paused',
      performance: 12.8,
      trades: 78,
      winRate: 54,
      maxDrawdown: -8.7,
      createdAt: '2024-02-01'
    }
  ]);

  const [newAlgorithm, setNewAlgorithm] = useState({
    name: '',
    strategy: 'momentum',
    symbols: 'AAPL,MSFT,GOOGL',
    parameters: '{"fast_ma": 10, "slow_ma": 20, "rsi_period": 14}',
    riskLimit: 2,
    maxPositions: 5
  });

  const backtestData: Backtest[] = [
    { date: '2024-01', portfolio: 10000, benchmark: 10000, drawdown: 0 },
    { date: '2024-02', portfolio: 10850, benchmark: 10200, drawdown: -2.1 },
    { date: '2024-03', portfolio: 11200, benchmark: 10400, drawdown: -5.3 },
    { date: '2024-04', portfolio: 11750, benchmark: 10650, drawdown: -3.2 },
    { date: '2024-05', portfolio: 12100, benchmark: 10900, drawdown: -1.8 },
    { date: '2024-06', portfolio: 12650, benchmark: 11150, drawdown: -0.5 }
  ];

  const toggleAlgorithm = (id: string) => {
    setAlgorithms(prev => prev.map(algo => 
      algo.id === id 
        ? { ...algo, status: algo.status === 'active' ? 'paused' : 'active' }
        : algo
    ));
  };

  const createAlgorithm = () => {
    const newAlgo: Algorithm = {
      id: Date.now().toString(),
      name: newAlgorithm.name,
      strategy: newAlgorithm.strategy,
      status: 'stopped',
      performance: 0,
      trades: 0,
      winRate: 0,
      maxDrawdown: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setAlgorithms(prev => [...prev, newAlgo]);
    setNewAlgorithm({
      name: '',
      strategy: 'momentum',
      symbols: 'AAPL,MSFT,GOOGL',
      parameters: '{"fast_ma": 10, "slow_ma": 20, "rsi_period": 14}',
      riskLimit: 2,
      maxPositions: 5
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Algorithmic Trading
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="algorithms" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="algorithms">My Algorithms</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="backtest">Backtest</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="algorithms" className="space-y-4">
            {algorithms.map((algo) => (
              <div key={algo.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">{algo.name}</h4>
                    <p className="text-sm text-muted-foreground">{algo.strategy}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      algo.status === 'active' ? 'default' : 
                      algo.status === 'paused' ? 'secondary' : 'destructive'
                    }>
                      {algo.status}
                    </Badge>
                    <Switch 
                      checked={algo.status === 'active'}
                      onCheckedChange={() => toggleAlgorithm(algo.id)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className={`text-lg font-bold ${algo.performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {algo.performance >= 0 ? '+' : ''}{algo.performance}%
                    </div>
                    <div className="text-xs text-muted-foreground">Performance</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{algo.trades}</div>
                    <div className="text-xs text-muted-foreground">Trades</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{algo.winRate}%</div>
                    <div className="text-xs text-muted-foreground">Win Rate</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600">{algo.maxDrawdown}%</div>
                    <div className="text-xs text-muted-foreground">Max Drawdown</div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Analytics
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="algoName">Algorithm Name</Label>
                  <Input
                    id="algoName"
                    value={newAlgorithm.name}
                    onChange={(e) => setNewAlgorithm({...newAlgorithm, name: e.target.value})}
                    placeholder="My Trading Strategy"
                  />
                </div>
                
                <div>
                  <Label htmlFor="strategy">Strategy Type</Label>
                  <Select 
                    value={newAlgorithm.strategy} 
                    onValueChange={(value) => setNewAlgorithm({...newAlgorithm, strategy: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="momentum">Momentum</SelectItem>
                      <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
                      <SelectItem value="arbitrage">Arbitrage</SelectItem>
                      <SelectItem value="pairs-trading">Pairs Trading</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="symbols">Symbols (comma separated)</Label>
                  <Input
                    id="symbols"
                    value={newAlgorithm.symbols}
                    onChange={(e) => setNewAlgorithm({...newAlgorithm, symbols: e.target.value})}
                    placeholder="AAPL,MSFT,GOOGL"
                  />
                </div>

                <div>
                  <Label htmlFor="riskLimit">Risk Limit per Trade (%)</Label>
                  <Input
                    id="riskLimit"
                    type="number"
                    value={newAlgorithm.riskLimit}
                    onChange={(e) => setNewAlgorithm({...newAlgorithm, riskLimit: Number(e.target.value)})}
                    min="0.1"
                    max="10"
                    step="0.1"
                  />
                </div>

                <div>
                  <Label htmlFor="maxPositions">Max Concurrent Positions</Label>
                  <Input
                    id="maxPositions"
                    type="number"
                    value={newAlgorithm.maxPositions}
                    onChange={(e) => setNewAlgorithm({...newAlgorithm, maxPositions: Number(e.target.value)})}
                    min="1"
                    max="20"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="parameters">Strategy Parameters (JSON)</Label>
                  <Textarea
                    id="parameters"
                    value={newAlgorithm.parameters}
                    onChange={(e) => setNewAlgorithm({...newAlgorithm, parameters: e.target.value})}
                    rows={8}
                    placeholder='{"fast_ma": 10, "slow_ma": 20}'
                  />
                </div>

                <Button onClick={createAlgorithm} className="w-full">
                  <Code className="h-4 w-4 mr-2" />
                  Create Algorithm
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="backtest" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">+26.5%</div>
                <div className="text-sm text-muted-foreground">Total Return</div>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">1.45</div>
                <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
              </div>
              <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">-5.3%</div>
                <div className="text-sm text-muted-foreground">Max Drawdown</div>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={backtestData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="portfolio" stroke="hsl(var(--primary))" strokeWidth={2} name="Algorithm" />
                  <Line type="monotone" dataKey="benchmark" stroke="hsl(var(--muted-foreground))" strokeWidth={2} name="Benchmark" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Performance Metrics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Annual Return:</span>
                    <span className="font-mono">+15.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volatility:</span>
                    <span className="font-mono">12.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Win Rate:</span>
                    <span className="font-mono">62.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit Factor:</span>
                    <span className="font-mono">1.85</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Trade Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Trades:</span>
                    <span className="font-mono">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Winning Trades:</span>
                    <span className="font-mono">97</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Win:</span>
                    <span className="font-mono">+3.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Loss:</span>
                    <span className="font-mono">-1.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid gap-4">
              {[
                {
                  name: 'RSI Mean Reversion',
                  description: 'Buy when RSI < 30, sell when RSI > 70',
                  complexity: 'Beginner',
                  returns: '+12.5%'
                },
                {
                  name: 'Golden Cross Strategy',
                  description: '50-day MA crosses above 200-day MA',
                  complexity: 'Intermediate',
                  returns: '+18.3%'
                },
                {
                  name: 'Pairs Trading GOOG/MSFT',
                  description: 'Trade spread between correlated stocks',
                  complexity: 'Advanced',
                  returns: '+8.7%'
                }
              ].map((template, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{template.name}</h4>
                    <Badge variant="outline">{template.complexity}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Expected Return: <span className="text-green-600 font-mono">{template.returns}</span></span>
                    <Button size="sm">Use Template</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
