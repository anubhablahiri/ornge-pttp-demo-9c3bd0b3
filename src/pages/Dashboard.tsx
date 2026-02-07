import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { mockTransports, Transport } from '@/data/mockTransports';
import orngeLogo from '@/assets/ornge-logo.png';
import TransportHeader from '@/components/transport/TransportHeader';
import StatusTimeline from '@/components/transport/StatusTimeline';
import LiveMap from '@/components/transport/LiveMap';
import ETADisplay from '@/components/transport/ETADisplay';
import TransportDetails from '@/components/transport/TransportDetails';
import NotificationFeed from '@/components/transport/NotificationFeed';
import FamilySupport from '@/components/transport/FamilySupport';
import AdminToggle from '@/components/transport/AdminToggle';

export default function Dashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transport, setTransport] = useState<Transport | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const found = mockTransports.find((t) => t.id === id);
    if (found) {
      setTransport({ ...found });
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  const handleRefresh = () => {
    setLastRefresh(new Date());
  };

  if (!transport) return null;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-1.5 rounded-lg hover:bg-accent transition-colors">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Link>
            <img src={orngeLogo} alt="Ornge" className="h-7" />
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TransportHeader transport={transport} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <ETADisplay transport={transport} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <LiveMap transport={transport} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <StatusTimeline transport={transport} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
        >
          <NotificationFeed transport={transport} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <TransportDetails transport={transport} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
        >
          <FamilySupport />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <AdminToggle transport={transport} onUpdate={setTransport} />
        </motion.div>

        {/* Privacy footer */}
        <p className="text-[11px] text-muted-foreground/60 text-center pt-2 pb-4">
          Information is limited for privacy. No medical records or diagnosis shown.
        </p>
      </main>
    </div>
  );
}
