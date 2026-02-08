import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

const recentTransports = [
  { id: 'ORN-2025-4821', patient: 'S. Mitchell', from: 'Thunder Bay', to: 'Toronto', mode: 'air' as const, status: 'in-transit', care: 'Critical' },
  { id: 'ORN-2025-4819', patient: 'J. Chen', from: 'Brampton', to: 'Hamilton', mode: 'land' as const, status: 'dispatched', care: 'Advanced' },
  { id: 'ORN-2025-4815', patient: 'M. Santos', from: 'Sudbury', to: 'Ottawa', mode: 'air' as const, status: 'completed', care: 'Critical' },
  { id: 'ORN-2025-4812', patient: 'R. Thompson', from: 'Kenora', to: 'Winnipeg', mode: 'air' as const, status: 'completed', care: 'Basic' },
  { id: 'ORN-2025-4808', patient: 'L. Nguyen', from: 'London', to: 'Toronto', mode: 'land' as const, status: 'completed', care: 'Advanced' },
  { id: 'ORN-2025-4805', patient: 'K. Patel', from: 'Timmins', to: 'Sudbury', mode: 'air' as const, status: 'in-transit', care: 'Critical' },
];

const statusStyles = {
  'in-transit': 'bg-primary/15 text-primary border-primary/30',
  'dispatched': 'bg-warning/15 text-warning border-warning/30',
  'completed': 'bg-success/15 text-success border-success/30',
};

export default function AdminRecentTransports() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-display">Recent Transports</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {recentTransports.map((t) => (
            <div key={t.id} className="px-6 py-3 flex items-center gap-3 hover:bg-accent/30 transition-colors">
              <div className={cn('p-2 rounded-lg', t.mode === 'air' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary')}>
                {t.mode === 'air' ? <Plane className="h-4 w-4" /> : <Truck className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{t.patient}</span>
                  <span className="text-xs text-muted-foreground">{t.id}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{t.from} → {t.to}</p>
              </div>
              <Badge variant="outline" className={cn('text-[10px] font-medium capitalize', statusStyles[t.status])}>
                {t.status.replace('-', ' ')}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
