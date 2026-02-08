import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plane, Truck } from 'lucide-react';
import orngeLogo from '@/assets/ornge-logo-white.png';
import heroBanner from '@/assets/hero-banner.png';
import { useApp } from '@/lib/i18n';
import LanguageToggle from '@/components/LanguageToggle';

export default function Welcome() {
  const navigate = useNavigate();
  const { t, setDeviceFormat } = useApp();

  // Auto-redirect actual mobile devices — skip platform selection
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
    // Store mode in sessionStorage for use in the dashboard
    sessionStorage.setItem('transportMode', mode);

    if (isMobileDevice) {
      // Mobile: skip platform, go straight to login
      navigate('/login');
    } else {
      // Desktop: go to platform selection
      navigate('/platform');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a1628]">
      {/* Hero section */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: '50vh' }}>
        <img
          src={heroBanner}
          alt="Ornge helicopter over Toronto"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0a1628]" />

        {/* Header bar */}
        <div className="relative z-10 flex items-center justify-between px-6 py-5">
          <img src={orngeLogo} alt="Ornge" className="h-10" />
          <LanguageToggle />
        </div>

        {/* Hero text */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-8 pb-16 text-center">
          <motion.h1
            className="text-3xl md:text-5xl font-display font-bold text-white leading-tight max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('welcome.heroTitle')}
          </motion.h1>
          <motion.p
            className="mt-4 text-base md:text-lg text-white/80 max-w-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {t('welcome.heroSubtitle')}
          </motion.p>
        </div>
      </div>

      {/* Mode selection */}
      <div className="flex-1 bg-background rounded-t-3xl -mt-6 relative z-10 px-6 pt-10 pb-12">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-xl md:text-2xl font-display font-bold text-foreground text-center mb-2">
            {t('welcome.modeTitle')}
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8">
            {t('welcome.modeSubtitle')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg mx-auto">
            {/* Air Transport */}
            <motion.button
              onClick={() => handleModeSelect('air')}
              className="group relative bg-card rounded-2xl border-2 border-border hover:border-primary shadow-md hover:shadow-xl p-8 flex flex-col items-center gap-4 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Plane className="h-8 w-8 text-primary" />
              </div>
              <span className="text-lg font-display font-bold text-foreground">{t('welcome.air')}</span>
              <span className="text-xs text-muted-foreground text-center">{t('welcome.airDesc')}</span>
            </motion.button>

            {/* Land Transport */}
            <motion.button
              onClick={() => handleModeSelect('land')}
              className="group relative bg-card rounded-2xl border-2 border-border hover:border-primary shadow-md hover:shadow-xl p-8 flex flex-col items-center gap-4 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <span className="text-lg font-display font-bold text-foreground">{t('welcome.land')}</span>
              <span className="text-xs text-muted-foreground text-center">{t('welcome.landDesc')}</span>
            </motion.button>
          </div>
        </motion.div>

        <p className="text-[11px] text-muted-foreground/50 text-center mt-10">
          © {new Date().getFullYear()} Ornge. {t('welcome.footer')}
        </p>
      </div>
    </div>
  );
}
