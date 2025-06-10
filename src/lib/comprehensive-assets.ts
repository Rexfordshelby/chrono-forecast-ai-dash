// Comprehensive global asset database including stocks, crypto, commodities, forex
import { PolygonTickerData, fetchPolygonTickers } from './polygon-api';

export interface ComprehensiveAsset {
  symbol: string;
  name: string;
  type: 'stock' | 'crypto' | 'forex' | 'commodity' | 'etf' | 'index' | 'bond';
  market: string;
  exchange?: string;
  country: string;
  sector?: string;
  industry?: string;
  currency: string;
  marketCap?: number;
  isActive: boolean;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
}

// Global Cryptocurrency Database
export const GLOBAL_CRYPTOCURRENCIES: ComprehensiveAsset[] = [
  // Major Cryptocurrencies
  { symbol: 'BTC', name: 'Bitcoin', type: 'crypto', market: 'crypto', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'ETH', name: 'Ethereum', type: 'crypto', market: 'crypto', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'BNB', name: 'Binance Coin', type: 'crypto', market: 'crypto', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'XRP', name: 'Ripple', type: 'crypto', market: 'crypto', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'ADA', name: 'Cardano', type: 'crypto', market: 'crypto', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'SOL', name: 'Solana', type: 'crypto', market: 'crypto', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'DOGE', name: 'Dogecoin', type: 'crypto', market: 'crypto', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'AVAX', name: 'Avalanche', type: 'crypto', market: 'crypto', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'DOT', name: 'Polkadot', type: 'crypto', market: 'crypto', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'MATIC', name: 'Polygon', type: 'crypto', market: 'crypto', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'LINK', name: 'Chainlink', type: 'crypto', market: 'crypto', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'UNI', name: 'Uniswap', type: 'crypto', market: 'crypto', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'LTC', name: 'Litecoin', type: 'crypto', market: 'crypto', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'ATOM', name: 'Cosmos', type: 'crypto', market: 'crypto', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'ALGO', name: 'Algorand', type: 'crypto', market: 'crypto', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'VET', name: 'VeChain', type: 'crypto', market: 'crypto', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'FIL', name: 'Filecoin', type: 'crypto', market: 'crypto', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'NEAR', name: 'NEAR Protocol', type: 'crypto', market: 'crypto', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'AAVE', name: 'Aave', type: 'crypto', market: 'crypto', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'COMP', name: 'Compound', type: 'crypto', market: 'crypto', country: 'Global', currency: 'USD', isActive: true }
];

// Global Forex Pairs
export const GLOBAL_FOREX: ComprehensiveAsset[] = [
  // Major Currency Pairs
  { symbol: 'EURUSD', name: 'Euro/US Dollar', type: 'forex', market: 'forex', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'GBPUSD', name: 'British Pound/US Dollar', type: 'forex', market: 'forex', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'USDJPY', name: 'US Dollar/Japanese Yen', type: 'forex', market: 'forex', country: 'Global', currency: 'JPY', isActive: true },
  { symbol: 'USDCHF', name: 'US Dollar/Swiss Franc', type: 'forex', market: 'forex', country: 'Global', currency: 'CHF', isActive: true },
  { symbol: 'AUDUSD', name: 'Australian Dollar/US Dollar', type: 'forex', market: 'forex', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'USDCAD', name: 'US Dollar/Canadian Dollar', type: 'forex', market: 'forex', country: 'Global', currency: 'CAD', isActive: true },
  { symbol: 'NZDUSD', name: 'New Zealand Dollar/US Dollar', type: 'forex', market: 'forex', country: 'Global', currency: 'USD', isActive: true },
  
  // Minor Currency Pairs
  { symbol: 'EURGBP', name: 'Euro/British Pound', type: 'forex', market: 'forex', country: 'Global', currency: 'GBP', isActive: true },
  { symbol: 'EURJPY', name: 'Euro/Japanese Yen', type: 'forex', market: 'forex', country: 'Global', currency: 'JPY', isActive: true },
  { symbol: 'GBPJPY', name: 'British Pound/Japanese Yen', type: 'forex', market: 'forex', country: 'Global', currency: 'JPY', isActive: true },
  { symbol: 'EURCHF', name: 'Euro/Swiss Franc', type: 'forex', market: 'forex', country: 'Global', currency: 'CHF', isActive: true },
  { symbol: 'EURAUD', name: 'Euro/Australian Dollar', type: 'forex', market: 'forex', country: 'Global', currency: 'AUD', isActive: true },
  { symbol: 'EURCAD', name: 'Euro/Canadian Dollar', type: 'forex', market: 'forex', country: 'Global', currency: 'CAD', isActive: true },
  { symbol: 'GBPCHF', name: 'British Pound/Swiss Franc', type: 'forex', market: 'forex', country: 'Global', currency: 'CHF', isActive: true },
  { symbol: 'GBPAUD', name: 'British Pound/Australian Dollar', type: 'forex', market: 'forex', country: 'Global', currency: 'AUD', isActive: true },
  { symbol: 'GBPCAD', name: 'British Pound/Canadian Dollar', type: 'forex', market: 'forex', country: 'Global', currency: 'CAD', isActive: true },
  { symbol: 'AUDCAD', name: 'Australian Dollar/Canadian Dollar', type: 'forex', market: 'forex', country: 'Global', currency: 'CAD', isActive: true },
  { symbol: 'AUDCHF', name: 'Australian Dollar/Swiss Franc', type: 'forex', market: 'forex', country: 'Global', currency: 'CHF', isActive: true },
  { symbol: 'AUDJPY', name: 'Australian Dollar/Japanese Yen', type: 'forex', market: 'forex', country: 'Global', currency: 'JPY', isActive: true },
  { symbol: 'CADCHF', name: 'Canadian Dollar/Swiss Franc', type: 'forex', market: 'forex', country: 'Global', currency: 'CHF', isActive: true },
  { symbol: 'CADJPY', name: 'Canadian Dollar/Japanese Yen', type: 'forex', market: 'forex', country: 'Global', currency: 'JPY', isActive: true }
];

