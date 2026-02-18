import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Truck, Activity, Users, ArrowLeft } from 'lucide-react';
import orngeLogo from '@/assets/ornge-logo.png';
import orngeLogoWhite from '@/assets/ornge-logo-white.png';
import heroBanner from '@/assets/hero-banner.png';
import heroBannerMobile from '@/assets/hero-banner-mobile.png';
import { useApp } from '@/lib/i18n';
import LanguageToggle from '@/components/LanguageToggle';

type PortalChoice = null | 'family' | 'operations';

export default function Welcome() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, setDeviceFormat } = useApp();
  const [portal, setPortal] = useState<PortalChoice>(
    (location.state as any)?.portal === 'family' ? 'family' : null
  );

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    if (isTouchDevice && isSmallScreen) {
      setDeviceFormat('mobile');
    }
  }, [setDeviceFormat]);

  const isMobileDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
    window.innerWidth <= 768;

  const handleModeSelect = (mode: 'air' | 'land') => {
    sessionStorage.setItem('transportMode', mode);
    if (isMobileDevice) {
      navigate('/v3/login');
    } else {
      navigate('/v3/platform');
    }
  };

  const handlePortalSelect = (choice: PortalChoice) => {
    if (choice === 'operations') {
      navigate('/v3/admin-login');
    } else {
      setPortal(choice);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a1628]">
      {/* Hero section */}
      <div className="relative w-full overflow-hidden sm:min-h-[40vh]">
        <img
          src={heroBanner}
          alt="Ornge helicopter over Toronto"
          className="absolute inset-0 w-full h-full object-cover hidden sm:block"
          draggable={false}
        />
        <div className="sm:hidden w-full overflow-hidden" style={{ maxHeight: '105vw' }}>
          <img
            src={heroBannerMobile}
            alt="Ornge helicopter over Toronto"
            className="w-full"
            draggable={false}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0a1628]" />

        <div className="absolute top-0 left-0 right-0 z-10 sm:hidden bg-white px-5 py-3 flex items-center justify-between">
          <img src={orngeLogo} alt="Ornge" className="h-9" />
          <LanguageToggle />
        </div>
        <div className="absolute top-0 left-0 right-0 z-10 hidden sm:flex items-center justify-between px-6 py-5">
          <img src={orngeLogoWhite} alt="Ornge" className="h-10" />
          <LanguageToggle />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-background rounded-t-3xl -mt-6 relative z-10 px-6 pt-8 pb-12">
        <motion.div
          className="max-w-2xl mx-auto text-center mb-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-4xl font-display font-bold text-foreground leading-tight">
            {t('welcome.heroTitle')}
          </h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            {t('welcome.heroSubtitle')}
          </p>
        </motion.div>

        {/* Portal selection (step 1) */}
        {portal === null && (
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-xl md:text-2xl font-display font-bold text-foreground text-center mb-2">
              Select Portal
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-8">
              Choose how you'd like to access the system
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg mx-auto">
              <motion.button
                onClick={() => handlePortalSelect('family')}
                className="group relative bg-card rounded-2xl border-2 border-border hover:border-primary shadow-sm hover:shadow-md p-8 flex flex-col items-center gap-4 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <span className="text-lg font-display font-bold text-foreground">Patient Transport Tracking</span>
                <span className="text-xs text-muted-foreground text-center">Track your loved one's transport journey in real-time</span>
              </motion.button>

              <motion.button
                onClick={() => handlePortalSelect('operations')}
                className="group relative bg-card rounded-2xl border-2 border-border hover:border-secondary shadow-md hover:shadow-xl p-8 flex flex-col items-center gap-4 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center group-hover:bg-secondary/90 transition-colors">
                  <Activity className="h-8 w-8 text-secondary-foreground" />
                </div>
                <span className="text-lg font-display font-bold text-foreground">Operations Administration</span>
                <span className="text-xs text-muted-foreground text-center">Admin portal for transport operations management</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Transport mode selection (step 2 — family only) */}
        {portal === 'family' && (
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={() => setPortal(null)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <h2 className="text-xl md:text-2xl font-display font-bold text-foreground text-center mb-2">
              {t('welcome.modeTitle')}
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-8">
              {t('welcome.modeSubtitle')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg mx-auto">
              <motion.button
                onClick={() => handleModeSelect('air')}
                className="group relative bg-card rounded-2xl border-2 border-border hover:border-secondary shadow-sm hover:shadow-md p-8 flex flex-col items-center gap-4 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center group-hover:bg-secondary/90 transition-colors">
                  <Plane className="h-8 w-8 text-secondary-foreground" />
                </div>
                <span className="text-lg font-display font-bold text-foreground">{t('welcome.air')}</span>
                <span className="text-xs text-muted-foreground text-center">{t('welcome.airDesc')}</span>
              </motion.button>

              <motion.button
                onClick={() => handleModeSelect('land')}
                className="group relative bg-card rounded-2xl border-2 border-border hover:border-secondary shadow-sm hover:shadow-md p-8 flex flex-col items-center gap-4 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center group-hover:bg-secondary/90 transition-colors">
                  <Truck className="h-8 w-8 text-secondary-foreground" />
                </div>
                <span className="text-lg font-display font-bold text-foreground">{t('welcome.land')}</span>
                <span className="text-xs text-muted-foreground text-center">{t('welcome.landDesc')}</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        <Link
          to="/versions"
          className="flex items-center justify-center gap-1.5 mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Version Selection
        </Link>

        <p className="text-[11px] text-muted-foreground/50 text-center mt-4">
          © {new Date().getFullYear()} Ornge. {t('welcome.footer')}
        </p>
      </div>
    </div>
  );
}
