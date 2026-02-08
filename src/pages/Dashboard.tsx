import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { mockTransports, Transport } from '@/data/mockTransports';
import orngeLogo from '@/assets/ornge-logo.png';
import TransportHeader from '@/components/transport/TransportHeader';
import StatusTimeline from '@/components/transport/StatusTimeline';
import LiveMap from '@/components/transport/LiveMap';
import TrackingMap from '@/components/transport/TrackingMap';
import ETADisplay from '@/components/transport/ETADisplay';
import TransportDetails from '@/components/transport/TransportDetails';
import NotificationFeed from '@/components/transport/NotificationFeed';
import FamilySupport from '@/components/transport/FamilySupport';
import AdminToggle from '@/components/transport/AdminToggle';
import LanguageToggle from '@/components/LanguageToggle';
import { useApp } from '@/lib/i18n';

export default function Dashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, setDeviceFormat } = useApp();

  // Derive device format from URL prefix
  const urlFormat = location.pathname.startsWith('/desktop/') ? 'desktop'
    : location.pathname.startsWith('/tablet/') ? 'tablet'
    : 'mobile';
  const deviceFormat = urlFormat;

  // Sync context so child components can use it
  useEffect(() => {
    setDeviceFormat(urlFormat);
  }, [urlFormat, setDeviceFormat]);
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

  const isTablet = deviceFormat === 'tablet';
  const isDesktop = deviceFormat === 'desktop';
  const isRealDesktop = isDesktop && window.innerWidth >= 1024;
  const maxW = isRealDesktop ? 'max-w-[95vw]' : isDesktop ? 'max-w-6xl' : isTablet ? 'max-w-3xl' : 'max-w-lg';

  const anim = (delay: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.3 },
  });

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className={`${maxW} mx-auto flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <Link to={deviceFormat === 'mobile' ? '/login' : '/platform'} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Link>
            <img src={orngeLogo} alt="Ornge" className="h-7" />
            <span className="text-sm md:text-base font-display font-semibold text-foreground hidden sm:inline">
              {t('dash.headerTitle')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
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
        </div>
      </header>

      {/* Main content */}
      <main className={`${maxW} mx-auto px-4 pt-4`}>
        {(isDesktop || isTablet) ? (
          /* Multi-column layout for tablet/desktop */
          isDesktop ? (
            <div className="space-y-4">
              {/* Top row: Header + ETA — same column ratio as below */}
              <div className="grid gap-4" style={{ gridTemplateColumns: '2fr 1fr' }}>
                <motion.div {...anim(0)}><TransportHeader transport={transport} /></motion.div>
                <motion.div {...anim(0.05)} className="flex"><ETADisplay transport={transport} className="flex-1" /></motion.div>
              </div>

              {/* Main content: narrow left, wide right */}
              <div className="grid gap-4" style={{ gridTemplateColumns: '2fr 5fr' }}>
                {/* Left column: Support, Updates, Details, Admin */}
                <div className="space-y-4">
                  <motion.div {...anim(0.1)}><FamilySupport /></motion.div>
                  <motion.div {...anim(0.15)}><NotificationFeed transport={transport} /></motion.div>
                  <motion.div {...anim(0.2)}><TransportDetails transport={transport} /></motion.div>
                  <motion.div {...anim(0.25)}><AdminToggle transport={transport} onUpdate={setTransport} /></motion.div>
                </div>

                {/* Right column: Live Tracking + Transport Progress */}
                <div className="space-y-4">
                  <motion.div {...anim(0.1)}><TrackingMap transport={transport} /></motion.div>
                  <motion.div {...anim(0.15)}><LiveMap transport={transport} /></motion.div>
                  <motion.div {...anim(0.2)}><StatusTimeline transport={transport} horizontal /></motion.div>
                </div>
              </div>
            </div>
          ) : (
            /* Tablet layout */
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <motion.div {...anim(0)}><TransportHeader transport={transport} /></motion.div>
                <motion.div {...anim(0.1)}><ETADisplay transport={transport} /></motion.div>
                <motion.div {...anim(0.2)}><StatusTimeline transport={transport} /></motion.div>
              </div>
              <div className="space-y-4">
                <motion.div {...anim(0.12)}><TrackingMap transport={transport} /></motion.div>
                <motion.div {...anim(0.15)}><LiveMap transport={transport} /></motion.div>
                <motion.div {...anim(0.25)}><NotificationFeed transport={transport} /></motion.div>
                <motion.div {...anim(0.3)}><TransportDetails transport={transport} /></motion.div>
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <motion.div {...anim(0.35)}><FamilySupport /></motion.div>
                <motion.div {...anim(0.4)}><AdminToggle transport={transport} onUpdate={setTransport} /></motion.div>
              </div>
            </div>
          )
        ) : (
          /* Mobile layout (original) */
          <div className="space-y-4">
            <motion.div {...anim(0)}><TransportHeader transport={transport} /></motion.div>
            <motion.div {...anim(0.1)}><ETADisplay transport={transport} /></motion.div>
            <motion.div {...anim(0.15)}><TrackingMap transport={transport} /></motion.div>
            <motion.div {...anim(0.18)}><LiveMap transport={transport} /></motion.div>
            <motion.div {...anim(0.2)}><StatusTimeline transport={transport} /></motion.div>
            <motion.div {...anim(0.25)}><NotificationFeed transport={transport} /></motion.div>
            <motion.div {...anim(0.3)}><TransportDetails transport={transport} /></motion.div>
            <motion.div {...anim(0.35)}><FamilySupport /></motion.div>
            <motion.div {...anim(0.4)}><AdminToggle transport={transport} onUpdate={setTransport} /></motion.div>
          </div>
        )}

        <p className="text-[11px] text-muted-foreground/60 text-center pt-4 pb-4">
          {t('dash.privacy')}
        </p>
      </main>
    </div>
  );
}
