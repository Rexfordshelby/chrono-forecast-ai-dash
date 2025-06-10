
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Copy, TrendingUp, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';

interface Trader {
  id: string;
  name: string;
  avatar: string;
  performance: number;
  followers: number;
  winRate: number;
  trades: number;
  isVerified: boolean;
  strategy: string;
}

interface Trade {
  id: string;
  trader: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  timestamp: string;
  reasoning: string;
  likes: number;
  comments: number;
}

export function SocialTrading() {
  const [following, setFollowing] = useState<string[]>([]);

  const topTraders: Trader[] = [
    {
      id: '1',
      name: 'Alex Chen',
      avatar: '',
      performance: 45.2,
      followers: 12500,
      winRate: 78,
      trades: 156,
      isVerified: true,
      strategy: 'Growth Momentum'
    },
    {
      id: '2',
      name: 'Sarah Williams',
      avatar: '',
      performance: 38.7,
      followers: 8900,
      winRate: 72,
      trades: 203,
      isVerified: true,
      strategy: 'Value Investing'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      avatar: '',
      performance: 32.1,
      followers: 6700,
      winRate: 69,
      trades: 142,
      isVerified: false,
      strategy: 'Swing Trading'
    }
  ];

  const recentTrades: Trade[] = [
    {
      id: '1',
      trader: 'Alex Chen',
      symbol: 'AAPL',
      action: 'BUY',
      price: 175.50,
      quantity: 100,
      timestamp: '2 hours ago',
      reasoning: 'Strong earnings momentum and positive guidance for Q2',
      likes: 24,
      comments: 8
    },
    {
      id: '2',
      trader: 'Sarah Williams',
      symbol: 'MSFT',
      action: 'SELL',
      price: 420.30,
      quantity: 50,
      timestamp: '4 hours ago',
      reasoning: 'Taking profits at resistance level, expecting pullback',
      likes: 18,
      comments: 12
    },
    {
      id: '3',
      trader: 'Mike Johnson',
      symbol: 'NVDA',
      action: 'BUY',
      price: 850.75,
      quantity: 25,
      timestamp: '6 hours ago',
      reasoning: 'AI sector consolidation complete, bullish breakout expected',
      likes: 31,
      comments: 15
    }
  ];

  const toggleFollow = (traderId: string) => {
    setFollowing(prev => 
      prev.includes(traderId) 
        ? prev.filter(id => id !== traderId)
        : [...prev, traderId]
    );
  };

  const copyTrade = (trade: Trade) => {
    console.log('Copying trade:', trade);
    // Implementation would connect to broker API
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Social Trading Network
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="traders" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="traders">Top Traders</TabsTrigger>
            <TabsTrigger value="trades">Recent Trades</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>

          <TabsContent value="traders" className="space-y-4">
            {topTraders.map((trader) => (
              <div key={trader.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={trader.avatar} />
                      <AvatarFallback>{trader.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{trader.name}</span>
                        {trader.isVerified && <Badge variant="default">Verified</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">{trader.strategy}</div>
                    </div>
                  </div>
                  <Button
                    variant={following.includes(trader.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFollow(trader.id)}
                  >
                    {following.includes(trader.id) ? 'Following' : 'Follow'}
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">+{trader.performance}%</div>
                    <div className="text-xs text-muted-foreground">Performance</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{trader.followers.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{trader.winRate}%</div>
                    <div className="text-xs text-muted-foreground">Win Rate</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{trader.trades}</div>
                    <div className="text-xs text-muted-foreground">Trades</div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="trades" className="space-y-4">
            {recentTrades.map((trade) => (
              <div key={trade.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{trade.trader}</span>
                    <Badge variant={trade.action === 'BUY' ? 'default' : 'destructive'}>
                      {trade.action}
                    </Badge>
                    <span className="font-mono font-bold">{trade.symbol}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{trade.timestamp}</div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center gap-4 text-sm">
                    <span>Price: <span className="font-mono">${trade.price}</span></span>
                    <span>Quantity: <span className="font-mono">{trade.quantity}</span></span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-muted-foreground">{trade.reasoning}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {trade.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {trade.comments}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => copyTrade(trade)}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Trade
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="following" className="space-y-4">
            {following.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <p>You're not following any traders yet</p>
                <p className="text-sm">Follow top traders to see their trades here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topTraders.filter(t => following.includes(t.id)).map((trader) => (
                  <div key={trader.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{trader.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{trader.name}</div>
                          <div className="text-sm text-muted-foreground">{trader.strategy}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">+{trader.performance}%</div>
                        <div className="text-xs text-muted-foreground">Performance</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
