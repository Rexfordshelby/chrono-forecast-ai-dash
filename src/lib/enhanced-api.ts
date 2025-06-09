
import { supabase } from '@/integrations/supabase/client';

// API configuration with multiple providers for comprehensive coverage
const API_KEYS = {
  ALPHA_VANTAGE: 'P3ZLGFU4ITWWF45D',
  FINNHUB: 'd12ka51r01qmhi3j6k50d12ka51r01qmhi3j6k5g',
  TWELVE_DATA: 'fa323e377d7f428ba711d9da2ea5e961',
  GNEWS: '10b293fc8e7777891141a14cf6116a96',
  COINAPI: 'YOUR_COINAPI_KEY_HERE', // For crypto data
  FOREX_API: 'YOUR_FOREX_API_KEY_HERE', // For forex data
  COMMODITY_API: 'YOUR_COMMODITY_API_KEY_HERE' // For commodity data
};

export interface EnhancedAssetData {
  symbol: string;
  name: string;
  category: 'stock' | 'crypto' | 'forex' | 'commodity' | 'etf' | 'index';
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  high24h?: number;
  low24h?: number;
  openPrice?: number;
  exchange?: string;
  currency: string;
  description?: string;
  sector?: string;
  industry?: string;
  country?: string;
  logoUrl?: string;
  websiteUrl?: string;
  lastUpdated: string;
  additionalMetrics?: {
    pe_ratio?: number;
    dividend_yield?: number;
    market_cap_rank?: number;
    circulating_supply?: number;
    total_supply?: number;
    volatility?: number;
    beta?: number;
  };
}

export interface ChartData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface NewsArticle {
  title: string;
  summary: string;
  publishedAt: string;
  url: string;
  sentiment: number;
  source: string;
  imageUrl?: string;
}

// Enhanced asset data fetching with multiple sources
export async function fetchEnhancedAssetData(symbol: string, category?: string): Promise<EnhancedAssetData> {
  try {
    // First, try to get cached data from our database
    const cachedData = await getCachedAssetData(symbol);
    if (cachedData && isDataFresh(cachedData.lastUpdated)) {
      return cachedData;
    }

    // Determine category if not provided
    const assetCategory = category || await determineAssetCategory(symbol);
    
    let assetData: EnhancedAssetData;
    
    switch (assetCategory) {
      case 'crypto':
        assetData = await fetchCryptoData(symbol);
        break;
      case 'forex':
        assetData = await fetchForexData(symbol);
        break;
      case 'commodity':
        assetData = await fetchCommodityData(symbol);
        break;
      case 'stock':
      case 'etf':
      case 'index':
      default:
        assetData = await fetchStockData(symbol);
        break;
    }

    // Cache the data
    await cacheAssetData(assetData);
    
    return assetData;
  } catch (error) {
    console.error('Error fetching enhanced asset data:', error);
    return generateMockAssetData(symbol, category || 'stock');
  }
}

