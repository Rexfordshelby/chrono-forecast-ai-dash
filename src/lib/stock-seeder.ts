
import { supabase } from '@/integrations/supabase/client';

// Comprehensive list of major stocks across different exchanges and sectors
const MAJOR_STOCKS = [
  // S&P 500 Technology Stocks
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', industry: 'Consumer Electronics', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', industry: 'Software', exchange: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', industry: 'Internet Services', exchange: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', industry: 'E-commerce', exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary', industry: 'Electric Vehicles', exchange: 'NASDAQ' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', industry: 'Semiconductors', exchange: 'NASDAQ' },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', industry: 'Social Media', exchange: 'NASDAQ' },
  { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services', industry: 'Streaming', exchange: 'NASDAQ' },
  { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', industry: 'Software', exchange: 'NYSE' },
  { symbol: 'ORCL', name: 'Oracle Corporation', sector: 'Technology', industry: 'Software', exchange: 'NYSE' },
  
  // Financial Sector
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financials', industry: 'Banking', exchange: 'NYSE' },
  { symbol: 'BAC', name: 'Bank of America Corp.', sector: 'Financials', industry: 'Banking', exchange: 'NYSE' },
  { symbol: 'WFC', name: 'Wells Fargo & Company', sector: 'Financials', industry: 'Banking', exchange: 'NYSE' },
  { symbol: 'GS', name: 'Goldman Sachs Group Inc.', sector: 'Financials', industry: 'Investment Banking', exchange: 'NYSE' },
  { symbol: 'MS', name: 'Morgan Stanley', sector: 'Financials', industry: 'Investment Banking', exchange: 'NYSE' },
  { symbol: 'V', name: 'Visa Inc.', sector: 'Financials', industry: 'Payment Processing', exchange: 'NYSE' },
  { symbol: 'MA', name: 'Mastercard Inc.', sector: 'Financials', industry: 'Payment Processing', exchange: 'NYSE' },
  { symbol: 'AXP', name: 'American Express Company', sector: 'Financials', industry: 'Credit Services', exchange: 'NYSE' },
  
  // Healthcare Sector
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', industry: 'Pharmaceuticals', exchange: 'NYSE' },
  { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', industry: 'Pharmaceuticals', exchange: 'NYSE' },
  { symbol: 'ABBV', name: 'AbbVie Inc.', sector: 'Healthcare', industry: 'Pharmaceuticals', exchange: 'NYSE' },
  { symbol: 'MRK', name: 'Merck & Co. Inc.', sector: 'Healthcare', industry: 'Pharmaceuticals', exchange: 'NYSE' },
  { symbol: 'UNH', name: 'UnitedHealth Group Inc.', sector: 'Healthcare', industry: 'Health Insurance', exchange: 'NYSE' },
  { symbol: 'CVS', name: 'CVS Health Corporation', sector: 'Healthcare', industry: 'Healthcare Services', exchange: 'NYSE' },
  
  // Consumer Goods
  { symbol: 'KO', name: 'The Coca-Cola Company', sector: 'Consumer Staples', industry: 'Beverages', exchange: 'NYSE' },
  { symbol: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer Staples', industry: 'Beverages', exchange: 'NASDAQ' },
  { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Staples', industry: 'Retail', exchange: 'NYSE' },
  { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Staples', industry: 'Personal Care', exchange: 'NYSE' },
  { symbol: 'NKE', name: 'Nike Inc.', sector: 'Consumer Discretionary', industry: 'Footwear', exchange: 'NYSE' },
  { symbol: 'MCD', name: 'McDonald\'s Corporation', sector: 'Consumer Discretionary', industry: 'Restaurants', exchange: 'NYSE' },
  
  // Energy Sector
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', sector: 'Energy', industry: 'Oil & Gas', exchange: 'NYSE' },
  { symbol: 'CVX', name: 'Chevron Corporation', sector: 'Energy', industry: 'Oil & Gas', exchange: 'NYSE' },
  { symbol: 'COP', name: 'ConocoPhillips', sector: 'Energy', industry: 'Oil & Gas', exchange: 'NYSE' },
  { symbol: 'SLB', name: 'Schlumberger Limited', sector: 'Energy', industry: 'Oil Services', exchange: 'NYSE' },
  
  // Industrials
  { symbol: 'BA', name: 'The Boeing Company', sector: 'Industrials', industry: 'Aerospace', exchange: 'NYSE' },
  { symbol: 'CAT', name: 'Caterpillar Inc.', sector: 'Industrials', industry: 'Heavy Machinery', exchange: 'NYSE' },
  { symbol: 'GE', name: 'General Electric Company', sector: 'Industrials', industry: 'Conglomerate', exchange: 'NYSE' },
  { symbol: 'UPS', name: 'United Parcel Service Inc.', sector: 'Industrials', industry: 'Logistics', exchange: 'NYSE' },
  { symbol: 'FDX', name: 'FedEx Corporation', sector: 'Industrials', industry: 'Logistics', exchange: 'NYSE' },
  
  // Materials
  { symbol: 'LIN', name: 'Linde plc', sector: 'Materials', industry: 'Chemicals', exchange: 'NYSE' },
  { symbol: 'FCX', name: 'Freeport-McMoRan Inc.', sector: 'Materials', industry: 'Mining', exchange: 'NYSE' },
  { symbol: 'NEM', name: 'Newmont Corporation', sector: 'Materials', industry: 'Gold Mining', exchange: 'NYSE' },
  
  // Real Estate
  { symbol: 'AMT', name: 'American Tower Corporation', sector: 'Real Estate', industry: 'REITs', exchange: 'NYSE' },
  { symbol: 'PLD', name: 'Prologis Inc.', sector: 'Real Estate', industry: 'REITs', exchange: 'NYSE' },
  
  // Utilities
  { symbol: 'NEE', name: 'NextEra Energy Inc.', sector: 'Utilities', industry: 'Electric Utilities', exchange: 'NYSE' },
  { symbol: 'DUK', name: 'Duke Energy Corporation', sector: 'Utilities', industry: 'Electric Utilities', exchange: 'NYSE' },
  
  // Communication Services
  { symbol: 'T', name: 'AT&T Inc.', sector: 'Communication Services', industry: 'Telecom', exchange: 'NYSE' },
  { symbol: 'VZ', name: 'Verizon Communications Inc.', sector: 'Communication Services', industry: 'Telecom', exchange: 'NYSE' },
  { symbol: 'DIS', name: 'The Walt Disney Company', sector: 'Communication Services', industry: 'Entertainment', exchange: 'NYSE' },
  
  // Additional Tech Giants
  { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', industry: 'Software', exchange: 'NASDAQ' },
  { symbol: 'INTC', name: 'Intel Corporation', sector: 'Technology', industry: 'Semiconductors', exchange: 'NASDAQ' },
  { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', sector: 'Technology', industry: 'Semiconductors', exchange: 'NASDAQ' },
  { symbol: 'QCOM', name: 'QUALCOMM Incorporated', sector: 'Technology', industry: 'Semiconductors', exchange: 'NASDAQ' },
  { symbol: 'CSCO', name: 'Cisco Systems Inc.', sector: 'Technology', industry: 'Networking', exchange: 'NASDAQ' },
  { symbol: 'IBM', name: 'International Business Machines Corporation', sector: 'Technology', industry: 'IT Services', exchange: 'NYSE' },
  
  // Emerging Growth Stocks
  { symbol: 'SHOP', name: 'Shopify Inc.', sector: 'Technology', industry: 'E-commerce Software', exchange: 'NYSE' },
  { symbol: 'SQ', name: 'Block Inc.', sector: 'Technology', industry: 'Financial Technology', exchange: 'NYSE' },
  { symbol: 'PYPL', name: 'PayPal Holdings Inc.', sector: 'Technology', industry: 'Payment Processing', exchange: 'NASDAQ' },
  { symbol: 'ROKU', name: 'Roku Inc.', sector: 'Technology', industry: 'Streaming Technology', exchange: 'NASDAQ' },
  { symbol: 'ZOOM', name: 'Zoom Video Communications Inc.', sector: 'Technology', industry: 'Communication Software', exchange: 'NASDAQ' },
  { symbol: 'UBER', name: 'Uber Technologies Inc.', sector: 'Technology', industry: 'Transportation Technology', exchange: 'NYSE' },
  { symbol: 'LYFT', name: 'Lyft Inc.', sector: 'Technology', industry: 'Transportation Technology', exchange: 'NASDAQ' },
  { symbol: 'ABNB', name: 'Airbnb Inc.', sector: 'Technology', industry: 'Travel Technology', exchange: 'NASDAQ' },
  
  // Biotech and Pharma
  { symbol: 'GILD', name: 'Gilead Sciences Inc.', sector: 'Healthcare', industry: 'Biotechnology', exchange: 'NASDAQ' },
  { symbol: 'BIIB', name: 'Biogen Inc.', sector: 'Healthcare', industry: 'Biotechnology', exchange: 'NASDAQ' },
  { symbol: 'MRNA', name: 'Moderna Inc.', sector: 'Healthcare', industry: 'Biotechnology', exchange: 'NASDAQ' },
  { symbol: 'NVAX', name: 'Novavax Inc.', sector: 'Healthcare', industry: 'Biotechnology', exchange: 'NASDAQ' },
  
  // Chinese ADRs
  { symbol: 'BABA', name: 'Alibaba Group Holding Limited', sector: 'Technology', industry: 'E-commerce', exchange: 'NYSE' },
  { symbol: 'JD', name: 'JD.com Inc.', sector: 'Technology', industry: 'E-commerce', exchange: 'NASDAQ' },
  { symbol: 'BIDU', name: 'Baidu Inc.', sector: 'Technology', industry: 'Internet Services', exchange: 'NASDAQ' },
  { symbol: 'NIO', name: 'NIO Inc.', sector: 'Consumer Discretionary', industry: 'Electric Vehicles', exchange: 'NYSE' },
  { symbol: 'XPEV', name: 'XPeng Inc.', sector: 'Consumer Discretionary', industry: 'Electric Vehicles', exchange: 'NYSE' },
  { symbol: 'LI', name: 'Li Auto Inc.', sector: 'Consumer Discretionary', industry: 'Electric Vehicles', exchange: 'NASDAQ' },
  
  // European Stocks (ADRs)
  { symbol: 'ASML', name: 'ASML Holding N.V.', sector: 'Technology', industry: 'Semiconductor Equipment', exchange: 'NASDAQ' },
  { symbol: 'SAP', name: 'SAP SE', sector: 'Technology', industry: 'Enterprise Software', exchange: 'NYSE' },
  { symbol: 'NVO', name: 'Novo Nordisk A/S', sector: 'Healthcare', industry: 'Pharmaceuticals', exchange: 'NYSE' },
  { symbol: 'UL', name: 'Unilever PLC', sector: 'Consumer Staples', industry: 'Personal Care', exchange: 'NYSE' },
  
  // Canadian Stocks
  { symbol: 'SHOP', name: 'Shopify Inc.', sector: 'Technology', industry: 'E-commerce Platform', exchange: 'TSX' },
  { symbol: 'CNQ', name: 'Canadian Natural Resources Limited', sector: 'Energy', industry: 'Oil & Gas', exchange: 'TSX' },
  
  // Small & Mid Cap Growth
  { symbol: 'SNOW', name: 'Snowflake Inc.', sector: 'Technology', industry: 'Cloud Computing', exchange: 'NYSE' },
  { symbol: 'PLTR', name: 'Palantir Technologies Inc.', sector: 'Technology', industry: 'Data Analytics', exchange: 'NYSE' },
  { symbol: 'RBLX', name: 'Roblox Corporation', sector: 'Technology', industry: 'Gaming Platform', exchange: 'NYSE' },
  { symbol: 'RIVN', name: 'Rivian Automotive Inc.', sector: 'Consumer Discretionary', industry: 'Electric Vehicles', exchange: 'NASDAQ' },
  { symbol: 'LCID', name: 'Lucid Group Inc.', sector: 'Consumer Discretionary', industry: 'Electric Vehicles', exchange: 'NASDAQ' },
  
  // ETFs
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', sector: 'ETF', industry: 'Index Fund', exchange: 'NYSE' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', sector: 'ETF', industry: 'Tech Index Fund', exchange: 'NASDAQ' },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF', sector: 'ETF', industry: 'Small Cap Index', exchange: 'NYSE' },
  { symbol: 'GLD', name: 'SPDR Gold Shares', sector: 'ETF', industry: 'Commodity ETF', exchange: 'NYSE' },
  { symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', sector: 'ETF', industry: 'Bond ETF', exchange: 'NASDAQ' },
];

// Additional international and emerging market stocks
const INTERNATIONAL_STOCKS = [
  // Japanese Stocks (ADRs)
  { symbol: 'TM', name: 'Toyota Motor Corporation', sector: 'Consumer Discretionary', industry: 'Automobiles', exchange: 'NYSE', country: 'Japan' },
  { symbol: 'SONY', name: 'Sony Group Corporation', sector: 'Technology', industry: 'Electronics', exchange: 'NYSE', country: 'Japan' },
  { symbol: 'NTT', name: 'Nippon Telegraph and Telephone Corporation', sector: 'Communication Services', industry: 'Telecom', exchange: 'NYSE', country: 'Japan' },
  
  // South Korean Stocks
  { symbol: 'LPL', name: 'LG Display Co., Ltd.', sector: 'Technology', industry: 'Display Technology', exchange: 'NYSE', country: 'South Korea' },
  
  // Indian Stocks (ADRs)
  { symbol: 'INFY', name: 'Infosys Limited', sector: 'Technology', industry: 'IT Services', exchange: 'NYSE', country: 'India' },
  { symbol: 'WIT', name: 'Wipro Limited', sector: 'Technology', industry: 'IT Services', exchange: 'NYSE', country: 'India' },
  { symbol: 'HDB', name: 'HDFC Bank Limited', sector: 'Financials', industry: 'Banking', exchange: 'NYSE', country: 'India' },
  
  // Brazilian Stocks (ADRs)
  { symbol: 'VALE', name: 'Vale S.A.', sector: 'Materials', industry: 'Mining', exchange: 'NYSE', country: 'Brazil' },
  { symbol: 'PBR', name: 'Petróleo Brasileiro S.A. - Petrobras', sector: 'Energy', industry: 'Oil & Gas', exchange: 'NYSE', country: 'Brazil' },
  
  // UK Stocks (ADRs)
  { symbol: 'BP', name: 'BP p.l.c.', sector: 'Energy', industry: 'Oil & Gas', exchange: 'NYSE', country: 'UK' },
  { symbol: 'SHEL', name: 'Shell plc', sector: 'Energy', industry: 'Oil & Gas', exchange: 'NYSE', country: 'UK' },
  { symbol: 'GSK', name: 'GSK plc', sector: 'Healthcare', industry: 'Pharmaceuticals', exchange: 'NYSE', country: 'UK' },
  
  // Australian Stocks (ADRs)
  { symbol: 'BHP', name: 'BHP Group Limited', sector: 'Materials', industry: 'Mining', exchange: 'NYSE', country: 'Australia' },
  { symbol: 'RIO', name: 'Rio Tinto Group', sector: 'Materials', industry: 'Mining', exchange: 'NYSE', country: 'Australia' },
];

export async function seedStockData() {
  console.log('Starting stock data seeding...');
  
  try {
    // Combine all stock data
    const allStocks = [...MAJOR_STOCKS, ...INTERNATIONAL_STOCKS];
    
    // Prepare data for insertion
    const stocksToInsert = allStocks.map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      category: stock.sector === 'ETF' ? 'etf' : 'stock',
      exchange: stock.exchange,
      sector: stock.sector,
      industry: stock.industry,
      country: stock.country || 'USA',
      currency: 'USD',
      is_active: true
    }));
    
    // Insert stocks in batches to avoid timeout
    const batchSize = 50;
    for (let i = 0; i < stocksToInsert.length; i += batchSize) {
      const batch = stocksToInsert.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('assets')
        .upsert(batch, { 
          onConflict: 'symbol',
          ignoreDuplicates: false 
        });
      
      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
      } else {
        console.log(`Successfully inserted batch ${i / batchSize + 1} (${batch.length} stocks)`);
      }
    }
    
    console.log(`Stock data seeding completed! Added ${allStocks.length} stocks.`);
    return { success: true, count: allStocks.length };
    
  } catch (error) {
    console.error('Error seeding stock data:', error);
    return { success: false, error };
  }
}

// Function to get comprehensive stock list for search
export function getStockSymbols(): string[] {
  return [...MAJOR_STOCKS, ...INTERNATIONAL_STOCKS].map(stock => stock.symbol);
}

// Function to get stocks by sector
export function getStocksBySector(sector: string) {
  return [...MAJOR_STOCKS, ...INTERNATIONAL_STOCKS].filter(stock => 
    stock.sector.toLowerCase() === sector.toLowerCase()
  );
}

// Function to get stocks by exchange
export function getStocksByExchange(exchange: string) {
  return [...MAJOR_STOCKS, ...INTERNATIONAL_STOCKS].filter(stock => 
    stock.exchange.toLowerCase() === exchange.toLowerCase()
  );
}
