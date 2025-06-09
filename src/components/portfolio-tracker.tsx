
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { fetchStockData } from '@/lib/api';

interface Position {
  id: string;
  symbol: string;
  shares: number;
  average_cost: number;
  created_at: string;
  current_price?: number;
  current_value?: number;
  gain_loss?: number;
  gain_loss_percent?: number;
}

export function PortfolioTracker() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newPosition, setNewPosition] = useState({
    symbol: '',
    shares: '',
    average_cost: ''
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchPositions();
    }
  }, [user]);

  const fetchPositions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_positions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch current prices for all positions
      const positionsWithPrices = await Promise.all(
        (data || []).map(async (position: any) => {
          try {
            const stockData = await fetchStockData(position.symbol);
            const currentValue = stockData.price * position.shares;
            const purchaseValue = position.average_cost * position.shares;
            const gainLoss = currentValue - purchaseValue;
            const gainLossPercent = (gainLoss / purchaseValue) * 100;

            return {
              id: position.id,
              symbol: position.symbol,
              shares: position.shares,
              average_cost: position.average_cost,
              created_at: position.created_at,
              current_price: stockData.price,
              current_value: currentValue,
              gain_loss: gainLoss,
              gain_loss_percent: gainLossPercent
            };
          } catch (error) {
            console.error(`Error fetching price for ${position.symbol}:`, error);
            return {
              id: position.id,
              symbol: position.symbol,
              shares: position.shares,
              average_cost: position.average_cost,
              created_at: position.created_at
            };
          }
        })
      );

      setPositions(positionsWithPrices);
    } catch (error) {
      console.error('Error fetching positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPosition = async () => {
    if (!user) return;

    try {
      const shares = parseFloat(newPosition.shares);
      const averageCost = parseFloat(newPosition.average_cost);
      
      const { error } = await supabase
        .from('user_positions')
        .insert({
          user_id: user.id,
          symbol: newPosition.symbol.toUpperCase(),
          shares: shares,
          average_cost: averageCost,
          total_cost: shares * averageCost
        });

      if (error) throw error;

      toast({
        title: "Position added",
        description: `Added ${newPosition.shares} shares of ${newPosition.symbol}`,
      });

      setNewPosition({ symbol: '', shares: '', average_cost: '' });
      setAddDialogOpen(false);
      fetchPositions();
    } catch (error) {
      console.error('Error adding position:', error);
      toast({
        title: "Error",
        description: "Failed to add position",
        variant: "destructive",
      });
    }
  };

  const removePosition = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_positions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Position removed",
        description: "Position removed from portfolio",
      });

      fetchPositions();
    } catch (error) {
      console.error('Error removing position:', error);
      toast({
        title: "Error",
        description: "Failed to remove position",
        variant: "destructive",
      });
    }
  };

  const totalValue = positions.reduce((sum, pos) => sum + (pos.current_value || 0), 0);
  const totalGainLoss = positions.reduce((sum, pos) => sum + (pos.gain_loss || 0), 0);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Portfolio</h3>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Position
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Position</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="symbol">Symbol</Label>
                  <Input
                    id="symbol"
                    value={newPosition.symbol}
                    onChange={(e) => setNewPosition({...newPosition, symbol: e.target.value})}
                    placeholder="AAPL"
                  />
                </div>
                <div>
                  <Label htmlFor="shares">Shares</Label>
                  <Input
                    id="shares"
                    type="number"
                    value={newPosition.shares}
                    onChange={(e) => setNewPosition({...newPosition, shares: e.target.value})}
                    placeholder="10"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Average Cost</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newPosition.average_cost}
                    onChange={(e) => setNewPosition({...newPosition, average_cost: e.target.value})}
                    placeholder="150.00"
                  />
                </div>
                <Button onClick={addPosition} className="w-full">Add Position</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-accent/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-accent/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total P&L</p>
            <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Positions */}
        <div className="space-y-3">
          {positions.map((position) => (
            <div key={position.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h4 className="font-semibold">{position.symbol}</h4>
                    <p className="text-sm text-muted-foreground">
                      {position.shares} shares @ ${position.average_cost.toFixed(2)}
                    </p>
                  </div>
                  {position.current_price && (
                    <Badge variant="secondary">
                      ${position.current_price.toFixed(2)}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {position.gain_loss !== undefined && (
                    <div className={`text-right ${position.gain_loss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      <div className="flex items-center gap-1">
                        {position.gain_loss >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="font-semibold">
                          {position.gain_loss >= 0 ? '+' : ''}${position.gain_loss.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs">
                        ({position.gain_loss_percent?.toFixed(2)}%)
                      </p>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePosition(position.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {positions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No positions yet. Add your first position to start tracking!</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
