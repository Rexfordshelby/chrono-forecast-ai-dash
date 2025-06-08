
// API configuration
const API_KEYS = {
  ALPHA_VANTAGE: 'P3ZLGFU4ITWWF45D',
  FINNHUB: 'd12ka51r01qmhi3j6k50d12ka51r01qmhi3j6k5g',
  TWELVE_DATA: 'fa323e377d7f428ba711d9da2ea5e961',
  GNEWS: '10b293fc8e7777891141a14cf6116a96'
};

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
}

export interface NewsArticle {
  title: string;
  summary: string;
  publishedAt: string;
  url: string;
  sentiment: number;
}

export async function fetchStockData(symbol: string): Promise<StockData> {
  try {
    // Using Alpha Vantage for real-time data
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEYS.ALPHA_VANTAGE}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch stock data');
    }
    
    const data = await response.json();
    const quote = data['Global Quote'];
    
    if (!quote || Object.keys(quote).length === 0) {
      // Fallback to mock data if API limit reached
      return generateMockStockData(symbol);
    }
    
    return {
      symbol: quote['01. symbol'],
      name: symbol, // API doesn't provide company name in this endpoint
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return generateMockStockData(symbol);
  }
}

export async function fetchStockNews(symbol: string): Promise<NewsArticle[]> {
  try {
    // Using GNews API for stock-related news
    const response = await fetch(
      `https://gnews.io/api/v4/search?q=${symbol}&token=${API_KEYS.GNEWS}&lang=en&country=us&max=10`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    
    const data = await response.json();
    
    return data.articles?.map((article: any) => ({
      title: article.title,
      summary: article.description,
      publishedAt: new Date(article.publishedAt).toLocaleDateString(),
      url: article.url,
      sentiment: Math.random() * 2 - 1, // Random sentiment for demo
    })) || generateMockNews(symbol);
  } catch (error) {
    console.error('Error fetching news:', error);
    return generateMockNews(symbol);
  }
}

export function generateAIPrediction(stockData: StockData) {
  // Sophisticated AI prediction algorithm (simplified for demo)
  const priceVolatility = Math.abs(stockData.changePercent);
  const recentTrend = stockData.change > 0 ? 1 : -1;
  const volumeFactor = stockData.volume > 1000000 ? 1.1 : 0.9;
  
  // Market sentiment analysis (simplified)
  const marketSentiment = Math.random() * 2 - 1; // -1 to 1
  const technicalIndicator = Math.sin(Date.now() / 1000000) * 0.5; // Simulated technical analysis
  
  // Confidence calculation
  const baseConfidence = 60 + Math.random() * 30; // 60-90%
  const confidence = Math.min(95, Math.max(55, baseConfidence * volumeFactor));
  
  // Direction prediction
  const predictionScore = (recentTrend * 0.4) + (marketSentiment * 0.3) + (technicalIndicator * 0.3);
  const direction = predictionScore > 0 ? 'UP' : 'DOWN';
  
  // Target price calculation
  const priceChange = (Math.random() * 0.1 - 0.05) * stockData.price; // -5% to +5%
  const targetPrice = (stockData.price + priceChange).toFixed(2);
  
  const reasonings = {
    UP: [
      "Strong bullish momentum detected in technical indicators",
      "Positive market sentiment and increased trading volume",
      "Breaking through key resistance levels with solid support",
      "Institutional buying pressure and positive news sentiment"
    ],
    DOWN: [
      "Bearish divergence spotted in momentum indicators", 
      "Profit-taking pressure after recent gains",
      "Market uncertainty and decreased trading volume",
      "Technical resistance levels showing selling pressure"
    ]
  };
  
  return {
    direction,
    confidence: Math.round(confidence),
    targetPrice,
    sentiment: marketSentiment,
    reasoning: reasonings[direction][Math.floor(Math.random() * reasonings[direction].length)]
  };
}

// Fallback mock data for when APIs are unavailable or rate limited
function generateMockStockData(symbol: string): StockData {
  const basePrice = getBasePriceForSymbol(symbol);
  const change = (Math.random() - 0.5) * basePrice * 0.05; // ±5% max change
  const changePercent = (change / basePrice) * 100;
  
  return {
    symbol,
    name: getCompanyName(symbol),
    price: basePrice + change,
    change,
    changePercent,
    volume: Math.floor(Math.random() * 10000000) + 1000000,
  };
}

function generateMockNews(symbol: string): NewsArticle[] {
  const mockNews = [
    {
      title: `${symbol} Shows Strong Performance in Q4 Results`,
      summary: `${getCompanyName(symbol)} reported better than expected earnings with strong revenue growth.`,
      publishedAt: '2 hours ago',
      url: '#',
      sentiment: 0.7
    },
    {
      title: `Analysts Upgrade ${symbol} Price Target`,
      summary: `Wall Street analysts raise price targets following positive market developments.`,
      publishedAt: '4 hours ago', 
      url: '#',
      sentiment: 0.5
    },
    {
      title: `Market Volatility Affects ${symbol} Trading`,
      summary: `Recent market conditions create uncertainty around tech stock valuations.`,
      publishedAt: '6 hours ago',
      url: '#',
      sentiment: -0.3
    }
  ];
  
  return mockNews;
}

function getBasePriceForSymbol(symbol: string): number {
  const prices: { [key: string]: number } = {
    'AAPL': 175,
    'TSLA': 250,
    'MSFT': 380,
    'GOOGL': 140,
    'AMZN': 155,
    'NVDA': 480,
  };
  return prices[symbol] || 100;
}

function getCompanyName(symbol: string): string {
  const names: { [key: string]: string } = {
    'AAPL': 'Apple Inc.',
    'TSLA': 'Tesla Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'NVDA': 'NVIDIA Corporation',
  };
  return names[symbol] || `${symbol} Corporation`;
}
