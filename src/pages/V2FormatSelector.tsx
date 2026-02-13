import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import orngeLogo from '@/assets/ornge-logo.png';
import deviceIphone from '@/assets/device-iphone.png';
import deviceIpad from '@/assets/device-ipad.png';
import deviceLaptop from '@/assets/device-laptop.png';
import { useApp, DeviceFormat } from '@/lib/i18n';

const formats: { id: DeviceFormat; image: string; label: string; desc: string }[] = [
  { id: 'mobile', image: deviceIphone, label: 'Mobile', desc: 'Optimized for smartphones' },
  { id: 'tablet', image: deviceIpad, label: 'Tablet', desc: 'Enhanced layout for tablets' },
  { id: 'desktop', image: deviceLaptop, label: 'Desktop', desc: 'Full dashboard experience' },
];

export default function V2FormatSelector() {
  const navigate = useNavigate();
  const { setDeviceFormat } = useApp();

  const handleSelect = (format: DeviceFormat) => {
    setDeviceFormat(format);
    navigate('/v2/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="px-6 pt-10 pb-14 flex flex-col items-center text-foreground">
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
          Patient Transport Tracking (V2)
        </motion.h1>
        <motion.p
          className="mt-3 text-lg md:text-xl font-display font-semibold text-primary text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          Choose Platform
        </motion.p>
        <motion.p
          className="mt-2 text-sm text-primary text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Manual data posting of transport data from OCC with minimum real-time data from Flight Vector.
        </motion.p>
        <motion.p
          className="mt-2 text-sm text-muted-foreground text-center max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Choose a device view for the demo experience
        </motion.p>
      </div>

      <div className="mx-4 md:mx-auto md:max-w-3xl flex-1">
        <div className="flex flex-col sm:flex-row items-end justify-center gap-6 sm:gap-8">
          {formats.map((f, i) => (
            <motion.button
              key={f.id}
              onClick={() => handleSelect(f.id)}
              className={`flex flex-col items-center gap-3 transition-all group ${f.id === 'desktop' ? 'sm:flex-[1.4]' : 'sm:flex-1'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="h-52 flex items-end justify-center">
                <img
                  src={f.image}
                  alt={f.label}
                  className={`${f.id === 'desktop' ? 'h-52' : f.id === 'mobile' ? 'h-40' : 'h-48'} w-auto object-contain drop-shadow-lg group-hover:drop-shadow-2xl transition-all`}
                  draggable={false}
                />
              </div>
              <span className="text-base font-display font-bold text-foreground">{f.label}</span>
              <span className="text-xs text-muted-foreground text-center">{f.desc}</span>
            </motion.button>
          ))}
        </div>
        <button onClick={() => navigate('/v2')} className="flex items-center justify-center gap-1.5 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors w-full">
          <span>← Back to Portal Selection</span>
        </button>
      </div>
    </div>
  );
}
