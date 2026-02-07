import { useState } from 'react';
import { Transport, TRANSPORT_MILESTONES } from '@/data/mockTransports';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  transport: Transport;
  onUpdate: (updated: Transport) => void;
}

export default function AdminToggle({ transport, onUpdate }: Props) {
  const [open, setOpen] = useState(false);

  const jumpToStatus = (targetIdx: number) => {
    const newStatuses = TRANSPORT_MILESTONES.map((m, i) => ({
      ...m,
      completedAt: i < targetIdx ? new Date(Date.now() - (targetIdx - i) * 10 * 60000).toISOString() : undefined,
      isActive: i === targetIdx,
    }));
    onUpdate({ ...transport, statuses: newStatuses });
  };

  const toggleMode = () => {
    onUpdate({
      ...transport,
      mode: transport.mode === 'air' ? 'land' : 'air',
      altitude: transport.mode === 'land' ? 24000 : undefined,
    });
  };

  const addDelay = () => {
    const delayNotif = {
      id: `delay-${Date.now()}`,
      type: 'delay' as const,
      message: 'A brief delay has been reported due to weather conditions. We are monitoring the situation.',
      timestamp: new Date().toISOString(),
    };
    onUpdate({ ...transport, notifications: [...transport.notifications, delayNotif] });
  };

  const removeLastDelay = () => {
    const lastDelayIdx = [...transport.notifications].reverse().findIndex((n) => n.type === 'delay');
    if (lastDelayIdx === -1) return;
    const idx = transport.notifications.length - 1 - lastDelayIdx;
    onUpdate({ ...transport, notifications: transport.notifications.filter((_, i) => i !== idx) });
  };

  const hasDelays = transport.notifications.some((n) => n.type === 'delay');

  return (
    <div className="bg-card rounded-xl border-2 border-dashed border-warning/40 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 text-sm hover:bg-accent/50 transition-colors"
      >
        <span className="flex items-center gap-2 font-semibold text-foreground">
          <Settings className="h-4 w-4 text-warning" />
          Demo Controls
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="px-5 pb-4 space-y-3">
          <p className="text-xs text-muted-foreground">Jump to a specific status:</p>
          <div className="grid grid-cols-2 gap-1.5">
            {TRANSPORT_MILESTONES.map((m, i) => (
              <Button
                key={m.id}
                variant="outline"
                size="sm"
                className="text-[11px] h-7 justify-start"
                onClick={() => jumpToStatus(i)}
              >
                {i + 1}. {m.label.slice(0, 20)}…
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={toggleMode}>
              Switch to {transport.mode === 'air' ? 'Land' : 'Air'}
            </Button>
            <Button variant="outline" size="sm" onClick={addDelay}>
              Simulate Delay
            </Button>
            {hasDelays && (
              <Button variant="outline" size="sm" onClick={removeLastDelay} className="text-destructive border-destructive/30">
                Undo Delay
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
