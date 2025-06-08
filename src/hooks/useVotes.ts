
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface VoteData {
  up: number;
  down: number;
}

export function useVotes(symbol: string) {
  const [votes, setVotes] = useState<VoteData>({ up: 0, down: 0 });
  const [userVote, setUserVote] = useState<'UP' | 'DOWN' | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchVotes();
    if (user) {
      fetchUserVote();
    }

    // Subscribe to real-time vote updates
    const channel = supabase
      .channel(`votes-${symbol}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_votes',
          filter: `symbol=eq.${symbol}`
        },
        () => {
          fetchVotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [symbol, user]);

  const fetchVotes = async () => {
    try {
      const { data, error } = await supabase
        .from('user_votes')
        .select('vote')
        .eq('symbol', symbol);

      if (error) throw error;

      const upVotes = data?.filter(v => v.vote === 'UP').length || 0;
      const downVotes = data?.filter(v => v.vote === 'DOWN').length || 0;

      setVotes({ up: upVotes, down: downVotes });
    } catch (error) {
      console.error('Error fetching votes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVote = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_votes')
        .select('vote')
        .eq('user_id', user.id)
        .eq('symbol', symbol)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // Type assertion for proper typing
      setUserVote(data?.vote as 'UP' | 'DOWN' || null);
    } catch (error) {
      console.error('Error fetching user vote:', error);
    }
  };

  const vote = async (direction: 'UP' | 'DOWN') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      if (userVote === direction) {
        // Remove vote if clicking same direction
        const { error } = await supabase
          .from('user_votes')
          .delete()
          .eq('user_id', user.id)
          .eq('symbol', symbol);

        if (error) throw error;
        setUserVote(null);
      } else {
        // Insert or update vote
        const { error } = await supabase
          .from('user_votes')
          .upsert({
            user_id: user.id,
            symbol,
            vote: direction
          });

        if (error) throw error;
        setUserVote(direction);
      }

      await fetchVotes();
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to record vote",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    votes,
    userVote,
    loading,
    vote
  };
}
