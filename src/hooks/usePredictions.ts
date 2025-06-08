
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Prediction {
  id: string;
  symbol: string;
  direction: 'UP' | 'DOWN';
  confidence: number;
  target_price: number;
  reasoning: string | null;
  sentiment: number | null;
  created_at: string;
  expires_at: string;
  actual_outcome: string | null;
}

export function usePredictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPredictions();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('predictions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'predictions'
        },
        () => {
          fetchPredictions();
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
        .limit(50);

      if (error) throw error;

      // Type assertion to ensure proper typing
      const typedPredictions = data?.map(prediction => ({
        ...prediction,
        direction: prediction.direction as 'UP' | 'DOWN'
      })) || [];

      setPredictions(typedPredictions);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPrediction = async (prediction: Omit<Prediction, 'id' | 'created_at' | 'expires_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('predictions')
        .insert([prediction])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error adding prediction:', error);
      throw error;
    }
  };

  return {
    predictions,
    loading,
    addPrediction,
    fetchPredictions
  };
}
