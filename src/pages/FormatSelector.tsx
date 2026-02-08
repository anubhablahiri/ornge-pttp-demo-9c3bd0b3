import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import orngeLogo from '@/assets/ornge-logo.png';
import deviceIphone from '@/assets/device-iphone.png';
import deviceIpad from '@/assets/device-ipad.png';
import deviceLaptop from '@/assets/device-laptop.png';
import { useApp, DeviceFormat } from '@/lib/i18n';
import LanguageToggle from '@/components/LanguageToggle';

const formats: { id: DeviceFormat; image: string; key: string; descKey: string }[] = [
  { id: 'mobile', image: deviceIphone, key: 'format.mobile', descKey: 'format.mobile.desc' },
  { id: 'tablet', image: deviceIpad, key: 'format.tablet', descKey: 'format.tablet.desc' },
  { id: 'desktop', image: deviceLaptop, key: 'format.desktop', descKey: 'format.desktop.desc' },
];

export default function FormatSelector() {
  const navigate = useNavigate();
  const { t, setDeviceFormat } = useApp();

  const handleSelect = (format: DeviceFormat) => {
    setDeviceFormat(format);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="px-6 pt-10 pb-14 flex flex-col items-center text-foreground relative">
        <div className="absolute top-4 right-4">
          <LanguageToggle />
        </div>
        <motion.img
          src={orngeLogo}
          alt="Ornge"
          className="h-14 mb-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />
        <motion.h1
          className="text-2xl md:text-4xl font-display font-bold text-center text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {t('format.welcome')}
        </motion.h1>
        <motion.p
          className="mt-3 text-lg md:text-xl font-display font-semibold text-primary text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {t('format.title')}
        </motion.p>
        <motion.p
          className="mt-2 text-sm text-muted-foreground text-center max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {t('format.subtitle')}
        </motion.p>
      </div>

      <div className="mx-4 md:mx-auto md:max-w-2xl flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {formats.map((f, i) => (
            <motion.button
              key={f.id}
              onClick={() => handleSelect(f.id)}
              className="flex flex-col items-center gap-3 transition-all group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <img
                src={f.image}
                alt={t(f.key)}
                className="h-44 w-auto object-contain drop-shadow-lg group-hover:drop-shadow-2xl transition-all"
                draggable={false}
              />
              <span className="text-base font-display font-bold text-foreground">{t(f.key)}</span>
              <span className="text-xs text-muted-foreground text-center">{t(f.descKey)}</span>
            </motion.button>
          ))}
        </div>
        <Link to="/" className="flex items-center justify-center gap-1.5 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <span>← {t('welcome.modeTitle')}</span>
        </Link>
      </div>
    </div>
  );
}
