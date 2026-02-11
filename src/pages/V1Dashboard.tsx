import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Share2, MessageSquare, QrCode } from 'lucide-react';
import { mockTransports, Transport, getCurrentStatusIndex } from '@/data/mockTransports';

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

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] text-[hsl(210,40%,96%)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[hsl(220,20%,11%)]/95 backdrop-blur-sm border-b border-[hsl(220,14%,20%)] px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/v1" className="p-1.5 rounded-lg hover:bg-[hsl(220,14%,18%)] transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="text-sm font-semibold">Transport Tracker</span>
          </div>
          <button
            onClick={() => setLastRefresh(new Date())}
            className="flex items-center gap-1.5 text-xs text-[hsl(215,20%,65%)] hover:text-[hsl(210,40%,96%)] transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-6 pb-8 space-y-6">
        {/* QR Code (top-centered) */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white p-3 rounded-xl">
            <QrCode className="h-20 w-20 text-[hsl(220,20%,8%)]" />
          </div>
          <p className="text-xs text-[hsl(215,20%,65%)] mt-2">Scan to share tracking</p>
        </motion.div>

        {/* Patient & Route Info */}
        <motion.div
          className="bg-[hsl(220,20%,11%)] rounded-xl p-4 border border-[hsl(220,14%,20%)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-[hsl(215,20%,65%)]">Reference</p>
              <p className="font-bold text-lg">{transport.referenceId}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-[hsl(22,90%,54%)]/20 text-[hsl(22,90%,54%)] font-medium">
              {transport.mode === 'air' ? '✈ Air' : '🚑 Land'}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-[hsl(215,20%,65%)]">From</p>
              <p className="font-medium">{transport.originFacility}</p>
            </div>
            <div>
              <p className="text-xs text-[hsl(215,20%,65%)]">To</p>
              <p className="font-medium">{transport.destinationFacility}</p>
            </div>
          </div>
          {(transport.etaDestination || transport.etaPickup) && (
            <div className="mt-3 p-2 rounded-lg bg-[hsl(210,100%,52%)]/10 border border-[hsl(210,100%,52%)]/20">
              <p className="text-xs text-[hsl(210,100%,52%)]">
                ETA: {transport.etaDestination || transport.etaPickup}
              </p>
            </div>
          )}
        </motion.div>

        {/* 5-Stage Horizontal Timeline */}
        <motion.div
          className="bg-[hsl(220,20%,11%)] rounded-xl p-4 border border-[hsl(220,14%,20%)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-semibold mb-4">Transport Progress</h3>
          <div className="flex items-center justify-between relative">
            {/* Connecting line */}
            <div className="absolute top-3 left-4 right-4 h-0.5 bg-[hsl(220,14%,20%)]" />
            <div
              className="absolute top-3 left-4 h-0.5 bg-[hsl(22,90%,54%)] transition-all duration-500"
              style={{ width: `${(v1Stage / (V1_STAGES.length - 1)) * (100 - 8)}%` }}
            />
            {V1_STAGES.map((stage, i) => (
              <div key={i} className="flex flex-col items-center z-10 relative">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                    i < v1Stage
                      ? 'bg-[hsl(22,90%,54%)] border-[hsl(22,90%,54%)] text-white'
                      : i === v1Stage
                      ? 'bg-[hsl(210,100%,52%)] border-[hsl(210,100%,52%)] text-white animate-pulse'
                      : 'bg-[hsl(220,20%,14%)] border-[hsl(220,14%,25%)] text-[hsl(215,20%,45%)]'
                  }`}
                >
                  {i < v1Stage ? '✓' : i + 1}
                </div>
                <span
                  className={`text-[10px] mt-1.5 text-center max-w-[60px] leading-tight ${
                    i <= v1Stage ? 'text-[hsl(210,40%,96%)]' : 'text-[hsl(215,20%,45%)]'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Special Message Box */}
        <motion.div
          className="bg-[hsl(220,20%,11%)] rounded-xl p-4 border border-[hsl(22,90%,54%)]/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-[hsl(22,90%,54%)]" />
            <h3 className="text-sm font-semibold text-[hsl(22,90%,54%)]">Special Message</h3>
          </div>
          <p className="text-sm text-[hsl(215,20%,65%)] leading-relaxed">
            {activeStatus?.message || 'No updates at this time. Your transport is being managed safely.'}
          </p>
          {transport.clinicalNotes && (
            <p className="text-xs text-[hsl(215,20%,50%)] mt-2 pt-2 border-t border-[hsl(220,14%,20%)]">
              {transport.clinicalNotes}
            </p>
          )}
        </motion.div>

        {/* Share button */}
        <motion.button
          onClick={() => navigator.clipboard?.writeText(shareUrl)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[hsl(220,20%,14%)] border border-[hsl(220,14%,20%)] text-sm text-[hsl(215,20%,65%)] hover:text-[hsl(210,40%,96%)] transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Share2 className="h-4 w-4" />
          Copy Tracking Link
        </motion.button>

        {/* Crew Info */}
        <motion.div
          className="bg-[hsl(220,20%,11%)] rounded-xl p-4 border border-[hsl(220,14%,20%)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className="text-sm font-semibold mb-3">Transport Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[hsl(215,20%,65%)]">Care Level</span>
              <span className="font-medium">{transport.careLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[hsl(215,20%,65%)]">Crew</span>
              <span className="font-medium text-right max-w-[60%]">{transport.crew.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[hsl(215,20%,65%)]">Vehicle</span>
              <span className="font-medium">{transport.crew.vehicleId}</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
