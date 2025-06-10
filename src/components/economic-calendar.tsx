
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, TrendingUp, AlertCircle } from 'lucide-react';

interface EconomicEvent {
  id: string;
  time: string;
  country: string;
  event: string;
  importance: 'high' | 'medium' | 'low';
  actual?: string;
  forecast?: string;
  previous?: string;
  impact: 'bullish' | 'bearish' | 'neutral';
}

export function EconomicCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const events: EconomicEvent[] = [
    {
      id: '1',
      time: '08:30',
      country: 'US',
      event: 'Non-Farm Payrolls',
      importance: 'high',
      actual: '303K',
      forecast: '200K',
      previous: '275K',
      impact: 'bullish'
    },
    {
      id: '2',
      time: '08:30',
      country: 'US',
      event: 'Unemployment Rate',
      importance: 'high',
      actual: '3.8%',
      forecast: '3.9%',
      previous: '3.9%',
      impact: 'bullish'
    },
    {
      id: '3',
      time: '10:00',
      country: 'US',
      event: 'ISM Manufacturing PMI',
      importance: 'medium',
      forecast: '49.2',
      previous: '47.8',
      impact: 'neutral'
    },
    {
      id: '4',
      time: '14:00',
      country: 'US',
      event: 'FOMC Meeting Minutes',
      importance: 'high',
      impact: 'neutral'
    },
    {
      id: '5',
      time: '02:00',
      country: 'EU',
      event: 'ECB Interest Rate Decision',
      importance: 'high',
      actual: '4.50%',
      forecast: '4.50%',
      previous: '4.50%',
      impact: 'neutral'
    },
    {
      id: '6',
      time: '04:30',
      country: 'UK',
      event: 'GDP Growth Rate QoQ',
      importance: 'medium',
      actual: '0.6%',
      forecast: '0.4%',
      previous: '0.1%',
      impact: 'bullish'
    }
  ];

  const upcomingEvents = [
    {
      date: 'Tomorrow',
      event: 'US CPI Inflation Rate',
      time: '08:30',
      importance: 'high' as const
    },
    {
      date: 'Dec 18',
      event: 'Fed Interest Rate Decision',
      time: '14:00',
      importance: 'high' as const
    },
    {
      date: 'Dec 20',
      event: 'US GDP Growth Rate',
      time: '08:30',
      importance: 'medium' as const
    }
  ];

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'bullish': return 'text-green-600';
      case 'bearish': return 'text-red-600';
      case 'neutral': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const filteredEvents = events.filter(event => 
    filter === 'all' || event.importance === filter
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Economic Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium">Filter by importance:</span>
              {['all', 'high', 'medium', 'low'].map((level) => (
                <Button
                  key={level}
                  variant={filter === level ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(level as any)}
                  className="capitalize"
                >
                  {level}
                </Button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <div key={event.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono">{event.time}</span>
                      </div>
                      <Badge variant="outline">{event.country}</Badge>
                      <Badge variant={getImportanceColor(event.importance)}>
                        {event.importance}
                      </Badge>
                    </div>
                    <div className={`flex items-center gap-1 ${getImpactColor(event.impact)}`}>
                      {event.impact === 'bullish' && <TrendingUp className="h-4 w-4" />}
                      {event.impact === 'bearish' && <TrendingUp className="h-4 w-4 rotate-180" />}
                      {event.impact === 'neutral' && <AlertCircle className="h-4 w-4" />}
                      <span className="text-sm capitalize">{event.impact}</span>
                    </div>
                  </div>

                  <h4 className="font-semibold mb-2">{event.event}</h4>

                  {(event.actual || event.forecast || event.previous) && (
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Actual:</span>
                        <span className="font-mono ml-1">{event.actual || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Forecast:</span>
                        <span className="font-mono ml-1">{event.forecast || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Previous:</span>
                        <span className="font-mono ml-1">{event.previous || 'N/A'}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="week" className="space-y-4">
            <div className="grid gap-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => (
                <div key={day} className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">{day}</h4>
                  <div className="space-y-2">
                    {events.slice(index, index + 2).map((event) => (
                      <div key={event.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{event.time}</span>
                          <Badge variant="outline" className="text-xs">{event.country}</Badge>
                          <span>{event.event}</span>
                        </div>
                        <Badge variant={getImportanceColor(event.importance)} className="text-xs">
                          {event.importance}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{event.date}</span>
                      <span className="text-sm font-mono">{event.time}</span>
                      <Badge variant={getImportanceColor(event.importance)}>
                        {event.importance}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      Set Alert
                    </Button>
                  </div>
                  <h4 className="font-semibold">{event.event}</h4>
                </div>
              ))}
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Market Impact Analysis</h4>
              <div className="text-sm space-y-1">
                <p>• Fed decision likely to maintain current rates</p>
                <p>• CPI data could influence December policy direction</p>
                <p>• GDP growth rate may affect sector rotation</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