// Global Commodities
export const GLOBAL_COMMODITIES: ComprehensiveAsset[] = [
  // Precious Metals
  { symbol: 'GOLD', name: 'Gold Futures', type: 'commodity', market: 'commodity', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'SILVER', name: 'Silver Futures', type: 'commodity', market: 'commodity', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'PLATINUM', name: 'Platinum Futures', type: 'commodity', market: 'commodity', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'PALLADIUM', name: 'Palladium Futures', type: 'commodity', market: 'commodity', country: 'Global', currency: 'USD', isActive: true },
  
  // Energy
  { symbol: 'CRUDE', name: 'Crude Oil Futures', type: 'commodity', market: 'commodity', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'BRENT', name: 'Brent Oil Futures', type: 'commodity', market: 'commodity', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'NATGAS', name: 'Natural Gas Futures', type: 'commodity', market: 'commodity', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'HEATING', name: 'Heating Oil Futures', type: 'commodity', market: 'commodity', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'GASOLINE', name: 'Gasoline Futures', type: 'commodity', market: 'commodity', country: 'Global', currency: 'USD', isActive: true },
  
  // Agricultural
  { symbol: 'WHEAT', name: 'Wheat Futures', type: 'commodity', market: 'commodity', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'CORN', name: 'Corn Futures', type: 'commodity', market: 'commodity', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'SOYBEANS', name: 'Soybeans Futures', type: 'commodity', market: 'commodity', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'RICE', name: 'Rice Futures', type: 'commodity', market: 'commodity', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'SUGAR', name: 'Sugar Futures', type: 'commodity', market: 'commodity', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'COFFEE', name: 'Coffee Futures', type: 'commodity', market: 'commodity', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'COCOA', name: 'Cocoa Futures', type: 'commodity', market: 'commodity', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'COTTON', name: 'Cotton Futures', type: 'commodity', market: 'commodity', country: 'Global', currency: 'USD', isActive: true },
  
  // Metals
  { symbol: 'COPPER', name: 'Copper Futures', type: 'commodity', market: 'commodity', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'ALUMINUM', name: 'Aluminum Futures', type: 'commodity', market: 'commodity', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'ZINC', name: 'Zinc Futures', type: 'commodity', market: 'commodity', country: 'Global', currency: 'USD', isActive: true },
  { symbol: 'NICKEL', name: 'Nickel Futures', type: 'commodity', market: 'commodity', country: 'Global', currency: 'USD', isActive: true }
];

