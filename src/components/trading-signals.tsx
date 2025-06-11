
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, Minus, Target, Shield, DollarSign, AlertTriangle } from 'lucide-react';
import { useRealTimeStock } from '@/hooks/useRealTimeStock';

interface TradingSignalsProps {
  symbol: string;
}

interface TradingSignal {
  signal: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';
  confidence: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  positionSize: number;
  reasoning: string;
  timeframe: string;
}

export function TradingSignals({ symbol }: TradingSignalsProps) {
  const { data: stockData, loading } = useRealTimeStock(symbol);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);

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
          <p className="text-muted-foreground">No data available for trading signals</p>
        </CardContent>
      </Card>
    );
  }

  const generateTradingSignal = (): TradingSignal => {
    const currentPrice = stockData.price;
    const changePercent = stockData.changePercent;
    const volume = stockData.volume;
    
    // Advanced signal calculation based on multiple factors
    let signal: TradingSignal['signal'] = 'HOLD';
    let confidence = 50;
    let riskLevel: TradingSignal['riskLevel'] = 'MEDIUM';
    let reasoning = '';

    // Volume analysis
    const avgVolume = 50000000; // Baseline average volume
    const volumeRatio = volume / avgVolume;
    
    // Price momentum analysis
    if (changePercent > 3 && volumeRatio > 1.5) {
      signal = 'STRONG_BUY';
      confidence = 85;
      riskLevel = 'MEDIUM';
      reasoning = `Strong upward momentum (+${changePercent.toFixed(2)}%) with high volume (${volumeRatio.toFixed(1)}x average). Institutional buying detected.`;
    } else if (changePercent > 1.5 && volumeRatio > 1.2) {
      signal = 'BUY';
      confidence = 72;
      riskLevel = 'LOW';
      reasoning = `Positive momentum (+${changePercent.toFixed(2)}%) with above-average volume. Good entry opportunity.`;
    } else if (changePercent < -3 && volumeRatio > 1.5) {
      signal = 'STRONG_SELL';
      confidence = 80;
      riskLevel = 'HIGH';
      reasoning = `Sharp decline (-${Math.abs(changePercent).toFixed(2)}%) with high volume. Potential institutional selling.`;
    } else if (changePercent < -1.5 && volumeRatio > 1.2) {
      signal = 'SELL';
      confidence = 68;
      riskLevel = 'MEDIUM';
      reasoning = `Negative momentum (-${Math.abs(changePercent).toFixed(2)}%) with elevated volume. Consider exit.`;
    } else {
      signal = 'HOLD';
      confidence = 55;
      riskLevel = 'LOW';
      reasoning = `Sideways movement (${changePercent.toFixed(2)}%). Wait for clearer direction before taking action.`;
    }

    // Calculate position sizing based on risk level
    const basePosition = 1000; // $1000 base position
    let positionSize = basePosition;
    
    switch (riskLevel) {
      case 'LOW':
        positionSize = basePosition * 1.5;
        break;
      case 'MEDIUM':
        positionSize = basePosition;
        break;
      case 'HIGH':
        positionSize = basePosition * 0.5;
        break;
    }

    // Calculate entry/exit prices and stop loss
    const entryPrice = signal.includes('BUY') ? currentPrice : currentPrice * 0.98;
    const exitPrice = signal.includes('BUY') ? currentPrice * 1.08 : currentPrice * 0.95;
    const stopLoss = signal.includes('BUY') ? currentPrice * 0.95 : currentPrice * 1.05;

    return {
      signal,
      confidence,
      riskLevel,
      entryPrice,
      exitPrice,
      stopLoss,
      positionSize,
      reasoning,
      timeframe: '24-48 hours'
    };
  };

  const tradingSignal = generateTradingSignal();

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'STRONG_BUY': return 'bg-green-600 text-white';
      case 'BUY': return 'bg-green-500 text-white';
      case 'HOLD': return 'bg-yellow-500 text-white';
      case 'SELL': return 'bg-red-500 text-white';
      case 'STRONG_SELL': return 'bg-red-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'STRONG_BUY': return <TrendingUp className="h-5 w-5" />;
      case 'BUY': return <TrendingUp className="h-4 w-4" />;
      case 'HOLD': return <Minus className="h-4 w-4" />;
      case 'SELL': return <TrendingDown className="h-4 w-4" />;
      case 'STRONG_SELL': return <TrendingDown className="h-5 w-5" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'HIGH': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!hasAgreedToTerms) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Trading Signals - Terms & Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>IMPORTANT DISCLAIMER:</strong> Please read and agree to our terms before accessing trading signals.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold">Terms and Conditions:</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Trading signals are for educational purposes only and not financial advice</li>
              <li>• Past performance does not guarantee future results</li>
              <li>• All investments carry risk and you may lose money</li>
              <li>• Only invest what you can afford to lose</li>
              <li>• Always do your own research before making investment decisions</li>
              <li>• Consider consulting with a qualified financial advisor</li>
              <li>• We are not responsible for any financial losses</li>
              <li>• Market conditions can change rapidly</li>
            </ul>
            
            <h4 className="font-semibold mt-4">Risk Warning:</h4>
            <p className="text-muted-foreground">
              Trading stocks involves substantial risk of loss. Market volatility can result in significant financial losses. 
              Never invest borrowed money or funds you cannot afford to lose entirely.
            </p>
          </div>
          
          <Button 
            onClick={() => setHasAgreedToTerms(true)}
            className="w-full"
          >
            I Understand and Agree to These Terms
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Trading Signals - {symbol}</span>
          <Badge className={getSignalColor(tradingSignal.signal)}>
            {getSignalIcon(tradingSignal.signal)}
            {tradingSignal.signal.replace('_', ' ')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Signal */}
        <div className="text-center p-4 rounded-lg border-2 border-dashed">
          <div className="text-3xl font-bold mb-2">
            {tradingSignal.signal.replace('_', ' ')}
          </div>
          <div className="text-sm text-muted-foreground">
            Confidence: {tradingSignal.confidence}% | Timeframe: {tradingSignal.timeframe}
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <Shield className="h-6 w-6 mx-auto mb-1" />
            <div className="text-sm text-muted-foreground">Risk Level</div>
            <div className={`font-bold ${getRiskColor(tradingSignal.riskLevel)}`}>
              {tradingSignal.riskLevel}
            </div>
          </div>
          
          <div className="text-center p-3 bg-muted rounded-lg">
            <Target className="h-6 w-6 mx-auto mb-1" />
            <div className="text-sm text-muted-foreground">Confidence</div>
            <div className="font-bold">{tradingSignal.confidence}%</div>
          </div>
          
          <div className="text-center p-3 bg-muted rounded-lg">
            <DollarSign className="h-6 w-6 mx-auto mb-1" />
            <div className="text-sm text-muted-foreground">Position Size</div>
            <div className="font-bold">${tradingSignal.positionSize}</div>
          </div>
        </div>

        {/* Price Levels */}
        <div className="space-y-3">
          <h4 className="font-semibold">Price Levels</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Entry Price</div>
              <div className="font-bold text-lg">${tradingSignal.entryPrice.toFixed(2)}</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Target Exit</div>
              <div className="font-bold text-lg">${tradingSignal.exitPrice.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
            <div className="text-sm text-red-600 dark:text-red-400">Stop Loss (Risk Management)</div>
            <div className="font-bold text-lg text-red-700 dark:text-red-300">${tradingSignal.stopLoss.toFixed(2)}</div>
            <div className="text-xs text-red-600 dark:text-red-400 mt-1">
              Always set stop loss to limit potential losses
            </div>
          </div>
        </div>

        {/* Reasoning */}
        <div className="space-y-2">
          <h4 className="font-semibold">Analysis & Reasoning</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tradingSignal.reasoning}
          </p>
        </div>

        {/* Action Steps */}
        <div className="space-y-2">
          <h4 className="font-semibold">Recommended Actions</h4>
          <div className="text-sm space-y-1">
            {tradingSignal.signal.includes('BUY') && (
              <div className="p-2 bg-green-50 dark:bg-green-950 rounded text-green-700 dark:text-green-300">
                ✅ Consider buying at ${tradingSignal.entryPrice.toFixed(2)} with stop loss at ${tradingSignal.stopLoss.toFixed(2)}
              </div>
            )}
            {tradingSignal.signal.includes('SELL') && (
              <div className="p-2 bg-red-50 dark:bg-red-950 rounded text-red-700 dark:text-red-300">
                ⚠️ Consider selling or avoiding new positions. Set stop loss if holding.
              </div>
            )}
            {tradingSignal.signal === 'HOLD' && (
              <div className="p-2 bg-yellow-50 dark:bg-yellow-950 rounded text-yellow-700 dark:text-yellow-300">
                ⏸️ Hold current positions. Wait for clearer market direction.
              </div>
            )}
          </div>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Remember: This is not financial advice. Always do your own research and never invest more than you can afford to lose.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