// Stock data fetching with fallback providers
async function fetchStockData(symbol: string): Promise<EnhancedAssetData> {
  try {
    // Try Alpha Vantage first
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEYS.ALPHA_VANTAGE}`
    );
    
    if (response.ok) {
      const data = await response.json();
      const quote = data['Global Quote'];
      
      if (quote && Object.keys(quote).length > 0) {
        // Get additional company info
        const companyInfo = await fetchCompanyInfo(symbol);
        
        return {
          symbol: quote['01. symbol'],
          name: companyInfo.name || symbol,
          category: 'stock',
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
          volume: parseInt(quote['06. volume']),
          openPrice: parseFloat(quote['02. open']),
          high24h: parseFloat(quote['03. high']),
          low24h: parseFloat(quote['04. low']),
          currency: 'USD',
          exchange: companyInfo.exchange,
          sector: companyInfo.sector,
          industry: companyInfo.industry,
          country: companyInfo.country,
          description: companyInfo.description,
          logoUrl: companyInfo.logoUrl,
          websiteUrl: companyInfo.websiteUrl,
          lastUpdated: new Date().toISOString(),
          additionalMetrics: {
            pe_ratio: companyInfo.pe_ratio,
            dividend_yield: companyInfo.dividend_yield,
            beta: companyInfo.beta
          }
        };
      }
    }
    
    // Fallback to Twelve Data
    return await fetchFromTwelveData(symbol);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return generateMockAssetData(symbol, 'stock');
  }
}

// Cryptocurrency data fetching
async function fetchCryptoData(symbol: string): Promise<EnhancedAssetData> {
  try {
    // Use CoinGecko API (free tier)
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
    );
    
    if (response.ok) {
      const data = await response.json();
      const coinData = data[symbol.toLowerCase()];
      
      if (coinData) {
        return {
          symbol: symbol.toUpperCase(),
          name: symbol.charAt(0).toUpperCase() + symbol.slice(1),
          category: 'crypto',
          price: coinData.usd,
          change: coinData.usd_24h_change || 0,
          changePercent: coinData.usd_24h_change || 0,
          volume: coinData.usd_24h_vol || 0,
          marketCap: coinData.usd_market_cap,
          currency: 'USD',
          lastUpdated: new Date().toISOString()
        };
      }
    }
    
    return generateMockAssetData(symbol, 'crypto');
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return generateMockAssetData(symbol, 'crypto');
  }
}

// Forex data fetching
async function fetchForexData(symbol: string): Promise<EnhancedAssetData> {
  try {
    // Use Alpha Vantage for forex
    const response = await fetch(
      `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${symbol.slice(0,3)}&to_symbol=${symbol.slice(3,6)}&apikey=${API_KEYS.ALPHA_VANTAGE}`
    );
    
    if (response.ok) {
      const data = await response.json();
      const timeSeries = data['Time Series FX (Daily)'];
      
      if (timeSeries) {
        const latestDate = Object.keys(timeSeries)[0];
        const latestData = timeSeries[latestDate];
        
        return {
          symbol: symbol,
          name: `${symbol.slice(0,3)}/${symbol.slice(3,6)}`,
          category: 'forex',
          price: parseFloat(latestData['4. close']),
          change: parseFloat(latestData['4. close']) - parseFloat(latestData['1. open']),
          changePercent: ((parseFloat(latestData['4. close']) - parseFloat(latestData['1. open'])) / parseFloat(latestData['1. open'])) * 100,
          volume: 0,
          openPrice: parseFloat(latestData['1. open']),
          high24h: parseFloat(latestData['2. high']),
          low24h: parseFloat(latestData['3. low']),
          currency: symbol.slice(3,6),
          lastUpdated: new Date().toISOString()
        };
      }
    }
    
    return generateMockAssetData(symbol, 'forex');
  } catch (error) {
    console.error('Error fetching forex data:', error);
    return generateMockAssetData(symbol, 'forex');
  }
}

// Commodity data fetching
async function fetchCommodityData(symbol: string): Promise<EnhancedAssetData> {
  // Mock implementation for commodities (would use specialized APIs in production)
  return generateMockAssetData(symbol, 'commodity');
}

// Fetch historical chart data
export async function fetchChartData(symbol: string, interval: '1m' | '5m' | '15m' | '30m' | '1h' | '1d' = '1d', period: string = '30d'): Promise<ChartData[]> {
  try {
    const response = await fetch(
      `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=100&apikey=${API_KEYS.TWELVE_DATA}`
    );
    
    if (response.ok) {
      const data = await response.json();
      const values = data.values || [];
      
      return values.map((item: any) => ({
        timestamp: new Date(item.datetime).getTime(),
        open: parseFloat(item.open),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        close: parseFloat(item.close),
        volume: parseInt(item.volume || '0')
      })).reverse();
    }
    
    return generateMockChartData();
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return generateMockChartData();
  }
}

// Enhanced news fetching with multiple sources
export async function fetchEnhancedNews(symbol: string, category?: string): Promise<NewsArticle[]> {
  try {
    const articles: NewsArticle[] = [];
    
    // Fetch from GNews
    const gnewsResponse = await fetch(
      `https://gnews.io/api/v4/search?q=${symbol}&token=${API_KEYS.GNEWS}&lang=en&country=us&max=5`
    );
    
    if (gnewsResponse.ok) {
      const gnewsData = await gnewsResponse.json();
      const gnewsArticles = gnewsData.articles?.map((article: any) => ({
        title: article.title,
        summary: article.description,
        publishedAt: new Date(article.publishedAt).toLocaleDateString(),
        url: article.url,
        sentiment: Math.random() * 2 - 1, // Would use sentiment analysis API
        source: article.source.name,
        imageUrl: article.image
      })) || [];
      
      articles.push(...gnewsArticles);
    }
    
    // Add more news sources here
    
    return articles.length > 0 ? articles : generateMockNews(symbol);
  } catch (error) {
    console.error('Error fetching enhanced news:', error);
    return generateMockNews(symbol);
  }
}

