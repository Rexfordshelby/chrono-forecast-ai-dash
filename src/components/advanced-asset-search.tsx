
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, TrendingUp, TrendingDown, Star, StarOff, Plus, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { fetchEnhancedAssetData, EnhancedAssetData } from '@/lib/enhanced-api';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/use-toast';
import { seedStockData } from '@/lib/stock-seeder';

interface AssetSearchProps {
  onSelectAsset: (symbol: string) => void;
  selectedAsset?: string;
}

export function AdvancedAssetSearch({ onSelectAsset, selectedAsset }: AssetSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<EnhancedAssetData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('stocks');
  const [categoryAssets, setCategoryAssets] = useState<{ [key: string]: EnhancedAssetData[] }>({});
  const [stockCount, setStockCount] = useState(0);
  const [isSeeding, setIsSeeding] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  useEffect(() => {
    loadCategoryAssets();
    checkStockCount();
  }, []);

  useEffect(() => {
    if (searchTerm.length > 1) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const checkStockCount = async () => {
    try {
      const { count, error } = await supabase
        .from('assets')
        .select('*', { count: 'exact', head: true })
        .eq('category', 'stock');

      if (error) throw error;
      setStockCount(count || 0);
    } catch (error) {
      console.error('Error checking stock count:', error);
    }
  };

  const handleSeedStocks = async () => {
    setIsSeeding(true);
    try {
      const result = await seedStockData();
      if (result.success) {
        toast({
          title: "Success!",
          description: `Added ${result.count} stocks to the database`,
        });
        await checkStockCount();
        await loadCategoryAssets();
      } else {
        throw new Error('Failed to seed stock data');
      }
    } catch (error) {
      console.error('Error seeding stocks:', error);
      toast({
        title: "Error",
        description: "Failed to add stocks to database",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const loadCategoryAssets = async () => {
    const assets: { [key: string]: EnhancedAssetData[] } = {};
    
    // Load stocks from database
    try {
      const { data: dbStocks } = await supabase
        .from('assets')
        .select('*')
        .eq('category', 'stock')
        .eq('is_active', true)
        .order('name')
        .limit(20);

      if (dbStocks && dbStocks.length > 0) {
        assets['stocks'] = [];
        for (const stock of dbStocks) {
          try {
            const data = await fetchEnhancedAssetData(stock.symbol, 'stock');
            assets['stocks'].push(data);
          } catch (error) {
            console.error(`Error loading ${stock.symbol}:`, error);
          }
        }
      } else {
        // Fallback to popular stocks if database is empty
        const popularStocks = ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'NVDA'];
        assets['stocks'] = [];
        for (const symbol of popularStocks) {
          try {
            const data = await fetchEnhancedAssetData(symbol, 'stock');
            assets['stocks'].push(data);
          } catch (error) {
            console.error(`Error loading ${symbol}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error loading stocks from database:', error);
    }

    // Load other asset types
    const otherCategories = {
      crypto: ['BTC', 'ETH', 'ADA', 'DOT', 'SOL', 'AVAX'],
      forex: ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF'],
      commodities: ['GOLD', 'SILVER', 'OIL', 'WHEAT', 'CORN', 'COPPER']
    };

    for (const [category, symbols] of Object.entries(otherCategories)) {
      assets[category] = [];
      for (const symbol of symbols) {
        try {
          const data = await fetchEnhancedAssetData(symbol, category);
          assets[category].push(data);
        } catch (error) {
          console.error(`Error loading ${symbol}:`, error);
        }
      }
    }
    
    setCategoryAssets(assets);
  };

  const performSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      // Search in our database first
      const { data: dbAssets } = await supabase
        .from('assets')
        .select('*')
        .or(`symbol.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`)
        .eq('is_active', true)
        .limit(15);

      const results: EnhancedAssetData[] = [];
      
      if (dbAssets && dbAssets.length > 0) {
        for (const asset of dbAssets) {
          try {
            const data = await fetchEnhancedAssetData(asset.symbol, asset.category);
            results.push(data);
          } catch (error) {
            console.error(`Error fetching data for ${asset.symbol}:`, error);
          }
        }
      } else {
        // Fallback to direct API search
        try {
          const data = await fetchEnhancedAssetData(searchTerm.toUpperCase());
          results.push(data);
        } catch (error) {
          console.error('Error in fallback search:', error);
        }
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssetSelect = (symbol: string) => {
    onSelectAsset(symbol);
  };

  const handleToggleFavorite = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(symbol);
  };

  const renderAssetCard = (asset: EnhancedAssetData) => (
    <div
      key={asset.symbol}
      className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
        selectedAsset === asset.symbol ? 'bg-primary/10 border-primary' : ''
      }`}
      onClick={() => handleAssetSelect(asset.symbol)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{asset.symbol}</span>
              <Badge variant="secondary" className="text-xs">
                {asset.category.toUpperCase()}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground truncate max-w-[200px]">{asset.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="font-semibold">
              ${asset.price.toFixed(asset.category === 'forex' ? 4 : 2)}
            </div>
            <div className={`text-sm flex items-center gap-1 ${
              asset.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {asset.changePercent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {asset.changePercent.toFixed(2)}%
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => handleToggleFavorite(asset.symbol, e)}
            className="h-8 w-8"
          >
            {favorites.includes(asset.symbol) ? (
              <Star className="h-4 w-4 fill-current text-yellow-500" />
            ) : (
              <StarOff className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header with Stock Count */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Asset Search</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{stockCount} stocks available</Badge>
            {stockCount < 50 && (
              <Button
                onClick={handleSeedStocks}
                disabled={isSeeding}
                size="sm"
                className="flex items-center gap-2"
              >
                {isSeeding ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {isSeeding ? 'Adding...' : 'Add More Stocks'}
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search thousands of stocks, crypto, forex, commodities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="space-y-3">
            <h3 className="font-semibold">Search Results</h3>
            {loading ? (
              <div className="animate-pulse space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded"></div>
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {searchResults.map(renderAssetCard)}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No assets found for "{searchTerm}"
              </div>
            )}
          </div>
        )}

        {/* Category Assets */}
        {!searchTerm && (
          <div className="space-y-4">
            <h3 className="font-semibold">Browse by Category</h3>
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="stocks">Stocks</TabsTrigger>
                <TabsTrigger value="crypto">Crypto</TabsTrigger>
                <TabsTrigger value="forex">Forex</TabsTrigger>
                <TabsTrigger value="commodities">Commodities</TabsTrigger>
              </TabsList>
              
              {Object.entries(categoryAssets).map(([category, assets]) => (
                <TabsContent key={category} value={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {category === 'stocks' ? `Showing ${assets.length} of ${stockCount} available stocks` : `Popular ${category}`}
                    </p>
                    {category === 'stocks' && assets.length < stockCount && (
                      <Button variant="outline" size="sm" onClick={loadCategoryAssets}>
                        Load More
                      </Button>
                    )}
                  </div>
                  {assets.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {assets.map(renderAssetCard)}
                    </div>
                  ) : (
                    <div className="animate-pulse space-y-2">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-16 bg-muted rounded"></div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}

        {/* Favorites */}
        {favorites.length > 0 && !searchTerm && (
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Your Favorites
            </h3>
            <div className="grid gap-2 max-h-64 overflow-y-auto">
              {favorites.slice(0, 10).map((symbol) => (
                <div
                  key={symbol}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                    selectedAsset === symbol ? 'bg-primary/10 border-primary' : ''
                  }`}
                  onClick={() => handleAssetSelect(symbol)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{symbol}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleToggleFavorite(symbol, e)}
                      className="h-6 w-6"
                    >
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
