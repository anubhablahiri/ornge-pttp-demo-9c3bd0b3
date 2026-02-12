import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Truck, QrCode, Copy, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';

const recentTransports = [
  { id: 'ORN-2025-4821', trackId: 'T-1', patient: 'S. Mitchell', from: 'Thunder Bay', to: 'Toronto', mode: 'air' as const, status: 'in-transit', care: 'Critical' },
  { id: 'ORN-2025-4819', trackId: 'T-2', patient: 'J. Chen', from: 'Brampton', to: 'Hamilton', mode: 'land' as const, status: 'dispatched', care: 'Advanced' },
  { id: 'ORN-2025-4815', trackId: 'T-3', patient: 'M. Santos', from: 'Sudbury', to: 'Ottawa', mode: 'air' as const, status: 'completed', care: 'Critical' },
  { id: 'ORN-2025-4812', trackId: 'T-4', patient: 'R. Thompson', from: 'Kenora', to: 'Winnipeg', mode: 'air' as const, status: 'completed', care: 'Basic' },
  { id: 'ORN-2025-4808', trackId: 'T-5', patient: 'L. Nguyen', from: 'London', to: 'Toronto', mode: 'land' as const, status: 'completed', care: 'Advanced' },
  { id: 'ORN-2025-4805', trackId: 'T-6', patient: 'K. Patel', from: 'Timmins', to: 'Sudbury', mode: 'air' as const, status: 'in-transit', care: 'Critical' },
];

const statusStyles = {
  'in-transit': 'bg-primary/15 text-primary border-primary/30',
  'dispatched': 'bg-warning/15 text-warning border-warning/30',
  'completed': 'bg-success/15 text-success border-success/30',
};

export default function AdminRecentTransports() {
  const [activeQR, setActiveQR] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getTrackingUrl = (trackId: string) =>
    `${window.location.origin}/v3/track/${trackId}`;

  const handleCopy = async (trackId: string) => {
    try {
      await navigator.clipboard.writeText(getTrackingUrl(trackId));
      setCopiedId(trackId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-display">Recent Transports</CardTitle>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <QrCode className="h-3 w-3" />
            Click QR to share tracking
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {recentTransports.map((t) => (
            <div key={t.id} className="relative">
              <div className="px-6 py-3 flex items-center gap-3 hover:bg-accent/30 transition-colors">
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
                <button
                  onClick={() => setActiveQR(activeQR === t.trackId ? null : t.trackId)}
                  className={cn(
                    'p-1.5 rounded-lg border transition-colors shrink-0',
                    activeQR === t.trackId
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-accent/50 border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                  )}
                  aria-label="Show QR code"
                >
                  <QrCode className="h-4 w-4" />
                </button>
              </div>

              {/* QR Code Popout */}
              {activeQR === t.trackId && (
                <div className="px-6 pb-4 pt-1 flex items-start gap-4 bg-accent/20 border-t border-border/50 animate-in slide-in-from-top-1 duration-200">
                  <div className="bg-white p-2.5 rounded-xl border border-border shadow-sm shrink-0">
                    <QRCodeSVG
                      value={getTrackingUrl(t.trackId)}
                      size={80}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2 py-1">
                    <p className="text-xs font-medium text-foreground">Patient Tracking Link</p>
                    <p className="text-[11px] text-muted-foreground">
                      Share this QR code or link with the patient's family for real-time tracking.
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-0 bg-background border border-border rounded-md px-2.5 py-1.5 text-[11px] text-muted-foreground truncate font-mono">
                        {getTrackingUrl(t.trackId)}
                      </div>
                      <button
                        onClick={() => handleCopy(t.trackId)}
                        className="shrink-0 p-1.5 rounded-md bg-background hover:bg-accent border border-border transition-colors"
                        aria-label="Copy link"
                      >
                        {copiedId === t.trackId ? (
                          <Check className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveQR(null)}
                    className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors mt-1"
                    aria-label="Close"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
