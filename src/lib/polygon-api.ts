
// Polygon.io API integration for comprehensive market data
const POLYGON_API_KEY = 'kKkg5aV0I3rOwgb9RDZjgtNbQJHTcLnV';

export interface PolygonTickerData {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
  currency_name: string;
  cik?: string;
  composite_figi?: string;
  share_class_figi?: string;
  last_updated_utc: string;
}

export interface PolygonAggregateData {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: Array<{
    v: number; // volume
    vw: number; // volume weighted average price
    o: number; // open
    c: number; // close
    h: number; // high
    l: number; // low
    t: number; // timestamp
    n: number; // number of transactions
  }>;
}

export interface PolygonMarketStatus {
  market: string;
  serverTime: string;
  exchanges: {
    nasdaq: string;
    nyse: string;
    otc: string;
  };
  currencies: {
    fx: string;
    crypto: string;
  };
}

export async function fetchPolygonTickers(market?: string): Promise<PolygonTickerData[]> {
  try {
    const url = new URL('https://api.polygon.io/v3/reference/tickers');
    url.searchParams.append('apikey', POLYGON_API_KEY);
    url.searchParams.append('limit', '1000');
    url.searchParams.append('active', 'true');
    
    if (market) {
      url.searchParams.append('market', market);
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching Polygon tickers:', error);
    return [];
  }
}

export async function fetchPolygonAggregates(
  ticker: string,
  multiplier: number = 1,
  timespan: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' = 'day',
  from: string,
  to: string
): Promise<PolygonAggregateData | null> {
  try {
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}?adjusted=true&sort=asc&limit=5000&apikey=${POLYGON_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Polygon aggregates:', error);
    return null;
  }
}

export async function fetchPolygonMarketStatus(): Promise<PolygonMarketStatus | null> {
  try {
    const url = `https://api.polygon.io/v1/marketstatus/now?apikey=${POLYGON_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching market status:', error);
    return null;
  }
}

export async function fetchPolygonTickerDetails(ticker: string) {
  try {
    const url = `https://api.polygon.io/v3/reference/tickers/${ticker}?apikey=${POLYGON_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching ticker details:', error);
    return null;
  }
}
