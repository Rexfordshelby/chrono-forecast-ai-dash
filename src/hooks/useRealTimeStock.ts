
import { useState, useEffect } from 'react';
import { realTimeDataService, RealTimePrice } from '@/lib/realtime-data';

export function useRealTimeStock(symbol: string) {
  const [data, setData] = useState<RealTimePrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;

    setLoading(true);
    setError(null);

    const unsubscribe = realTimeDataService.subscribe(symbol, (newData) => {
      setData(newData);
      setLoading(false);
      setError(null);
    });

    // Check if we have cached data
    const cachedData = realTimeDataService.getCurrentPrice(symbol);
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
    }

    return unsubscribe;
  }, [symbol]);

  return { data, loading, error };
}
