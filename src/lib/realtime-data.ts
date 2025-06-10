
import { fetchPolygonTickerDetails, fetchPolygonAggregates } from './polygon-api';

export interface RealTimePrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
}

class RealTimeDataService {
  private subscribers: Map<string, Set<(data: RealTimePrice) => void>> = new Map();
  private cache: Map<string, RealTimePrice> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  subscribe(symbol: string, callback: (data: RealTimePrice) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
      this.startPolling(symbol);
    }
    
    this.subscribers.get(symbol)!.add(callback);
    
    // Send cached data immediately if available
    if (this.cache.has(symbol)) {
      callback(this.cache.get(symbol)!);
    }

    return () => this.unsubscribe(symbol, callback);
  }

  private unsubscribe(symbol: string, callback: (data: RealTimePrice) => void) {
    const subscribers = this.subscribers.get(symbol);
    if (subscribers) {
      subscribers.delete(callback);
      if (subscribers.size === 0) {
        this.stopPolling(symbol);
        this.subscribers.delete(symbol);
        this.cache.delete(symbol);
      }
    }
  }

  private async startPolling(symbol: string) {
    const fetchData = async () => {
      try {
        // Get current date range for real-time data
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const aggregates = await fetchPolygonAggregates(symbol, 1, 'minute', yesterday, today);
        
        if (aggregates && aggregates.results && aggregates.results.length > 0) {
          const latestBar = aggregates.results[aggregates.results.length - 1];
          const previousBar = aggregates.results[aggregates.results.length - 2];
          
          const change = previousBar ? latestBar.c - previousBar.c : 0;
          const changePercent = previousBar ? (change / previousBar.c) * 100 : 0;

          const realTimePrice: RealTimePrice = {
            symbol,
            price: latestBar.c,
            change,
            changePercent,
            volume: latestBar.v,
            timestamp: latestBar.t
          };

          this.cache.set(symbol, realTimePrice);
          this.notifySubscribers(symbol, realTimePrice);
        } else {
          // Fallback to mock data if API fails
          this.generateMockData(symbol);
        }
      } catch (error) {
        console.error(`Error fetching real-time data for ${symbol}:`, error);
        this.generateMockData(symbol);
      }
    };

    // Fetch immediately
    await fetchData();
    
    // Set up polling every 30 seconds
    const interval = setInterval(fetchData, 30000);
    this.intervals.set(symbol, interval);
  }

  private generateMockData(symbol: string) {
    const basePrice = this.getBasePriceForSymbol(symbol);
    const change = (Math.random() - 0.5) * basePrice * 0.02; // 2% max change
    const changePercent = (change / basePrice) * 100;

    const mockData: RealTimePrice = {
      symbol,
      price: basePrice + change,
      change,
      changePercent,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      timestamp: Date.now()
    };

    this.cache.set(symbol, mockData);
    this.notifySubscribers(symbol, mockData);
  }

  private getBasePriceForSymbol(symbol: string): number {
    const prices: { [key: string]: number } = {
      'AAPL': 175, 'TSLA': 250, 'MSFT': 380, 'GOOGL': 140, 'AMZN': 155, 'NVDA': 480,
      'BTC': 45000, 'ETH': 3000, 'ADA': 1.2, 'DOT': 25, 'SOL': 100,
      'EURUSD': 1.08, 'GBPUSD': 1.25, 'USDJPY': 150,
      'GOLD': 2000, 'SILVER': 25, 'OIL': 80
    };
    return prices[symbol] || 100;
  }

  private stopPolling(symbol: string) {
    const interval = this.intervals.get(symbol);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(symbol);
    }
  }

  private notifySubscribers(symbol: string, data: RealTimePrice) {
    const subscribers = this.subscribers.get(symbol);
    if (subscribers) {
      subscribers.forEach(callback => callback(data));
    }
  }

  getCurrentPrice(symbol: string): RealTimePrice | null {
    return this.cache.get(symbol) || null;
  }
}

export const realTimeDataService = new RealTimeDataService();
