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
  alert_type: 'price_above' | 'price_below' | 'prediction_complete';
  target_value?: number;
  is_active: boolean;
  created_at: string;
}

type AlertType = 'price_above' | 'price_below' | 'prediction_complete';

export function AlertsSystem() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    alert_type: 'price_above' as AlertType,
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

      const formattedAlerts = (data || []).map((alert: any) => ({
        id: alert.id,
        symbol: alert.symbol,
        alert_type: alert.alert_type as AlertType,
        target_value: alert.target_value,
        is_active: alert.is_active,
        created_at: alert.created_at
      }));

      setAlerts(formattedAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async () => {
    if (!user) return;

    // Validation
    if (!newAlert.symbol.trim()) {
      toast({
        title: "Error",
        description: "Please enter a stock symbol",
        variant: "destructive",
      });
      return;
    }

    if ((newAlert.alert_type === 'price_above' || newAlert.alert_type === 'price_below') && 
        (!newAlert.target_value || parseFloat(newAlert.target_value) <= 0)) {
      toast({
        title: "Error",
        description: "Please enter a valid target price",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);

    try {
      const insertData = {
        user_id: user.id,
        symbol: newAlert.symbol.toUpperCase().trim(),
        alert_type: newAlert.alert_type,
        target_value: newAlert.target_value ? parseFloat(newAlert.target_value) : null,
        is_active: true
      };

      console.log('Inserting alert data:', insertData);

      const { data, error } = await supabase
        .from('user_alerts')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Alert created successfully:', data);

      toast({
        title: "Alert created",
        description: `Alert set for ${newAlert.symbol}`,
      });

      setNewAlert({ symbol: '', alert_type: 'price_above', target_value: '' });
      setDialogOpen(false);
      fetchAlerts();
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create alert",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
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
                    onValueChange={(value: AlertType) => setNewAlert({...newAlert, alert_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price_above">Price Above</SelectItem>
                      <SelectItem value="price_below">Price Below</SelectItem>
                      <SelectItem value="prediction_complete">Prediction Complete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(newAlert.alert_type === 'price_above' || newAlert.alert_type === 'price_below') && (
                  <div>
                    <Label htmlFor="price">Target Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newAlert.target_value}
                      onChange={(e) => setNewAlert({...newAlert, target_value: e.target.value})}
                      placeholder="150.00"
                    />
                  </div>
                )}
                <Button 
                  onClick={createAlert} 
                  className="w-full"
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create Alert'}
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
                    {alert.alert_type === 'price_above' && `Price above $${alert.target_value}`}
                    {alert.alert_type === 'price_below' && `Price below $${alert.target_value}`}
                    {alert.alert_type === 'prediction_complete' && 'Prediction completed'}
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