// Major Global Indices
export const GLOBAL_INDICES: ComprehensiveAsset[] = [
  // US Indices
  { symbol: 'SPX', name: 'S&P 500 Index', type: 'index', market: 'us', country: 'United States', currency: 'USD', isActive: true },
  { symbol: 'IXIC', name: 'NASDAQ Composite', type: 'index', market: 'us', country: 'United States', currency: 'USD', isActive: true },
  { symbol: 'DJI', name: 'Dow Jones Industrial Average', type: 'index', market: 'us', country: 'United States', currency: 'USD', isActive: true },
  { symbol: 'RUT', name: 'Russell 2000 Index', type: 'index', market: 'us', country: 'United States', currency: 'USD', isActive: true },
  { symbol: 'VIX', name: 'CBOE Volatility Index', type: 'index', market: 'us', country: 'United States', currency: 'USD', isActive: true },
  
  // European Indices
  { symbol: 'FTSE', name: 'FTSE 100 Index', type: 'index', market: 'uk', country: 'United Kingdom', currency: 'GBP', isActive: true },
  { symbol: 'DAX', name: 'DAX Performance Index', type: 'index', market: 'germany', country: 'Germany', currency: 'EUR', isActive: true },
  { symbol: 'CAC', name: 'CAC 40 Index', type: 'index', market: 'france', country: 'France', currency: 'EUR', isActive: true },
  { symbol: 'IBEX', name: 'IBEX 35 Index', type: 'index', market: 'spain', country: 'Spain', currency: 'EUR', isActive: true },
  { symbol: 'FTSEMIB', name: 'FTSE MIB Index', type: 'index', market: 'italy', country: 'Italy', currency: 'EUR', isActive: true },
  { symbol: 'AEX', name: 'AEX Index', type: 'index', market: 'netherlands', country: 'Netherlands', currency: 'EUR', isActive: true },
  { symbol: 'SMI', name: 'Swiss Market Index', type: 'index', market: 'switzerland', country: 'Switzerland', currency: 'CHF', isActive: true },
  
  // Asian Indices
  { symbol: 'NIKKEI', name: 'Nikkei 225 Index', type: 'index', market: 'japan', country: 'Japan', currency: 'JPY', isActive: true },
  { symbol: 'HSI', name: 'Hang Seng Index', type: 'index', market: 'hongkong', country: 'Hong Kong', currency: 'HKD', isActive: true },
  { symbol: 'SHCOMP', name: 'Shanghai Composite Index', type: 'index', market: 'china', country: 'China', currency: 'CNY', isActive: true },
  { symbol: 'SENSEX', name: 'BSE Sensex', type: 'index', market: 'india', country: 'India', currency: 'INR', isActive: true },
  { symbol: 'NIFTY', name: 'NIFTY 50 Index', type: 'index', market: 'india', country: 'India', currency: 'INR', isActive: true },
  { symbol: 'KOSPI', name: 'KOSPI Index', type: 'index', market: 'korea', country: 'South Korea', currency: 'KRW', isActive: true },
  { symbol: 'TWII', name: 'Taiwan Weighted Index', type: 'index', market: 'taiwan', country: 'Taiwan', currency: 'TWD', isActive: true },
  { symbol: 'STI', name: 'Straits Times Index', type: 'index', market: 'singapore', country: 'Singapore', currency: 'SGD', isActive: true },
  { symbol: 'KLCI', name: 'FTSE Bursa Malaysia KLCI', type: 'index', market: 'malaysia', country: 'Malaysia', currency: 'MYR', isActive: true },
  { symbol: 'SET', name: 'SET Index', type: 'index', market: 'thailand', country: 'Thailand', currency: 'THB', isActive: true },
  { symbol: 'JKSE', name: 'Jakarta Composite Index', type: 'index', market: 'indonesia', country: 'Indonesia', currency: 'IDR', isActive: true },
  { symbol: 'PSEI', name: 'PSEi Index', type: 'index', market: 'philippines', country: 'Philippines', currency: 'PHP', isActive: true },
  
  // Other Global Indices
  { symbol: 'ASX', name: 'ASX 200 Index', type: 'index', market: 'australia', country: 'Australia', currency: 'AUD', isActive: true },
  { symbol: 'TSX', name: 'S&P/TSX Composite Index', type: 'index', market: 'canada', country: 'Canada', currency: 'CAD', isActive: true },
  { symbol: 'BOVESPA', name: 'Bovespa Index', type: 'index', market: 'brazil', country: 'Brazil', currency: 'BRL', isActive: true },
  { symbol: 'MERVAL', name: 'S&P Merval Index', type: 'index', market: 'argentina', country: 'Argentina', currency: 'ARS', isActive: true },
  { symbol: 'IPSA', name: 'IPSA Index', type: 'index', market: 'chile', country: 'Chile', currency: 'CLP', isActive: true },
  { symbol: 'COLCAP', name: 'COLCAP Index', type: 'index', market: 'colombia', country: 'Colombia', currency: 'COP', isActive: true },
  { symbol: 'TA125', name: 'Tel Aviv 125 Index', type: 'index', market: 'israel', country: 'Israel', currency: 'ILS', isActive: true },
  { symbol: 'EGX30', name: 'EGX 30 Index', type: 'index', market: 'egypt', country: 'Egypt', currency: 'EGP', isActive: true },
  { symbol: 'TASI', name: 'TASI Index', type: 'index', market: 'saudi', country: 'Saudi Arabia', currency: 'SAR', isActive: true }
];

