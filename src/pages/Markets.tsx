
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { AdvancedChart } from '@/components/advanced-chart';

const Markets = () => {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock market data
  const marketData = {
    indices: [
      { name: 'S&P 500', value: 4750.25, change: 23.45, changePercent: 0.49 },
      { name: 'NASDAQ', value: 14825.36, change: -45.23, changePercent: -0.30 },
      { name: 'DOW JONES', value: 37856.47, change: 156.78, changePercent: 0.42 },
      { name: 'NIFTY 50', value: 21547.90, change: 89.25, changePercent: 0.42 },
      { name: 'SENSEX', value: 71072.35, change: 298.45, changePercent: 0.42 }
    ],
    sectors: [
      { name: 'Technology', change: 1.25, stocks: ['AAPL', 'GOOGL', 'MSFT', 'NVDA'] },
      { name: 'Healthcare', change: -0.45, stocks: ['JNJ', 'PFE', 'UNH', 'MRNA'] },
      { name: 'Finance', change: 0.85, stocks: ['JPM', 'BAC', 'WFC', 'GS'] },
      { name: 'Energy', change: 2.15, stocks: ['XOM', 'CVX', 'COP', 'EOG'] }
    ],
    topMovers: {
      gainers: [
        { symbol: 'NVDA', name: 'NVIDIA Corp', price: 875.23, change: 45.67, changePercent: 5.51 },
        { symbol: 'TSLA', name: 'Tesla Inc', price: 245.78, change: 12.34, changePercent: 5.29 },
        { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2847.50, change: 89.25, changePercent: 3.24 }
      ],
      losers: [
        { symbol: 'META', name: 'Meta Platforms', price: 365.42, change: -18.78, changePercent: -4.89 },
        { symbol: 'NFLX', name: 'Netflix Inc', price: 445.67, change: -15.23, changePercent: -3.31 },
        { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3456.78, change: -89.45, changePercent: -2.52 }
      ]
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Global Markets</h1>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stocks, indices, or companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="indices">Indices</TabsTrigger>
          <TabsTrigger value="sectors">Sectors</TabsTrigger>
          <TabsTrigger value="movers">Top Movers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AdvancedChart symbol={selectedStock} />
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Market Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {marketData.indices.slice(0, 3).map((index) => (
                    <div key={index.name} className="flex justify-between items-center">
                      <span className="font-medium">{index.name}</span>
                      <div className="text-right">
                        <div className="font-mono">{index.value.toLocaleString()}</div>
                        <div className={`text-sm flex items-center gap-1 ${index.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {index.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {index.change >= 0 ? '+' : ''}{index.change} ({index.changePercent}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" onClick={() => setSelectedStock('AAPL')}>
                    View Apple (AAPL)
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setSelectedStock('RELIANCE')}>
                    View Reliance Industries
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setSelectedStock('NVDA')}>
                    View NVIDIA (NVDA)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="indices" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketData.indices.map((index) => (
              <Card key={index.name} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{index.name}</h3>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{index.value.toLocaleString()}</div>
                    <div className={`flex items-center gap-1 ${index.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {index.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span>{index.change >= 0 ? '+' : ''}{index.change} ({index.changePercent}%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {marketData.sectors.map((sector) => (
              <Card key={sector.name}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{sector.name}</CardTitle>
                    <Badge variant={sector.change >= 0 ? 'default' : 'destructive'}>
                      {sector.change >= 0 ? '+' : ''}{sector.change}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {sector.stocks.map((stock) => (
                      <Button
                        key={stock}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedStock(stock)}
                        className="justify-start"
                      >
                        {stock}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="movers" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Top Gainers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {marketData.topMovers.gainers.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => setSelectedStock(stock.symbol)}
                  >
                    <div>
                      <div className="font-semibold">{stock.symbol}</div>
                      <div className="text-sm text-muted-foreground">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono">${stock.price}</div>
                      <div className="text-sm text-green-600">
                        +{stock.change} ({stock.changePercent}%)
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  Top Losers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {marketData.topMovers.losers.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => setSelectedStock(stock.symbol)}
                  >
                    <div>
                      <div className="font-semibold">{stock.symbol}</div>
                      <div className="text-sm text-muted-foreground">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono">${stock.price}</div>
                      <div className="text-sm text-red-600">
                        {stock.change} ({stock.changePercent}%)
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Markets;
