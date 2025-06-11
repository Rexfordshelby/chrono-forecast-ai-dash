
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, Minus, DollarSign, AlertTriangle, Shield } from 'lucide-react';
import { useRealTimeStock } from '@/hooks/useRealTimeStock';

interface SimpleTradingSignalsProps {
  symbol: string;
}

interface SimpleSignal {
  action: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';
  confidence: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  reasoning: string;
}

export function SimpleTradingSignals({ symbol }: SimpleTradingSignalsProps) {
  const { data: stockData, loading } = useRealTimeStock(symbol);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trading Signals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (!stockData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trading Signals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const generateSignal = (): SimpleSignal => {
    const currentPrice = stockData.price;
    const changePercent = stockData.changePercent;
    const volume = stockData.volume;
    
    // Simple but effective signal logic
    let action: SimpleSignal['action'] = 'HOLD';
    let confidence = 60;
    let risk: SimpleSignal['risk'] = 'MEDIUM';
    let reasoning = '';

    // Volume analysis (higher volume = more reliable signal)
    const volumeMultiplier = volume > 50000000 ? 1.2 : volume > 20000000 ? 1.0 : 0.8;
    
    if (changePercent > 3) {
      action = 'STRONG_BUY';
      confidence = Math.min(85, 70 + (changePercent * 2)) * volumeMultiplier;
      risk = changePercent > 5 ? 'HIGH' : 'MEDIUM';
      reasoning = `Strong upward momentum (+${changePercent.toFixed(2)}%). High buying pressure detected.`;
    } else if (changePercent > 1) {
      action = 'BUY';
      confidence = Math.min(75, 60 + (changePercent * 3)) * volumeMultiplier;
      risk = 'LOW';
      reasoning = `Positive momentum (+${changePercent.toFixed(2)}%). Good entry opportunity.`;
    } else if (changePercent < -3) {
      action = 'STRONG_SELL';
      confidence = Math.min(80, 70 + (Math.abs(changePercent) * 2)) * volumeMultiplier;
      risk = 'HIGH';
      reasoning = `Sharp decline (-${Math.abs(changePercent).toFixed(2)}%). Strong selling pressure.`;
    } else if (changePercent < -1) {
      action = 'SELL';
      confidence = Math.min(70, 60 + (Math.abs(changePercent) * 2)) * volumeMultiplier;
      risk = 'MEDIUM';
      reasoning = `Negative momentum (-${Math.abs(changePercent).toFixed(2)}%). Consider exit.`;
    } else {
      action = 'HOLD';
      confidence = 50 + (Math.random() * 10);
      risk = 'LOW';
      reasoning = `Sideways movement (${changePercent.toFixed(2)}%). Wait for clear direction.`;
    }

    // Calculate price levels
    const entryPrice = action.includes('BUY') ? currentPrice : currentPrice * 0.98;
    const targetPrice = action.includes('BUY') ? currentPrice * 1.06 : currentPrice * 0.94;
    const stopLoss = action.includes('BUY') ? currentPrice * 0.95 : currentPrice * 1.05;

    return {
      action,
      confidence: Math.round(confidence),
      risk,
      entryPrice,
      targetPrice,
      stopLoss,
      reasoning
    };
  };

  const signal = generateSignal();

  const getSignalColor = (action: string) => {
    switch (action) {
      case 'STRONG_BUY': return 'bg-green-600 text-white';
      case 'BUY': return 'bg-green-500 text-white';
      case 'HOLD': return 'bg-yellow-500 text-white';
      case 'SELL': return 'bg-red-500 text-white';
      case 'STRONG_SELL': return 'bg-red-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSignalIcon = (action: string) => {
    switch (action) {
      case 'STRONG_BUY':
      case 'BUY':
        return <TrendingUp className="h-5 w-5" />;
      case 'SELL':
      case 'STRONG_SELL':
        return <TrendingDown className="h-5 w-5" />;
      default:
        return <Minus className="h-5 w-5" />;
    }
  };

  if (!agreedToTerms) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Trading Signals - Terms Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>IMPORTANT:</strong> Trading signals are for educational purposes only.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Not financial advice - for educational use only</p>
            <p>• All investments carry risk of loss</p>
            <p>• Only invest what you can afford to lose</p>
            <p>• Do your own research before trading</p>
            <p>• Past performance doesn't guarantee future results</p>
          </div>
          
          <Button 
            onClick={() => setAgreedToTerms(true)}
            className="w-full"
          >
            I Understand - Show Trading Signals
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Trading Signal - {symbol}</span>
          <Badge className={getSignalColor(signal.action)}>
            {getSignalIcon(signal.action)}
            {signal.action.replace('_', ' ')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Signal */}
        <div className="text-center p-6 rounded-lg border-2 border-dashed bg-muted/50">
          <div className="text-3xl font-bold mb-2">
            {signal.action.replace('_', ' ')}
          </div>
          <div className="text-lg text-muted-foreground mb-2">
            {signal.confidence}% Confidence
          </div>
          <div className="text-sm text-muted-foreground">
            {signal.reasoning}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <Shield className="h-5 w-5 mx-auto mb-1" />
            <div className="text-sm text-muted-foreground">Risk Level</div>
            <div className={`font-bold ${
              signal.risk === 'LOW' ? 'text-green-600' : 
              signal.risk === 'MEDIUM' ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {signal.risk}
            </div>
          </div>
          
          <div className="text-center p-3 bg-muted rounded-lg">
            <DollarSign className="h-5 w-5 mx-auto mb-1" />
            <div className="text-sm text-muted-foreground">Current Price</div>
            <div className="font-bold">${stockData.price.toFixed(2)}</div>
          </div>
          
          <div className="text-center p-3 bg-muted rounded-lg">
            <TrendingUp className="h-5 w-5 mx-auto mb-1" />
            <div className="text-sm text-muted-foreground">Target Price</div>
            <div className="font-bold">${signal.targetPrice.toFixed(2)}</div>
          </div>
        </div>

        {/* Price Levels */}
        <div className="space-y-3">
          <h4 className="font-semibold">Price Levels</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-sm text-green-600 dark:text-green-400">Entry Price</div>
              <div className="font-bold text-lg text-green-700 dark:text-green-300">
                ${signal.entryPrice.toFixed(2)}
              </div>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
              <div className="text-sm text-red-600 dark:text-red-400">Stop Loss</div>
              <div className="font-bold text-lg text-red-700 dark:text-red-300">
                ${signal.stopLoss.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Simple Action */}
        <div className="p-4 bg-accent rounded-lg">
          <h4 className="font-semibold mb-2">Recommended Action</h4>
          {signal.action.includes('BUY') && (
            <p className="text-sm text-green-700 dark:text-green-300">
              ✅ Consider buying at ${signal.entryPrice.toFixed(2)} with target ${signal.targetPrice.toFixed(2)}
            </p>
          )}
          {signal.action.includes('SELL') && (
            <p className="text-sm text-red-700 dark:text-red-300">
              ⚠️ Consider selling or avoiding new positions
            </p>
          )}
          {signal.action === 'HOLD' && (
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              ⏸️ Hold current positions. Wait for clearer signals.
            </p>
          )}
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Remember: This is educational content, not financial advice. Always do your own research.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
