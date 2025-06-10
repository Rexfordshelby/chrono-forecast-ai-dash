
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, Brain, Users, Eye, Bell, Shield, 
  Globe, Smartphone, Crown, DollarSign, BookOpen, 
  BarChart3, Activity, Target, Zap, Database,
  MessageSquare, Award, Calendar, Map, Settings
} from 'lucide-react';

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  status: 'live' | 'coming-soon' | 'premium';
  category: 'trading' | 'analysis' | 'social' | 'mobile' | 'premium' | 'education';
}

const CURRENT_FEATURES: Feature[] = [
  {
    icon: TrendingUp,
    title: 'Real-time Market Data',
    description: 'Live price feeds for stocks, crypto, forex, and commodities from multiple global exchanges.',
    status: 'live',
    category: 'trading'
  },
  {
    icon: Brain,
    title: 'AI-Powered Predictions',
    description: 'Advanced machine learning algorithms provide price predictions with confidence intervals.',
    status: 'live',
    category: 'analysis'
  },
  {
    icon: Users,
    title: 'Community Voting',
    description: 'Vote on price predictions and see real-time community sentiment on any asset.',
    status: 'live',
    category: 'social'
  },
  {
    icon: BarChart3,
    title: 'Advanced Charting',
    description: 'Professional-grade charts with 50+ technical indicators and drawing tools.',
    status: 'live',
    category: 'analysis'
  },
  {
    icon: Eye,
    title: 'Portfolio Tracking',
    description: 'Track your investments across multiple asset classes with real-time P&L.',
    status: 'live',
    category: 'trading'
  },
  {
    icon: Bell,
    title: 'Price Alerts',
    description: 'Customizable alerts for price movements, technical signals, and news events.',
    status: 'live',
    category: 'trading'
  },
  {
    icon: Award,
    title: 'Leaderboard System',
    description: 'Compete with other traders and earn points for accurate predictions.',
    status: 'live',
    category: 'social'
  },
  {
    icon: Globe,
    title: 'Global Market Coverage',
    description: 'Access to 50+ exchanges worldwide including US, European, Asian, and emerging markets.',
    status: 'live',
    category: 'trading'
  }
];

const UPCOMING_FEATURES: Feature[] = [
  {
    icon: Database,
    title: 'Advanced Analytics Dashboard',
    description: 'Comprehensive analytics with risk metrics, correlation analysis, and performance attribution.',
    status: 'coming-soon',
    category: 'analysis'
  },
  {
    icon: MessageSquare,
    title: 'Social Trading Network',
    description: 'Follow top traders, copy their strategies, and share your own trading ideas.',
    status: 'coming-soon',
    category: 'social'
  },
  {
    icon: BookOpen,
    title: 'Trading Academy',
    description: 'Interactive courses, webinars, and tutorials for traders of all skill levels.',
    status: 'coming-soon',
    category: 'education'
  },
  {
    icon: Smartphone,
    title: 'Mobile Trading App',
    description: 'Native iOS and Android apps with full trading capabilities and push notifications.',
    status: 'coming-soon',
    category: 'mobile'
  },
  {
    icon: Activity,
    title: 'Real-time News Feed',
    description: 'AI-curated news feed with sentiment analysis and market impact scoring.',
    status: 'live',
    category: 'analysis'
  },
  {
    icon: Target,
    title: 'Options Trading',
    description: 'Options chain analysis, Greeks calculator, and strategy builder.',
    status: 'coming-soon',
    category: 'trading'
  },
  {
    icon: Zap,
    title: 'Algorithmic Trading',
    description: 'Build, backtest, and deploy custom trading algorithms with no-code interface.',
    status: 'coming-soon',
    category: 'premium'
  },
  {
    icon: Calendar,
    title: 'Economic Calendar',
    description: 'Track important economic events, earnings releases, and their market impact.',
    status: 'coming-soon',
    category: 'analysis'
  },
  {
    icon: Map,
    title: 'Market Heat Maps',
    description: 'Visual representation of market performance across sectors and geographies.',
    status: 'coming-soon',
    category: 'analysis'
  },
  {
    icon: Settings,
    title: 'Custom Screeners',
    description: 'Build complex stock screeners with 100+ fundamental and technical criteria.',
    status: 'coming-soon',
    category: 'analysis'
  }
];

const PREMIUM_FEATURES: Feature[] = [
  {
    icon: Crown,
    title: 'Institutional-Grade Data',
    description: 'Access to Level 2 market data, order book analysis, and institutional flow indicators.',
    status: 'premium',
    category: 'premium'
  },
  {
    icon: DollarSign,
    title: 'Advanced Risk Management',
    description: 'Portfolio risk analytics, stress testing, and automated risk controls.',
    status: 'premium',
    category: 'premium'
  },
  {
    icon: Shield,
    title: 'Priority Support',
    description: '24/7 dedicated support team with direct access to platform developers.',
    status: 'premium',
    category: 'premium'
  },
  {
    icon: Brain,
    title: 'AI Trading Signals',
    description: 'Proprietary AI models providing high-frequency trading signals and market predictions.',
    status: 'premium',
    category: 'premium'
  }
];

export function FeaturesShowcase() {
  const getStatusColor = (status: Feature['status']) => {
    switch (status) {
      case 'live': return 'default';
      case 'coming-soon': return 'secondary';
      case 'premium': return 'destructive';
    }
  };

  const getStatusText = (status: Feature['status']) => {
    switch (status) {
      case 'live': return 'Live';
      case 'coming-soon': return 'Coming Soon';
      case 'premium': return 'Premium';
    }
  };

  const FeatureCard = ({ feature }: { feature: Feature }) => (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <feature.icon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{feature.title}</CardTitle>
          </div>
          <Badge variant={getStatusColor(feature.status)}>
            {getStatusText(feature.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{feature.description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Chronos Platform Features</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover all the powerful features that make Chronos the ultimate AI-powered trading and market analysis platform.
        </p>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Features</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Features</TabsTrigger>
          <TabsTrigger value="premium">Premium Features</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CURRENT_FEATURES.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {UPCOMING_FEATURES.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="premium" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Premium Features</h2>
            <p className="text-muted-foreground">
              Unlock advanced capabilities with our premium subscription
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {PREMIUM_FEATURES.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
          <div className="text-center">
            <Button size="lg" className="mt-4">
              Upgrade to Premium
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h3 className="text-2xl font-bold mb-4">Platform Highlights</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-primary">10,000+</div>
            <div className="text-sm text-muted-foreground">Global Assets</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">50+</div>
            <div className="text-sm text-muted-foreground">Exchanges</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">95%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground">Market Data</div>
          </div>
        </div>
      </div>
    </div>
  );
}
