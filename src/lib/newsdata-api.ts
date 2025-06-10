
// Newsdata.io API integration for comprehensive news coverage
const NEWSDATA_API_KEY = 'pub_99eb7d82c25040beb2ae6b63d37f2fb8';

export interface NewsdataArticle {
  article_id: string;
  title: string;
  link: string;
  keywords?: string[];
  creator?: string[];
  video_url?: string;
  description?: string;
  content?: string;
  pubDate: string;
  image_url?: string;
  source_id: string;
  source_priority: number;
  source_url: string;
  source_icon?: string;
  language: string;
  country: string[];
  category: string[];
  ai_tag?: string;
  sentiment?: string;
  sentiment_stats?: string;
  ai_region?: string;
}

export interface NewsdataResponse {
  status: string;
  totalResults: number;
  results: NewsdataArticle[];
  nextPage?: string;
}

export async function fetchNewsdataNews(params: {
  q?: string;
  qInTitle?: string;
  country?: string;
  category?: string;
  language?: string;
  domain?: string;
  domainurl?: string;
  excludedomain?: string;
  prioritydomain?: string;
  timeframe?: string;
  size?: number;
  full_content?: boolean;
}): Promise<NewsdataResponse | null> {
  try {
    const url = new URL('https://newsdata.io/api/1/news');
    url.searchParams.append('apikey', NEWSDATA_API_KEY);
    
    // Add all parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Newsdata API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Newsdata news:', error);
    return null;
  }
}

export async function fetchCryptoNews(): Promise<NewsdataArticle[]> {
  try {
    const response = await fetchNewsdataNews({
      q: 'cryptocurrency OR bitcoin OR ethereum OR crypto',
      category: 'business,technology',
      language: 'en',
      size: 50
    });
    
    return response?.results || [];
  } catch (error) {
    console.error('Error fetching crypto news:', error);
    return [];
  }
}

export async function fetchStockNews(symbol: string): Promise<NewsdataArticle[]> {
  try {
    const response = await fetchNewsdataNews({
      q: symbol,
      category: 'business',
      language: 'en',
      size: 20
    });
    
    return response?.results || [];
  } catch (error) {
    console.error('Error fetching stock news:', error);
    return [];
  }
}

export async function fetchMarketNews(): Promise<NewsdataArticle[]> {
  try {
    const response = await fetchNewsdataNews({
      q: 'stock market OR nasdaq OR NYSE OR trading OR finance',
      category: 'business',
      language: 'en',
      size: 30
    });
    
    return response?.results || [];
  } catch (error) {
    console.error('Error fetching market news:', error);
    return [];
  }
}

export async function fetchGlobalNews(): Promise<NewsdataArticle[]> {
  try {
    const response = await fetchNewsdataNews({
      category: 'business,politics,world',
      language: 'en',
      size: 40
    });
    
    return response?.results || [];
  } catch (error) {
    console.error('Error fetching global news:', error);
    return [];
  }
}
