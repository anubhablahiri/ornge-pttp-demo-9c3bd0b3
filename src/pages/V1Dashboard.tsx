import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Share2, MessageSquare, Check } from 'lucide-react';
import { mockTransports, Transport, getCurrentStatusIndex } from '@/data/mockTransports';
import orngeLogo from '@/assets/ornge-logo.png';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '@/lib/i18n';

// V1: 5-stage horizontal timeline
const V1_STAGES = [
  { label: 'Requested' },
  { label: 'Team Assigned' },
  { label: 'En Route to Pickup' },
  { label: 'In Transit' },
  { label: 'Arrived' },
];

function mapToV1Stage(statusIndex: number): number {
  if (statusIndex <= 1) return 0;
  if (statusIndex <= 3) return 1;
  if (statusIndex <= 5) return 2;
  if (statusIndex <= 7) return 3;
  return 4;
}

export default function V1Dashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { deviceFormat } = useApp();
  const [transport, setTransport] = useState<Transport | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const found = mockTransports.find((t) => t.id === id);
    if (found) setTransport({ ...found });
    else navigate('/v1');
  }, [id, navigate]);

  if (!transport) return null;

  const currentIdx = getCurrentStatusIndex(transport);
  const v1Stage = mapToV1Stage(currentIdx);
  const activeStatus = transport.statuses[currentIdx];
  const shareUrl = `${window.location.origin}/v1/track/${transport.id}`;
  const isDesktop = deviceFormat === 'desktop';

  // --- Shared UI blocks ---

  const qrBlock = (
    <motion.div
      className="bg-card rounded-2xl p-4 border border-border shadow-sm flex flex-col items-center gap-3"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-white p-3 rounded-xl border border-border">
        <QRCodeSVG value={shareUrl} size={80} level="M" includeMargin={false} />
      </div>
      <p className="text-xs text-muted-foreground">Scan to share tracking</p>
      <button
        onClick={() => navigator.clipboard?.writeText(shareUrl)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/80 transition-colors"
      >
        <Share2 className="h-4 w-4" />
        Copy Tracking Link
      </button>
    </motion.div>
  );

  const patientBlock = (
    <motion.div
      className="bg-card rounded-2xl p-4 border border-border shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
    >
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
        <div className="mt-3 p-2 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-xs text-primary">
            ETA: {transport.etaDestination || transport.etaPickup}
          </p>
        </div>
      )}
    </motion.div>
  );

  const timelineBlock = (
    <motion.div
      className="bg-card rounded-2xl p-4 border border-border shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">Transport Progress</h3>
      <div className="flex items-center justify-between relative">
        <div className="absolute top-3 left-4 right-4 h-0.5 bg-border" />
        <div
          className="absolute top-3 left-4 h-0.5 bg-primary transition-all duration-500"
          style={{ width: `${(v1Stage / (V1_STAGES.length - 1)) * (100 - 8)}%` }}
        />
        {V1_STAGES.map((stage, i) => (
          <div key={i} className="flex flex-col items-center z-10 relative">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < v1Stage
                  ? 'bg-primary text-primary-foreground'
                  : i === v1Stage
                  ? 'bg-active text-active-foreground animate-pulse-active'
                  : 'bg-muted text-muted-foreground border-2 border-border'
              }`}
            >
              {i < v1Stage ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span
              className={`text-[10px] mt-1.5 text-center max-w-[60px] leading-tight ${
                i < v1Stage ? 'text-foreground font-medium' : i === v1Stage ? 'text-active font-semibold' : 'text-muted-foreground'
              }`}
            >
              {stage.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const messageBlock = (
    <motion.div
      className="bg-card rounded-2xl p-4 border border-primary/30 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-primary">Special Message</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {activeStatus?.message || 'No updates at this time. Your transport is being managed safely.'}
      </p>
      {transport.clinicalNotes && (
        <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
          {transport.clinicalNotes}
        </p>
      )}
    </motion.div>
  );

  const crewBlock = (
    <motion.div
      className="bg-card rounded-2xl p-4 border border-border shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <h3 className="text-sm font-semibold text-foreground mb-3">Transport Details</h3>
      <div className="space-y-2 text-sm">
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
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className={`${isDesktop ? 'max-w-6xl' : 'max-w-lg'} mx-auto flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <Link to="/v1" className="p-1.5 rounded-lg hover:bg-accent transition-colors">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Link>
            <img src={orngeLogo} alt="Ornge" className="h-7" />
            <span className={`text-sm font-semibold text-foreground ${isDesktop ? '' : 'hidden sm:inline'}`}>
              Patient Transport Tracking (v1)
            </span>
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

      {isDesktop ? (
        /* Desktop: two-column layout */
        <main className="max-w-6xl mx-auto px-6 pt-6 pb-8">
          {/* Full-width timeline */}
          <div className="mb-6">{timelineBlock}</div>

          <div className="grid grid-cols-[1fr_320px] gap-6">
            {/* Left column */}
            <div className="space-y-6">
              {patientBlock}
              {messageBlock}
              {crewBlock}
            </div>
            {/* Right column */}
            <div className="space-y-6">
              {qrBlock}
            </div>
          </div>
        </main>
      ) : (
        /* Mobile / Tablet: single column */
        <main className="max-w-lg mx-auto px-4 pt-6 pb-8 space-y-6">
          {qrBlock}
          {patientBlock}
          {timelineBlock}
          {messageBlock}
          {crewBlock}
        </main>
      )}
    </div>
  );
}
