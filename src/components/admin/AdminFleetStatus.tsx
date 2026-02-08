import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Plane, Truck } from 'lucide-react';

const fleet = [
  { type: 'Fixed-Wing (PC-12)', icon: Plane, total: 10, active: 4, maintenance: 1 },
  { type: 'Rotor-Wing (AW139)', icon: Plane, total: 12, active: 6, maintenance: 2 },
  { type: 'Land Ambulance', icon: Truck, total: 20, active: 3, maintenance: 3 },
];

export default function AdminFleetStatus() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-display">Fleet Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {fleet.map((f) => {
          const available = f.total - f.active - f.maintenance;
          const activePercent = (f.active / f.total) * 100;
          return (
            <div key={f.type}>
              <div className="flex items-center gap-2 mb-2">
                <f.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{f.type}</span>
              </div>
              <Progress value={activePercent} className="h-2.5 mb-2 [&>div]:bg-primary" />
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span><span className="font-semibold text-primary">{f.active}</span> Active</span>
                <span><span className="font-semibold text-success">{available}</span> Available</span>
                <span><span className="font-semibold text-warning">{f.maintenance}</span> Maintenance</span>
              </div>
            </div>
          );
        })}

        <div className="pt-3 border-t border-border">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-display font-bold text-foreground">42</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Fleet</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-primary">13</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Active Now</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-success">23</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Available</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