export async function fetchPolygonAssets(): Promise<ComprehensiveAsset[]> {
  try {
    console.log('Fetching assets from Polygon API...');
    
    // Fetch different market types
    const [stocks, etfs, indices, forex] = await Promise.all([
      fetchPolygonTickers('stocks'),
      fetchPolygonTickers('otc'),
      fetchPolygonTickers('indices'),
      fetchPolygonTickers('fx')
    ]);

    const convertPolygonAsset = (ticker: PolygonTickerData, type: 'stock' | 'etf' | 'index' | 'forex'): ComprehensiveAsset => ({
      symbol: ticker.ticker,
      name: ticker.name,
      type,
      market: ticker.market,
      exchange: ticker.primary_exchange,
      country: ticker.locale === 'us' ? 'United States' : ticker.locale.toUpperCase(),
      currency: ticker.currency_name || 'USD',
      isActive: ticker.active
    });

    const allAssets: ComprehensiveAsset[] = [
      ...stocks.map(t => convertPolygonAsset(t, 'stock')),
      ...etfs.map(t => convertPolygonAsset(t, 'etf')),
      ...indices.map(t => convertPolygonAsset(t, 'index')),
      ...forex.map(t => convertPolygonAsset(t, 'forex')),
      ...GLOBAL_CRYPTOCURRENCIES,
      ...GLOBAL_FOREX,
      ...GLOBAL_COMMODITIES,
      ...GLOBAL_INDICES
    ];

    console.log(`Fetched ${allAssets.length} total assets from all sources`);
    return allAssets;
  } catch (error) {
    console.error('Error fetching Polygon assets:', error);
    // Return static data as fallback
    return [
      ...GLOBAL_CRYPTOCURRENCIES,
      ...GLOBAL_FOREX,
      ...GLOBAL_COMMODITIES,
      ...GLOBAL_INDICES
    ];
  }
}

export function getAllAssets(): ComprehensiveAsset[] {
  return [
    ...GLOBAL_CRYPTOCURRENCIES,
    ...GLOBAL_FOREX,
    ...GLOBAL_COMMODITIES,
    ...GLOBAL_INDICES
  ];
}

export function getAssetsByType(type: ComprehensiveAsset['type']): ComprehensiveAsset[] {
  const allAssets = getAllAssets();
  return allAssets.filter(asset => asset.type === type);
}

export function getAssetsByCountry(country: string): ComprehensiveAsset[] {
  const allAssets = getAllAssets();
  return allAssets.filter(asset => asset.country.toLowerCase().includes(country.toLowerCase()));
}

export function searchAssets(query: string): ComprehensiveAsset[] {
  const allAssets = getAllAssets();
  const lowercaseQuery = query.toLowerCase();
  
  return allAssets.filter(asset =>
    asset.symbol.toLowerCase().includes(lowercaseQuery) ||
    asset.name.toLowerCase().includes(lowercaseQuery) ||
    asset.country.toLowerCase().includes(lowercaseQuery) ||
    asset.sector?.toLowerCase().includes(lowercaseQuery) ||
    asset.industry?.toLowerCase().includes(lowercaseQuery)
  );
}
