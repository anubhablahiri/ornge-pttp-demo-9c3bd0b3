import { Transport } from '@/data/mockTransports';
import { Plane, Truck, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Props {
  transport: Transport;
}

export default function TransportHeader({ transport }: Props) {
  const ModeIcon = transport.mode === 'air' ? Plane : Truck;

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
            {transport.referenceId}
          </p>
          <h2 className="text-xl font-display font-bold text-foreground mt-0.5">
            {transport.patientFirstName}'s Transport
          </h2>
        </div>
        <div className="flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3 py-1.5">
          <ModeIcon className="h-4 w-4" />
          <span className="text-xs font-semibold capitalize">{transport.mode}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Badge variant="secondary" className="text-xs">
          <Heart className="h-3 w-3 mr-1" />
          {transport.careLevel}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
          <span className="text-muted-foreground">From:</span>
          <span className="font-medium text-foreground truncate">{transport.originFacility}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success shrink-0" />
          <span className="text-muted-foreground">To:</span>
          <span className="font-medium text-foreground truncate">{transport.destinationFacility}</span>
        </div>
      </div>
    </div>
  );
}
