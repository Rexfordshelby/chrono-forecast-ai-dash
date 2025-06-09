
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, BarChart3, Target, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AnalyticsData {
  date: string;
  accuracy: number;
  predictions: number;
  profitLoss: number;
}

export function PremiumAnalytics() {
  const [isPremium, setIsPremium] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Check if user has premium subscription
    checkPremiumStatus();
    if (isPremium) {
      fetchAnalyticsData();
    }
  }, [user, isPremium]);

  const checkPremiumStatus = async () => {
    // This would check Stripe subscription status in a real app
    // For demo purposes, we'll simulate premium status
    setIsPremium(true); // Set to true for demo
  };

  const fetchAnalyticsData = async () => {
    // Generate mock analytics data
    const mockData: AnalyticsData[] = [
      { date: '2024-01-01', accuracy: 65, predictions: 5, profitLoss: 120 },
      { date: '2024-01-02', accuracy: 70, predictions: 8, profitLoss: 250 },
      { date: '2024-01-03', accuracy: 60, predictions: 6, profitLoss: -80 },
      { date: '2024-01-04', accuracy: 80, predictions: 10, profitLoss: 450 },
      { date: '2024-01-05', accuracy: 75, predictions: 7, profitLoss: 320 },
      { date: '2024-01-06', accuracy: 85, predictions: 12, profitLoss: 680 },
      { date: '2024-01-07', accuracy: 72, predictions: 9, profitLoss: 290 },
    ];
    
    setAnalyticsData(mockData);
  };

  const upgradeToPremium = () => {
    // This would integrate with Stripe for payments
    console.log('Upgrade to premium clicked');
  };

  if (!isPremium) {
    return (
      <Card className="p-6 text-center">
        <div className="space-y-4">
          <Crown className="h-12 w-12 mx-auto text-yellow-500" />
          <h3 className="text-xl font-bold">Premium Analytics</h3>
          <p className="text-muted-foreground">
            Unlock advanced analytics, detailed performance insights, and exclusive features.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-primary" />
              <span>Detailed accuracy tracking</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span>Performance charts & trends</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Profit/Loss analysis</span>
            </div>
          </div>
          <Button onClick={upgradeToPremium} className="w-full">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Premium - $9.99/month
          </Button>
        </div>
      </Card>
    );
  }

  const totalPredictions = analyticsData.reduce((sum, day) => sum + day.predictions, 0);
  const avgAccuracy = analyticsData.reduce((sum, day) => sum + day.accuracy, 0) / analyticsData.length;
  const totalProfitLoss = analyticsData.reduce((sum, day) => sum + day.profitLoss, 0);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Premium Analytics
          </h3>
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700">
            Premium
          </Badge>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-accent/50 rounded-lg text-center">
            <p className="text-2xl font-bold">{totalPredictions}</p>
            <p className="text-sm text-muted-foreground">Total Predictions</p>
          </div>
          <div className="p-4 bg-accent/50 rounded-lg text-center">
            <p className="text-2xl font-bold">{avgAccuracy.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">Avg Accuracy</p>
          </div>
          <div className="p-4 bg-accent/50 rounded-lg text-center">
            <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-profit' : 'text-loss'}`}>
              {totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss}
            </p>
            <p className="text-sm text-muted-foreground">Total P&L</p>
          </div>
        </div>

        {/* Charts */}
        <Tabs defaultValue="accuracy" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="accuracy">Accuracy Trend</TabsTrigger>
            <TabsTrigger value="predictions">Prediction Volume</TabsTrigger>
            <TabsTrigger value="profit">Profit/Loss</TabsTrigger>
          </TabsList>
          
          <TabsContent value="accuracy" className="mt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="accuracy" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="predictions" className="mt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="predictions" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="profit" className="mt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="profitLoss" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
