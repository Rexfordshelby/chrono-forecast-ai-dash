
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('symbol')
        .eq('user_id', user.id);

      if (error) throw error;

      setFavorites(data?.map(f => f.symbol) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (symbol: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save favorites",
        variant: "destructive",
      });
      return;
    }

    try {
      const isFavorite = favorites.includes(symbol);

      if (isFavorite) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('symbol', symbol);

        if (error) throw error;

        setFavorites(prev => prev.filter(s => s !== symbol));
        toast({
          title: "Removed from favorites",
          description: `${symbol} removed from your watchlist`,
        });
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            symbol
          });

        if (error) throw error;

        setFavorites(prev => [...prev, symbol]);
        toast({
          title: "Added to favorites",
          description: `${symbol} added to your watchlist`,
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    }
  };

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite: (symbol: string) => favorites.includes(symbol)
  };
}