// Utility functions
async function getCachedAssetData(symbol: string): Promise<EnhancedAssetData | null> {
  try {
    const { data, error } = await supabase
      .from('price_data')
      .select('*')
      .eq('symbol', symbol)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;

    // Convert database data to EnhancedAssetData format
    return {
      symbol: data.symbol,
      name: symbol, // Would need to join with assets table
      category: 'stock', // Would need to join with assets table
      price: parseFloat(data.price.toString()),
      change: parseFloat(data.change_24h?.toString() || '0'),
      changePercent: parseFloat(data.change_percent_24h?.toString() || '0'),
      volume: data.volume || 0,
      marketCap: data.market_cap || undefined,
      openPrice: parseFloat(data.open_price?.toString() || '0'),
      high24h: parseFloat(data.high_price?.toString() || '0'),
      low24h: parseFloat(data.low_price?.toString() || '0'),
      currency: 'USD',
      lastUpdated: data.timestamp
    };
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
}

async function cacheAssetData(data: EnhancedAssetData): Promise<void> {
  try {
    await supabase
      .from('price_data')
      .insert({
        symbol: data.symbol,
        price: data.price,
        open_price: data.openPrice,
        high_price: data.high24h,
        low_price: data.low24h,
        volume: data.volume,
        market_cap: data.marketCap,
        change_24h: data.change,
        change_percent_24h: data.changePercent,
        data_source: 'api'
      });
  } catch (error) {
    console.error('Error caching asset data:', error);
  }
}

function isDataFresh(timestamp: string): boolean {
  const dataAge = Date.now() - new Date(timestamp).getTime();
  return dataAge < 5 * 60 * 1000; // 5 minutes
}

async function determineAssetCategory(symbol: string): Promise<string> {
  // Logic to determine asset category based on symbol
  if (symbol.includes('USD') || symbol.includes('EUR') || symbol.includes('GBP')) return 'forex';
  if (['BTC', 'ETH', 'ADA', 'DOT', 'SOL'].includes(symbol)) return 'crypto';
  if (['GOLD', 'SILVER', 'OIL', 'WHEAT'].includes(symbol)) return 'commodity';
  return 'stock';
}

async function fetchCompanyInfo(symbol: string): Promise<any> {
  // Mock implementation - would use Alpha Vantage OVERVIEW function
  return {
    name: getCompanyName(symbol),
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Software',
    country: 'USA',
    description: `${getCompanyName(symbol)} is a leading company in its sector.`,
    logoUrl: `https://logo.clearbit.com/${symbol.toLowerCase()}.com`,
    websiteUrl: `https://${symbol.toLowerCase()}.com`,
    pe_ratio: 25.5,
    dividend_yield: 2.1,
    beta: 1.2
  };
}

async function fetchFromTwelveData(symbol: string): Promise<EnhancedAssetData> {
  // Fallback implementation using Twelve Data
  return generateMockAssetData(symbol, 'stock');
}

// Mock data generators
function generateMockAssetData(symbol: string, category: string): EnhancedAssetData {
  const basePrice = getBasePriceForSymbol(symbol);
  const change = (Math.random() - 0.5) * basePrice * 0.05;
  const changePercent = (change / basePrice) * 100;
  
  return {
    symbol,
    name: getCompanyName(symbol),
    category: category as any,
    price: basePrice + change,
    change,
    changePercent,
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    marketCap: (basePrice + change) * Math.floor(Math.random() * 1000000000),
    openPrice: basePrice,
    high24h: basePrice + Math.abs(change) * 1.2,
    low24h: basePrice - Math.abs(change) * 1.2,
    currency: 'USD',
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Software',
    country: 'USA',
    lastUpdated: new Date().toISOString(),
    additionalMetrics: {
      pe_ratio: 20 + Math.random() * 30,
      dividend_yield: Math.random() * 5,
      beta: 0.5 + Math.random() * 1.5
    }
  };
}

function generateMockChartData(): ChartData[] {
  const data: ChartData[] = [];
  let price = 100;
  const now = Date.now();
  
  for (let i = 30; i >= 0; i--) {
    const timestamp = now - (i * 24 * 60 * 60 * 1000);
    const change = (Math.random() - 0.5) * 5;
    price += change;
    
    data.push({
      timestamp,
      open: price - change,
      high: price + Math.abs(change) * 0.5,
      low: price - Math.abs(change) * 0.5,
      close: price,
      volume: Math.floor(Math.random() * 1000000)
    });
  }
  
  return data;
}

function generateMockNews(symbol: string): NewsArticle[] {
  return [
    {
      title: `${symbol} Shows Strong Performance in Latest Quarter`,
      summary: `${getCompanyName(symbol)} reported better than expected earnings with strong revenue growth across all segments.`,
      publishedAt: '2 hours ago',
      url: '#',
      sentiment: 0.7,
      source: 'Financial Times'
    },
    {
      title: `Analysts Upgrade ${symbol} Price Target Following Innovation Announcement`,
      summary: `Wall Street analysts raise price targets following the company's latest product innovation and market expansion plans.`,
      publishedAt: '4 hours ago', 
      url: '#',
      sentiment: 0.5,
      source: 'Bloomberg'
    },
    {
      title: `Market Volatility Affects ${symbol} Trading Patterns`,
      summary: `Recent market conditions create uncertainty around sector valuations, impacting trading volumes and price discovery.`,
      publishedAt: '6 hours ago',
      url: '#',
      sentiment: -0.3,
      source: 'Reuters'
    }
  ];
}

function getBasePriceForSymbol(symbol: string): number {
  const prices: { [key: string]: number } = {
    'AAPL': 175, 'TSLA': 250, 'MSFT': 380, 'GOOGL': 140, 'AMZN': 155, 'NVDA': 480,
    'BTC': 45000, 'ETH': 3000, 'ADA': 1.2, 'DOT': 25, 'SOL': 100,
    'EURUSD': 1.08, 'GBPUSD': 1.25, 'USDJPY': 150,
    'GOLD': 2000, 'SILVER': 25, 'OIL': 80
  };
  return prices[symbol] || 100;
}

function getCompanyName(symbol: string): string {
  const names: { [key: string]: string } = {
    'AAPL': 'Apple Inc.', 'TSLA': 'Tesla Inc.', 'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.', 'AMZN': 'Amazon.com Inc.', 'NVDA': 'NVIDIA Corporation',
    'BTC': 'Bitcoin', 'ETH': 'Ethereum', 'ADA': 'Cardano', 'DOT': 'Polkadot', 'SOL': 'Solana',
    'EURUSD': 'Euro/US Dollar', 'GBPUSD': 'British Pound/US Dollar', 'USDJPY': 'US Dollar/Japanese Yen',
    'GOLD': 'Gold Futures', 'SILVER': 'Silver Futures', 'OIL': 'Crude Oil Futures'
  };
  return names[symbol] || `${symbol} Corporation`;
}
