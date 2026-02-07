import { Transport } from '@/data/mockTransports';
import { Bell, ArrowRightLeft, MapPin, AlertTriangle } from 'lucide-react';
import { useApp } from '@/lib/i18n';

interface Props {
  transport: Transport;
}

const iconMap = {
  status: ArrowRightLeft,
  departure: MapPin,
  arrival: MapPin,
  delay: AlertTriangle,
};

export default function NotificationFeed({ transport }: Props) {
  const { t } = useApp();
  if (!transport.notifications.length) return null;

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">{t('dash.updates')}</h3>
      </div>
      <div className="space-y-3">
        {[...transport.notifications].reverse().map((n) => {
          const Icon = iconMap[n.type];
          return (
            <div key={n.id} className="flex gap-3 items-start">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                n.type === 'delay' ? 'bg-warning/10 text-warning' : 'bg-accent text-accent-foreground'
              }`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-foreground leading-snug">{n.message}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
