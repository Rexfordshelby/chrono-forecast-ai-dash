
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { TrendingUp, TrendingDown, Trophy, Target, Calendar, Award } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data
  const userData = {
    stats: {
      totalPredictions: 127,
      correctPredictions: 89,
      accuracy: 70.1,
      totalReturn: 12.5,
      rank: 284,
      points: 1547,
      streak: 7
    },
    recentPredictions: [
      { symbol: 'AAPL', prediction: 'BULLISH', date: '2024-01-08', result: 'CORRECT', return: 3.2 },
      { symbol: 'NVDA', prediction: 'BULLISH', date: '2024-01-07', result: 'CORRECT', return: 5.8 },
      { symbol: 'TSLA', prediction: 'BEARISH', date: '2024-01-06', result: 'WRONG', return: -2.1 },
      { symbol: 'META', prediction: 'BULLISH', date: '2024-01-05', result: 'CORRECT', return: 2.7 },
      { symbol: 'GOOGL', prediction: 'BEARISH', date: '2024-01-04', result: 'CORRECT', return: 1.9 }
    ],
    achievements: [
      { name: 'First Prediction', description: 'Made your first prediction', unlocked: true, date: '2023-12-01' },
      { name: 'Hot Streak', description: '5 correct predictions in a row', unlocked: true, date: '2024-01-05' },
      { name: 'Market Prophet', description: '75% accuracy over 50 predictions', unlocked: false, progress: 68 },
      { name: 'Diversified', description: 'Predict on 25 different stocks', unlocked: true, date: '2024-01-03' },
      { name: 'Community Leader', description: 'Top 100 on leaderboard', unlocked: false, progress: 284 }
    ],
    portfolio: {
      totalValue: 25847.32,
      todayChange: 342.18,
      todayChangePercent: 1.34,
      positions: [
        { symbol: 'AAPL', shares: 15, avgCost: 175.30, currentPrice: 185.23, value: 2778.45 },
        { symbol: 'NVDA', shares: 8, avgCost: 820.50, currentPrice: 875.23, value: 7001.84 },
        { symbol: 'TSLA', shares: 12, avgCost: 255.20, currentPrice: 245.78, value: 2949.36 },
        { symbol: 'MSFT', shares: 20, avgCost: 380.75, currentPrice: 395.42, value: 7908.40 }
      ]
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="text-xl">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user?.user_metadata?.name || 'User'}</h1>
          <p className="text-muted-foreground">{user?.email}</p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              Rank #{userData.stats.rank}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              {userData.stats.points} Points
            </Badge>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                    <p className="text-2xl font-bold">{userData.stats.accuracy}%</p>
                  </div>
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Return</p>
                    <p className="text-2xl font-bold text-green-600">+{userData.stats.totalReturn}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Predictions</p>
                    <p className="text-2xl font-bold">{userData.stats.totalPredictions}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                    <p className="text-2xl font-bold">{userData.stats.streak}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userData.recentPredictions.slice(0, 5).map((prediction, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-semibold">{prediction.symbol}</span>
                        <Badge variant={prediction.prediction === 'BULLISH' ? 'default' : 'destructive'} className="text-xs">
                          {prediction.prediction}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={prediction.result === 'CORRECT' ? 'default' : 'destructive'} className="text-xs">
                          {prediction.result}
                        </Badge>
                        <span className={`text-sm font-mono ${prediction.return > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {prediction.return > 0 ? '+' : ''}{prediction.return}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Correct Predictions</span>
                  <span className="font-semibold">{userData.stats.correctPredictions}/{userData.stats.totalPredictions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Best Streak</span>
                  <span className="font-semibold">12 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Member Since</span>
                  <span className="font-semibold">Dec 2023</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Favorite Stock</span>
                  <span className="font-semibold font-mono">AAPL</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prediction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData.recentPredictions.map((prediction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="font-mono font-semibold text-lg">{prediction.symbol}</span>
                      <Badge variant={prediction.prediction === 'BULLISH' ? 'default' : 'destructive'}>
                        {prediction.prediction}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{prediction.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={prediction.result === 'CORRECT' ? 'default' : 'destructive'}>
                        {prediction.result}
                      </Badge>
                      <span className={`font-mono font-semibold ${prediction.return > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {prediction.return > 0 ? '+' : ''}{prediction.return}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Portfolio Overview</CardTitle>
                <div className="text-right">
                  <div className="text-2xl font-bold">${userData.portfolio.totalValue.toLocaleString()}</div>
                  <div className={`text-sm flex items-center gap-1 ${userData.portfolio.todayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {userData.portfolio.todayChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {userData.portfolio.todayChange >= 0 ? '+' : ''}${userData.portfolio.todayChange} ({userData.portfolio.todayChangePercent}%)
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData.portfolio.positions.map((position) => {
                  const totalReturn = ((position.currentPrice - position.avgCost) / position.avgCost) * 100;
                  return (
                    <div key={position.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <span className="font-mono font-semibold text-lg">{position.symbol}</span>
                        <div className="text-sm text-muted-foreground">
                          {position.shares} shares @ ${position.avgCost}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${position.value.toLocaleString()}</div>
                        <div className={`text-sm ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {userData.achievements.map((achievement, index) => (
              <Card key={index} className={achievement.unlocked ? 'bg-accent/50' : 'opacity-75'}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${achievement.unlocked ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <Award className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      {achievement.unlocked ? (
                        <p className="text-xs text-muted-foreground mt-2">
                          Unlocked on {achievement.date}
                        </p>
                      ) : achievement.progress && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}/100</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${achievement.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
