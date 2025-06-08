
import { TrendingUp, TrendingDown, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useVotes } from '@/hooks/useVotes';

interface PredictionVotingProps {
  symbol: string;
  prediction: any;
}

export function PredictionVoting({ symbol, prediction }: PredictionVotingProps) {
  const { votes, userVote, loading, vote } = useVotes(symbol);

  const totalVotes = votes.up + votes.down;
  const upPercentage = totalVotes > 0 ? (votes.up / totalVotes) * 100 : 50;

  if (loading) {
    return (
      <Card className="p-4 bg-accent/50">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-8 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-accent/50">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h4 className="font-semibold">Community Prediction</h4>
          <span className="text-sm text-muted-foreground">({totalVotes} votes)</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={userVote === 'UP' ? 'default' : 'outline'}
            onClick={() => vote('UP')}
            className="flex items-center gap-2 h-12"
            disabled={loading}
          >
            <TrendingUp className="h-4 w-4" />
            <div className="text-left">
              <div className="font-semibold">Bullish</div>
              <div className="text-xs">{votes.up} votes</div>
            </div>
          </Button>

          <Button
            variant={userVote === 'DOWN' ? 'destructive' : 'outline'}
            onClick={() => vote('DOWN')}
            className="flex items-center gap-2 h-12"
            disabled={loading}
          >
            <TrendingDown className="h-4 w-4" />
            <div className="text-left">
              <div className="font-semibold">Bearish</div>
              <div className="text-xs">{votes.down} votes</div>
            </div>
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Community Sentiment</span>
            <span>{upPercentage.toFixed(1)}% Bullish</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${upPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
