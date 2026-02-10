import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Plane, Truck, Clock, MapPin, Check, AlertCircle } from 'lucide-react';
import orngeLogo from '@/assets/ornge-logo.png';
import { getTransportByRef, getCurrentStatusIndex, isTransportComplete, type Transport } from '@/data/mockTransports';

// V2 uses 7 milestones (between V1's 5 and V3's 10)
const V2_MILESTONES = [
  'Preparing for Transport',
  'Team Assigned & Dispatched',
  'En Route to Pickup',
  'At Pickup – Patient Transfer',
  'En Route to Destination',
  'Arrived at Destination',
  'Transport Completed',
];

function mapToV2Status(transport: Transport) {
  const idx = getCurrentStatusIndex(transport);
  const complete = isTransportComplete(transport);
  // Map 10-stage index to 7-stage
  if (complete) return 6;
  if (idx <= 1) return 0;
  if (idx === 2) return 1;
  if (idx === 3) return 2;
  if (idx <= 5) return 3;
  if (idx <= 7) return 4;
  if (idx === 8) return 5;
  return 6;
}

export default function V2Status() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const transport = id ? getTransportByRef(id) : undefined;

  if (!transport) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h1 className="text-xl font-bold text-foreground mb-2">Transport Not Found</h1>
        <p className="text-muted-foreground mb-6">No transport found for reference <span className="font-mono text-primary">{id}</span></p>
        <button onClick={() => navigate('/v2/family')} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  const v2Idx = mapToV2Status(transport);
  const complete = isTransportComplete(transport);
  const isAir = transport.mode === 'air';
  const eta = transport.etaDestination || transport.etaPickup || 'TBD';

  const lastUpdated = new Date().toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="py-4 px-6 flex items-center justify-between border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <img src={orngeLogo} alt="Ornge" className="h-8" />
        </div>
        <button
          onClick={() => navigate('/v2/family')}
          className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Change Tracking #
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-6 space-y-5">
        {/* QR + Summary card */}
        <div className="bg-card rounded-2xl border border-border p-5 flex flex-col sm:flex-row gap-5 items-center">
          <div className="bg-white p-3 rounded-xl border border-border shrink-0">
            <QRCodeSVG
              value={`${window.location.origin}/v2/status/${id}`}
              size={100}
              bgColor="#ffffff"
              fgColor="hsl(224,70%,35%)"
            />
          </div>
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isAir ? 'bg-primary/10' : 'bg-secondary/10'}`}>
                {isAir ? <Plane className="w-4 h-4 text-primary" /> : <Truck className="w-4 h-4 text-secondary" />}
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isAir ? 'Air Transport' : 'Land Transport'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Ref: <span className="font-mono font-medium text-foreground">{transport.referenceId}</span>
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              Updated {lastUpdated}
            </div>
          </div>
        </div>

        {/* ETA + Destination */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Estimated Arrival</p>
            <p className="text-xl font-bold text-primary">{eta}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Destination</p>
            <div className="flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-success shrink-0" />
              <p className="text-sm font-semibold text-foreground truncate">{transport.destinationFacility}</p>
            </div>
          </div>
        </div>

        {/* Current status highlight */}
        <div className="bg-secondary text-secondary-foreground rounded-2xl p-5 text-center">
          <p className="text-xs uppercase tracking-wider opacity-70 mb-1">Current Status</p>
          <h2 className="text-lg font-bold">{V2_MILESTONES[v2Idx]}</h2>
        </div>

        {/* 7-stage vertical timeline */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Transport Progress</h3>
          <p className="text-xs text-muted-foreground mb-5">Updates provided as information becomes available.</p>

          <div className="space-y-0">
            {V2_MILESTONES.map((label, i) => {
              const isCompleted = i < v2Idx || complete;
              const isActive = i === v2Idx && !complete;
              const isPending = i > v2Idx && !complete;

              return (
                <div key={i} className="flex gap-3 relative">
                  {/* Line + dot */}
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold z-10 ${
                      isCompleted ? 'bg-success text-success-foreground' :
                      isActive ? 'bg-primary text-primary-foreground shadow-[0_0_0_4px_hsl(22_90%_54%/0.2)]' :
                      'bg-muted text-muted-foreground border-2 border-border'
                    }`}>
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    {i < V2_MILESTONES.length - 1 && (
                      <div className={`w-0.5 h-6 ${isCompleted ? 'bg-success/40' : 'bg-border'}`} />
                    )}
                  </div>
                  {/* Label */}
                  <div className="pt-1 pb-3">
                    <p className={`text-sm font-medium leading-tight ${
                      isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent updates */}
        {transport.notifications.length > 0 && (
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Recent Updates</h3>
            <div className="space-y-3">
              {transport.notifications.map((n) => (
                <div key={n.id} className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <p className="text-sm text-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(n.timestamp).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-muted-foreground text-center pb-4">
          Status updates are provided as soon as information becomes available. Timing may change due to care or operational needs.
        </p>
      </main>
    </div>
  );
}
