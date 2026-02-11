import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Share2, Bell, QrCode, CheckCircle2, Circle, Clock } from 'lucide-react';
import { mockTransports, Transport, getCurrentStatusIndex } from '@/data/mockTransports';
import orngeLogo from '@/assets/ornge-logo.png';

// V2: 7-stage vertical timeline
const V2_STAGES = [
  { label: 'Transport Requested' },
  { label: 'Team Assigned' },
  { label: 'Team Dispatched' },
  { label: 'Arrived at Pickup' },
  { label: 'Patient Onboard' },
  { label: 'En Route to Destination' },
  { label: 'Transport Complete' },
];

function mapToV2Stage(statusIndex: number): number {
  if (statusIndex <= 0) return 0;
  if (statusIndex <= 1) return 1;
  if (statusIndex <= 3) return 2;
  if (statusIndex <= 4) return 3;
  if (statusIndex <= 6) return 4;
  if (statusIndex <= 8) return 5;
  return 6;
}

export default function V2Dashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transport, setTransport] = useState<Transport | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const found = mockTransports.find((t) => t.id === id);
    if (found) setTransport({ ...found });
    else navigate('/v2');
  }, [id, navigate]);

  if (!transport) return null;

  const currentIdx = getCurrentStatusIndex(transport);
  const v2Stage = mapToV2Stage(currentIdx);
  const shareUrl = `${window.location.origin}/v2/track/${transport.id}`;

  const anim = (delay: number) => ({
    initial: { opacity: 0, y: 10 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { delay, duration: 0.3 },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/v2" className="p-1.5 rounded-lg hover:bg-accent transition-colors">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Link>
            <img src={orngeLogo} alt="Ornge" className="h-7" />
          </div>
          <button
            onClick={() => setLastRefresh(new Date())}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 pb-8 space-y-4">
        {/* Patient Card */}
        <motion.div className="bg-card rounded-2xl p-5 border border-border shadow-sm" {...anim(0)}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-muted-foreground">Reference</p>
              <p className="font-bold text-lg text-foreground">{transport.referenceId}</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {transport.mode === 'air' ? '✈ Air' : '🚑 Land'}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">From</p>
              <p className="font-medium text-foreground">{transport.originFacility}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">To</p>
              <p className="font-medium text-foreground">{transport.destinationFacility}</p>
            </div>
          </div>
          {(transport.etaDestination || transport.etaPickup) && (
            <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-active/5 border border-active/15">
              <Clock className="h-4 w-4 text-active" />
              <span className="text-sm font-medium text-active">
                ETA: {transport.etaDestination || transport.etaPickup}
              </span>
            </div>
          )}
        </motion.div>

        {/* 7-Stage Vertical Timeline */}
        <motion.div className="bg-card rounded-2xl p-5 border border-border shadow-sm" {...anim(0.05)}>
          <h3 className="text-sm font-semibold text-foreground mb-4">Transport Progress</h3>
          <div className="space-y-0">
            {V2_STAGES.map((stage, i) => {
              const isDone = i < v2Stage;
              const isActive = i === v2Stage;
              const isPending = i > v2Stage;

              return (
                <div key={i} className="flex gap-3">
                  {/* Vertical line + dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        isDone
                          ? 'bg-success text-success-foreground'
                          : isActive
                          ? 'bg-active text-active-foreground animate-pulse'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Circle className="h-3 w-3" />
                      )}
                    </div>
                    {i < V2_STAGES.length - 1 && (
                      <div
                        className={`w-0.5 h-8 ${
                          isDone ? 'bg-success/40' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                  {/* Label */}
                  <div className="pt-1 pb-3">
                    <p
                      className={`text-sm font-medium ${
                        isDone
                          ? 'text-foreground'
                          : isActive
                          ? 'text-active font-semibold'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {stage.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Notification Feed */}
        <motion.div className="bg-card rounded-2xl p-5 border border-border shadow-sm" {...anim(0.1)}>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Updates</h3>
          </div>
          <div className="space-y-3">
            {transport.notifications.map((n) => (
              <div key={n.id} className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm text-foreground">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Transport Details Card */}
        <motion.div className="bg-card rounded-2xl p-5 border border-border shadow-sm" {...anim(0.15)}>
          <h3 className="text-sm font-semibold text-foreground mb-3">Transport Details</h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Care Level</span>
              <span className="font-medium text-foreground">{transport.careLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Crew</span>
              <span className="font-medium text-foreground text-right max-w-[60%]">{transport.crew.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vehicle</span>
              <span className="font-medium text-foreground">{transport.crew.vehicleId}</span>
            </div>
          </div>
        </motion.div>

        {/* QR Code + Share */}
        <motion.div className="bg-card rounded-2xl p-5 border border-border shadow-sm" {...anim(0.2)}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Share Tracking</h3>
              <p className="text-xs text-muted-foreground">Share this link with family members</p>
            </div>
            <div className="bg-white p-2 rounded-lg border border-border">
              <QrCode className="h-14 w-14 text-foreground" />
            </div>
          </div>
          <button
            onClick={() => navigator.clipboard?.writeText(shareUrl)}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/80 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            Copy Tracking Link
          </button>
        </motion.div>

        {transport.clinicalNotes && (
          <motion.div className="bg-card rounded-2xl p-5 border border-border shadow-sm" {...anim(0.25)}>
            <h3 className="text-sm font-semibold text-foreground mb-2">Clinical Notes</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{transport.clinicalNotes}</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
