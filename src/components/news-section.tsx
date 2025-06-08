
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper, ExternalLink } from 'lucide-react';
import { fetchStockNews } from '@/lib/api';

interface NewsSectionProps {
  symbol: string;
}

export function NewsSection({ symbol }: NewsSectionProps) {
  const { data: news, isLoading } = useQuery({
    queryKey: ['news', symbol],
    queryFn: () => fetchStockNews(symbol),
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-6 bg-muted rounded animate-pulse"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse"></div>
              <div className="h-3 bg-muted rounded w-3/4 animate-pulse"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Latest News</h3>
          <Badge variant="secondary" className="text-xs">
            {symbol}
          </Badge>
        </div>

        <div className="space-y-4">
          {news?.slice(0, 5).map((article: any, index: number) => (
            <div key={index} className="p-4 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm leading-tight line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {article.summary}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={article.sentiment > 0 ? 'default' : article.sentiment < 0 ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {article.sentiment > 0 ? 'Positive' : article.sentiment < 0 ? 'Negative' : 'Neutral'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{article.publishedAt}</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
