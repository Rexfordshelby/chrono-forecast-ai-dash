
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  symbol: string;
  alert_type: 'PRICE_ABOVE' | 'PRICE_BELOW' | 'PREDICTION_COMPLETE';
  target_value?: number;
  is_active: boolean;
  created_at: string;
}

export function AlertsSystem() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    alert_type: 'PRICE_ABOVE' as const,
    target_value: ''
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchAlerts();
    }
  }, [user]);

  const fetchAlerts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_alerts')
        .insert({
          user_id: user.id,
          symbol: newAlert.symbol.toUpperCase(),
          alert_type: newAlert.alert_type,
          target_value: newAlert.target_value ? parseFloat(newAlert.target_value) : null
        });

      if (error) throw error;

      toast({
        title: "Alert created",
        description: `Alert set for ${newAlert.symbol}`,
      });

      setNewAlert({ symbol: '', alert_type: 'PRICE_ABOVE', target_value: '' });
      setDialogOpen(false);
      fetchAlerts();
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: "Error",
        description: "Failed to create alert",
        variant: "destructive",
      });
    }
  };

  const deleteAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_alerts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Alert deleted",
        description: "Alert has been removed",
      });

      fetchAlerts();
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: "Error",
        description: "Failed to delete alert",
        variant: "destructive",
      });
    }
  };

  const toggleAlert = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('user_alerts')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      fetchAlerts();
    } catch (error) {
      console.error('Error toggling alert:', error);
    }
  };

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
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Price Alerts
          </h3>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Alert</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="symbol">Stock Symbol</Label>
                  <Input
                    id="symbol"
                    value={newAlert.symbol}
                    onChange={(e) => setNewAlert({...newAlert, symbol: e.target.value})}
                    placeholder="AAPL"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Alert Type</Label>
                  <Select
                    value={newAlert.alert_type}
                    onValueChange={(value: any) => setNewAlert({...newAlert, alert_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRICE_ABOVE">Price Above</SelectItem>
                      <SelectItem value="PRICE_BELOW">Price Below</SelectItem>
                      <SelectItem value="PREDICTION_COMPLETE">Prediction Complete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(newAlert.alert_type === 'PRICE_ABOVE' || newAlert.alert_type === 'PRICE_BELOW') && (
                  <div>
                    <Label htmlFor="price">Target Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newAlert.target_value}
                      onChange={(e) => setNewAlert({...newAlert, target_value: e.target.value})}
                      placeholder="150.00"
                    />
                  </div>
                )}
                <Button onClick={createAlert} className="w-full">
                  Create Alert
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className={`h-4 w-4 ${alert.is_active ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <p className="font-semibold">{alert.symbol}</p>
                  <p className="text-sm text-muted-foreground">
                    {alert.alert_type === 'PRICE_ABOVE' && `Price above $${alert.target_value}`}
                    {alert.alert_type === 'PRICE_BELOW' && `Price below $${alert.target_value}`}
                    {alert.alert_type === 'PREDICTION_COMPLETE' && 'Prediction completed'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={alert.is_active ? 'default' : 'secondary'}>
                  {alert.is_active ? 'Active' : 'Paused'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleAlert(alert.id, alert.is_active)}
                >
                  {alert.is_active ? 'Pause' : 'Resume'}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteAlert(alert.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2" />
              <p>No alerts set. Create your first alert to get notified!</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
