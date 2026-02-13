import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plane, Truck, Activity, CheckCircle2, Clock, AlertTriangle, ArrowLeft, Calendar,
  QrCode, Copy, Check, X,
} from 'lucide-react';
import orngeLogo from '@/assets/ornge-logo.png';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '@/lib/utils';

const stats = [
  { icon: Activity, label: 'Live Transports', value: '7', color: 'text-primary' },
  { icon: Plane, label: 'Air Active', value: '4', color: 'text-primary' },
  { icon: Truck, label: 'Land Active', value: '3', color: 'text-primary' },
  { icon: CheckCircle2, label: 'Completed Today', value: '23', color: 'text-success' },
  { icon: Clock, label: 'Avg Response', value: '14 min', color: 'text-warning' },
  { icon: AlertTriangle, label: 'Delays', value: '2', color: 'text-destructive' },
];

const recentTransports = [
  { id: 'ORN-2025-4821', trackId: 'T-1', patient: 'S. Mitchell', from: 'Thunder Bay', to: 'Toronto', mode: 'air' as const, status: 'in-transit', care: 'Critical' },
  { id: 'ORN-2025-4819', trackId: 'T-2', patient: 'J. Chen', from: 'Brampton', to: 'Hamilton', mode: 'land' as const, status: 'dispatched', care: 'Advanced' },
  { id: 'ORN-2025-4815', trackId: 'T-3', patient: 'M. Santos', from: 'Sudbury', to: 'Ottawa', mode: 'air' as const, status: 'completed', care: 'Critical' },
  { id: 'ORN-2025-4812', trackId: 'T-4', patient: 'R. Thompson', from: 'Kenora', to: 'Winnipeg', mode: 'air' as const, status: 'completed', care: 'Basic' },
  { id: 'ORN-2025-4808', trackId: 'T-5', patient: 'L. Nguyen', from: 'London', to: 'Toronto', mode: 'land' as const, status: 'completed', care: 'Advanced' },
];

const statusStyles: Record<string, string> = {
  'in-transit': 'bg-primary/15 text-primary border-primary/30',
  dispatched: 'bg-warning/15 text-warning border-warning/30',
  completed: 'bg-success/15 text-success border-success/30',
};

const fleet = [
  { type: 'Fixed-Wing (PC-12)', icon: Plane, total: 10, active: 4, maintenance: 1 },
  { type: 'Rotor-Wing (AW139)', icon: Plane, total: 12, active: 6, maintenance: 2 },
  { type: 'Land Ambulance', icon: Truck, total: 20, active: 3, maintenance: 3 },
];

const anim = (delay: number) => ({
  initial: { opacity: 0, y: 12 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay, duration: 0.35 },
});

export default function V2AdminPortal() {
  const [activeQR, setActiveQR] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getTrackingUrl = (trackId: string) =>
    `${window.location.origin}/v2/track/${trackId}`;

  const handleCopy = async (trackId: string) => {
    try {
      await navigator.clipboard.writeText(getTrackingUrl(trackId));
      setCopiedId(trackId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/v2" className="p-1.5 rounded-lg hover:bg-accent transition-colors">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Link>
            <img src={orngeLogo} alt="Ornge" className="h-8" />
            <div>
              <h1 className="font-bold text-lg text-foreground leading-tight">Operations Dashboard (v2)</h1>
              <p className="text-xs text-muted-foreground">Ornge Transport Medicine</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date().toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {/* Stat cards */}
        <motion.div {...anim(0)} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <s.icon className={cn('h-5 w-5 mb-2', s.color)} />
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Recent Transports */}
        <motion.div {...anim(0.1)}>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Transports</CardTitle>
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
                    <div className="px-5 py-3 flex items-center gap-3 hover:bg-accent/30 transition-colors">
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

                    {activeQR === t.trackId && (
                      <div className="px-5 pb-4 pt-1 flex items-start gap-4 bg-accent/20 border-t border-border/50 animate-in slide-in-from-top-1 duration-200">
                        <div className="bg-white p-2.5 rounded-xl border border-border shadow-sm shrink-0">
                          <QRCodeSVG value={getTrackingUrl(t.trackId)} size={80} level="M" includeMargin={false} />
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
        </motion.div>

        {/* Fleet Status */}
        <motion.div {...anim(0.15)}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Fleet Status</CardTitle>
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
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
