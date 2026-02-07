import { Transport, getCurrentStatusIndex } from '@/data/mockTransports';
import { Clock, AlertCircle } from 'lucide-react';
import { useApp } from '@/lib/i18n';

interface Props {
  transport: Transport;
  className?: string;
}

export default function ETADisplay({ transport, className }: Props) {
  const { t } = useApp();
  const currentIdx = getCurrentStatusIndex(transport);
  const hideETA = currentIdx === 5 || currentIdx >= 8;
  if (hideETA) return null;

  const showPickupETA = currentIdx < 4 && transport.etaPickup;
  const showDestETA = currentIdx >= 6 && transport.etaDestination;
  if (!showPickupETA && !showDestETA) return null;

  return (
    <div className={`bg-card rounded-xl border border-border p-4 shadow-sm ${className || ''}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-active/10 flex items-center justify-center">
          <Clock className="h-5 w-5 text-active" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">
            {showPickupETA ? t('dash.etaPickup') : t('dash.etaDest')}
          </p>
          <p className="text-xl font-display font-bold text-foreground">
            {showPickupETA ? transport.etaPickup : transport.etaDestination}
          </p>
        </div>
      </div>
      <div className="flex items-start gap-1.5 mt-3 text-[11px] text-muted-foreground/80">
        <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
        <span>{t('dash.etaDisclaimer')}</span>
      </div>
    </div>
  );
}
