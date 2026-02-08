import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { User, Clock, Phone } from 'lucide-react';

type ShiftStatus = 'on-duty' | 'on-call' | 'off-duty' | 'en-route';

interface CrewMember {
  name: string;
  role: string;
  shift: string;
  status: ShiftStatus;
  base: string;
  vehicle?: string;
}

const crew: CrewMember[] = [
  { name: 'Dr. A. Simmons', role: 'Flight Physician', shift: '06:00–18:00', status: 'on-duty', base: 'Toronto', vehicle: 'AW139-04' },
  { name: 'P. Kowalski, PCP', role: 'Flight Paramedic', shift: '06:00–18:00', status: 'en-route', base: 'Toronto', vehicle: 'AW139-04' },
  { name: 'J. Whitehorse, ACP', role: 'Flight Paramedic', shift: '06:00–18:00', status: 'on-duty', base: 'Sudbury', vehicle: 'PC12-02' },
  { name: 'R. Delgado', role: 'Pilot', shift: '06:00–18:00', status: 'en-route', base: 'Thunder Bay', vehicle: 'PC12-05' },
  { name: 'S. Okafor, ACP', role: 'Land Paramedic', shift: '07:00–19:00', status: 'on-duty', base: 'Ottawa', vehicle: 'AMB-12' },
  { name: 'N. Tremblay', role: 'Flight Paramedic', shift: '18:00–06:00', status: 'on-call', base: 'Toronto' },
  { name: 'M. Blackwood', role: 'Pilot', shift: '18:00–06:00', status: 'off-duty', base: 'Sudbury' },
  { name: 'T. Hagen, PCP', role: 'Land Paramedic', shift: '19:00–07:00', status: 'on-call', base: 'London' },
];

const statusStyles: Record<ShiftStatus, string> = {
  'on-duty': 'bg-success/15 text-success border-success/30',
  'on-call': 'bg-warning/15 text-warning border-warning/30',
  'off-duty': 'bg-muted text-muted-foreground border-border',
  'en-route': 'bg-primary/15 text-primary border-primary/30',
};

const statusDot: Record<ShiftStatus, string> = {
  'on-duty': 'bg-success',
  'on-call': 'bg-warning',
  'off-duty': 'bg-muted-foreground/40',
  'en-route': 'bg-primary',
};

export default function AdminCrewScheduling() {
  const onDuty = crew.filter((c) => c.status === 'on-duty' || c.status === 'en-route').length;
  const onCall = crew.filter((c) => c.status === 'on-call').length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-display">Crew Scheduling</CardTitle>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" />{onDuty} On Duty</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" />{onCall} On Call</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {crew.map((c) => (
            <div key={c.name} className="px-6 py-3 flex items-center gap-3 hover:bg-accent/30 transition-colors">
              <div className="relative">
                <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                  <User className="h-4 w-4" />
                </div>
                <span className={cn('absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card', statusDot[c.status])} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{c.name}</span>
                  {c.vehicle && <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{c.vehicle}</span>}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{c.role}</span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{c.shift}</span>
                  <span>·</span>
                  <span>{c.base}</span>
                </div>
              </div>
              <Badge variant="outline" className={cn('text-[10px] font-medium capitalize whitespace-nowrap', statusStyles[c.status])}>
                {c.status.replace('-', ' ')}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
