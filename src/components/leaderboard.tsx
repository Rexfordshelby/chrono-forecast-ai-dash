
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardEntry {
  user_id: string;
  username: string;
  correct_predictions: number;
  total_predictions: number;
  accuracy_rate: number;
  rank: number;
}

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // This would be better implemented as a database view or function
      const { data: predictions, error } = await supabase
        .from('predictions')
        .select(`
          *,
          profiles!inner(username)
        `)
        .not('actual_outcome', 'is', null);

      if (error) throw error;

      // Calculate user statistics
      const userStats = new Map();
      
      predictions?.forEach((prediction: any) => {
        const userId = prediction.profiles?.user_id;
        const username = prediction.profiles?.username || 'Anonymous';
        
        if (!userStats.has(userId)) {
          userStats.set(userId, {
            user_id: userId,
            username,
            correct_predictions: 0,
            total_predictions: 0
          });
        }
        
        const stats = userStats.get(userId);
        stats.total_predictions++;
        
        if (prediction.actual_outcome === prediction.direction) {
          stats.correct_predictions++;
        }
      });

      // Convert to array and calculate accuracy rates
      const leaderboardData = Array.from(userStats.values())
        .map((stats, index) => ({
          ...stats,
          accuracy_rate: stats.total_predictions > 0 ? 
            (stats.correct_predictions / stats.total_predictions) * 100 : 0,
          rank: index + 1
        }))
        .sort((a, b) => b.accuracy_rate - a.accuracy_rate)
        .slice(0, 10) // Top 10
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h3 className="text-xl font-bold">🏆 Prediction Leaderboard</h3>
        
        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <div 
              key={entry.user_id}
              className={`flex items-center justify-between p-4 rounded-lg border
                ${entry.rank <= 3 ? 'bg-accent/50 border-primary/20' : 'bg-background'}
              `}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(entry.rank)}
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {entry.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{entry.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.correct_predictions}/{entry.total_predictions} predictions
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <Badge 
                  variant={entry.accuracy_rate >= 70 ? 'default' : 
                           entry.accuracy_rate >= 50 ? 'secondary' : 'outline'}
                >
                  {entry.accuracy_rate.toFixed(1)}%
                </Badge>
              </div>
            </div>
          ))}
          
          {leaderboard.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No predictions completed yet. Be the first to make a prediction!</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
