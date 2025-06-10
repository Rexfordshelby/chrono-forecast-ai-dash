
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, BarChart3, Target, PieChart, Activity, Database } from 'lucide-react';

export function AdvancedAnalytics() {
  const [selectedMetric, setSelectedMetric] = useState('portfolio');

  // Mock data for analytics
  const portfolioData = [
    { date: '2024-01', value: 10000, roi: 0, volatility: 12 },
    { date: '2024-02', value: 11200, roi: 12, volatility: 15 },
    { date: '2024-03', value: 10800, roi: 8, volatility: 18 },
    { date: '2024-04', value: 12500, roi: 25, volatility: 14 },
    { date: '2024-05', value: 13200, roi: 32, volatility: 11 },
    { date: '2024-06', value: 14100, roi: 41, volatility: 13 }
  ];

  const riskMetrics = [
    { metric: 'Sharpe Ratio', value: 1.85, benchmark: 1.2, status: 'good' },
    { metric: 'Beta', value: 0.92, benchmark: 1.0, status: 'neutral' },
    { metric: 'Max Drawdown', value: -8.5, benchmark: -10, status: 'good' },
    { metric: 'VaR (95%)', value: -3.2, benchmark: -5, status: 'good' },
    { metric: 'Sortino Ratio', value: 2.14, benchmark: 1.5, status: 'good' }
  ];

  const correlationData = [
    { asset: 'AAPL', correlation: 0.85, sector: 'Technology' },
    { asset: 'MSFT', correlation: 0.78, sector: 'Technology' },
    { asset: 'GOOGL', correlation: 0.72, sector: 'Technology' },
    { asset: 'SPY', correlation: 0.65, sector: 'Index' },
    { asset: 'TSLA', correlation: 0.45, sector: 'Automotive' }
  ];

  const sectorAllocation = [
    { sector: 'Technology', allocation: 45, performance: 12.5 },
    { sector: 'Healthcare', allocation: 20, performance: 8.3 },
    { sector: 'Finance', allocation: 15, performance: 6.7 },
    { sector: 'Energy', allocation: 10, performance: -2.1 },
    { sector: 'Real Estate', allocation: 10, performance: 4.8 }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Advanced Analytics Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="correlation">Correlation</TabsTrigger>
            <TabsTrigger value="attribution">Attribution</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Return</div>
                <div className="text-2xl font-bold text-blue-600">+41.0%</div>
                <div className="text-xs text-muted-foreground">vs Benchmark: +28.5%</div>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <div className="text-sm text-muted-foreground">Annualized Return</div>
                <div className="text-2xl font-bold text-green-600">+18.2%</div>
                <div className="text-xs text-muted-foreground">Since Inception</div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                <div className="text-sm text-muted-foreground">Win Rate</div>
                <div className="text-2xl font-bold text-purple-600">68.5%</div>
                <div className="text-xs text-muted-foreground">Profitable Trades</div>
              </div>
              <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                <div className="text-sm text-muted-foreground">Volatility</div>
                <div className="text-2xl font-bold text-orange-600">13.2%</div>
                <div className="text-xs text-muted-foreground">Annualized</div>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="roi" stroke="hsl(var(--destructive))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <div className="grid gap-4">
              {riskMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">{metric.metric}</div>
                    <div className="text-sm text-muted-foreground">Benchmark: {metric.benchmark}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{metric.value}</div>
                    <Badge variant={metric.status === 'good' ? 'default' : metric.status === 'neutral' ? 'secondary' : 'destructive'}>
                      {metric.status === 'good' ? 'Good' : metric.status === 'neutral' ? 'Neutral' : 'Poor'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="volatility" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="correlation" className="space-y-6">
            <div className="grid gap-4">
              {correlationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">{item.asset}</div>
                    <div className="text-sm text-muted-foreground">{item.sector}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{item.correlation.toFixed(2)}</div>
                    <Badge variant={item.correlation > 0.7 ? 'destructive' : item.correlation > 0.3 ? 'secondary' : 'default'}>
                      {item.correlation > 0.7 ? 'High' : item.correlation > 0.3 ? 'Medium' : 'Low'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={correlationData}>
                  <CartesianGrid />
                  <XAxis dataKey="asset" />
                  <YAxis dataKey="correlation" />
                  <Tooltip />
                  <Scatter dataKey="correlation" fill="hsl(var(--primary))" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="attribution" className="space-y-6">
            <div className="grid gap-4">
              {sectorAllocation.map((sector, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">{sector.sector}</div>
                    <div className="text-sm text-muted-foreground">Allocation: {sector.allocation}%</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${sector.performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {sector.performance >= 0 ? '+' : ''}{sector.performance}%
                    </div>
                    <div className="text-sm text-muted-foreground">Performance</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorAllocation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sector" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="allocation" fill="hsl(var(--primary))" />
                  <Bar dataKey="performance" fill="hsl(var(--destructive))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
