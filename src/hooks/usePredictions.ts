
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Prediction {
  id: string;
  symbol: string;
  direction: 'UP' | 'DOWN';
  confidence: number;
  target_price: number;
  reasoning: string;
  sentiment: number;
  created_at: string;
  expires_at: string;
  actual_outcome: 'UP' | 'DOWN' | 'PENDING' | null;
}

export function usePredictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('predictions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'predictions'
        },
        (payload) => {
          setPredictions(prev => [payload.new as Prediction, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'predictions'
        },
        (payload) => {
          setPredictions(prev => 
            prev.map(p => p.id === payload.new.id ? payload.new as Prediction : p)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setPredictions(data || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPredictionForSymbol = (symbol: string) => {
    return predictions.find(p => 
      p.symbol === symbol && 
      new Date(p.expires_at) > new Date()
    );
  };

  return {
    predictions,
    loading,
    getPredictionForSymbol,
    refetch: fetchPredictions
  };
}
