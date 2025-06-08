
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PredictionVotingProps {
  symbol: string;
  prediction: any;
}

export function PredictionVoting({ symbol, prediction }: PredictionVotingProps) {
  const [userVote, setUserVote] = useState<'UP' | 'DOWN' | null>(null);
  const [votes, setVotes] = useState({ up: 127, down: 43 }); // Mock data
  const { toast } = useToast();

  const handleVote = (direction: 'UP' | 'DOWN') => {
    if (userVote === direction) return;
    
    setUserVote(direction);
    setVotes(prev => ({
      up: direction === 'UP' ? prev.up + 1 : Math.max(0, prev.up - (userVote === 'UP' ? 1 : 0)),
      down: direction === 'DOWN' ? prev.down + 1 : Math.max(0, prev.down - (userVote === 'DOWN' ? 1 : 0))
    }));

    toast({
      title: "Vote Recorded!",
      description: `You voted ${direction} for ${symbol}`,
    });
  };

  const totalVotes = votes.up + votes.down;
  const upPercentage = totalVotes > 0 ? (votes.up / totalVotes) * 100 : 50;

  return (
    <Card className="p-4 bg-accent/50">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h4 className="font-semibold">Community Prediction</h4>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={userVote === 'UP' ? 'default' : 'outline'}
            onClick={() => handleVote('UP')}
            className="flex items-center gap-2 h-12"
          >
            <TrendingUp className="h-4 w-4" />
            <div className="text-left">
              <div className="font-semibold">Bullish</div>
              <div className="text-xs">{votes.up} votes</div>
            </div>
          </Button>

          <Button
            variant={userVote === 'DOWN' ? 'destructive' : 'outline'}
            onClick={() => handleVote('DOWN')}
            className="flex items-center gap-2 h-12"
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
