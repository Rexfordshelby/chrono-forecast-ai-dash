
import { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface StockSearchProps {
  onSelectStock: (symbol: string) => void;
  selectedStock: string;
}

const popularStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
];

export function StockSearch({ onSelectStock, selectedStock }: StockSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSelectStock(searchTerm.toUpperCase());
      setSearchTerm('');
    }
  };

  return (
    <Card className="p-6 card-glow">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Search Stocks</h3>
        </div>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter stock symbol (e.g., AAPL, TSLA)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 font-mono"
          />
          <Button type="submit" className="px-6">
            Search
          </Button>
        </form>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Popular stocks:</p>
          <div className="flex flex-wrap gap-2">
            {popularStocks.map((stock) => (
              <Button
                key={stock.symbol}
                variant={selectedStock === stock.symbol ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectStock(stock.symbol)}
                className="text-xs"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                {stock.symbol}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
