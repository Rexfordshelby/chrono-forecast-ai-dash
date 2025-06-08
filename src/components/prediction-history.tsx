
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, TrendingUp, TrendingDown } from 'lucide-react';

const mockHistory = [
  { symbol: 'AAPL', prediction: 'UP', confidence: 78, actual: 'UP', timestamp: '2 hours ago' },
  { symbol: 'TSLA', prediction: 'DOWN', confidence: 65, actual: 'DOWN', timestamp: '4 hours ago' },
  { symbol: 'MSFT', prediction: 'UP', confidence: 82, actual: 'UP', timestamp: '6 hours ago' },
  { symbol: 'GOOGL', prediction: 'UP', confidence: 71, actual: 'DOWN', timestamp: '8 hours ago' },
  { symbol: 'NVDA', prediction: 'DOWN', confidence: 69, actual: 'UP', timestamp: '10 hours ago' },
];

export function PredictionHistory() {
  const accuracy = mockHistory.filter(h => h.prediction === h.actual).length / mockHistory.length * 100;

  return (
    <Card className="p-6 h-fit">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Prediction History</h3>
        </div>

        <div className="p-3 bg-accent rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{accuracy.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">AI Accuracy (24h)</div>
          </div>
        </div>

        <div className="space-y-3">
          {mockHistory.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold">{item.symbol}</span>
                  {item.prediction === item.actual ? (
                    <Badge variant="default" className="text-xs">✓</Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">✗</Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{item.timestamp}</div>
              </div>
              <div className="text-right">
                <div className={`flex items-center gap-1 ${item.prediction === 'UP' ? 'text-profit' : 'text-loss'}`}>
                  {item.prediction === 'UP' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span className="text-xs font-semibold">{item.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
