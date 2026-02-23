import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, LayoutGrid, Globe, Rocket, ArrowRight, LogOut, BarChart3 } from 'lucide-react';

export default function VersionSelector() {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('gate_authenticated') !== 'true') {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const versions = [
    {
      id: 'v1',
      label: 'Version 1',
      subtitle: 'Manual Data Tracker',
      description: 'Manual data posting of transport data from PTAC and OCC. No real-time data.',
      features: [
        'Horizontal status timeline',
        'OCC-posted transport updates',
        'QR code sharing',
        'Special message box',
      ],
      icon: Layers,
      path: '/v1',
      accent: 'hsl(224, 70%, 35%)',
    },
    {
      id: 'v2',
      label: 'Version 2',
      subtitle: 'Manual Data Tracker with Partial Automation',
      description: 'Manual data posting of transport data from PTAC and OCC with minimum real-time data from Flight Vector.',
      features: [
        'Vertical status timeline',
        'Partial Flight Vector integration',
        'Notification feed',
        'Monitoring dashboard',
      ],
      icon: LayoutGrid,
      path: '/v2',
      accent: 'hsl(22, 90%, 54%)',
    },
    {
      id: 'v3',
      label: 'Version 3',
      subtitle: 'Real-Time Platform',
      description: 'Automated real-time data from PTAC, OCC, and Flight Vector.',
      features: [
        'Live map tracking',
        'Full OCC & Flight Vector integration',
        'Multi-portal selection',
        'Device-framed previews',
      ],
      icon: Globe,
      path: '/v3',
      accent: 'hsl(224, 70%, 35%)',
      iconColor: 'hsl(22, 90%, 54%)',
    },
    {
      id: 'v4',
      label: 'Version 4',
      subtitle: 'TBD',
      description: 'To be determined.',
      features: [
        'TBD',
      ],
      icon: Rocket,
      path: '',
      accent: 'hsl(0, 0%, 60%)',
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 relative">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Patient Transport Tracking Portal (PTTP) Prototype Versions
        </h1>
        <p className="mt-3 text-muted-foreground text-sm md:text-base max-w-md mx-auto">
          Select a version to explore different iterations of the Patient Transport Tracking.
        </p>
      </motion.div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl w-full items-stretch">
        {versions.map((v, i) => (
          <motion.button
            key={v.id}
            onClick={() => !v.disabled && navigate(v.path)}
            disabled={v.disabled}
            className={`group bg-card rounded-2xl border-2 shadow-sm p-8 flex flex-col items-center gap-4 transition-all text-left h-full ${
              v.disabled
                ? 'border-border opacity-60 cursor-not-allowed'
                : 'border-border hover:border-primary hover:shadow-lg'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i, duration: 0.4 }}
            whileHover={v.disabled ? {} : { scale: 1.03 }}
            whileTap={v.disabled ? {} : { scale: 0.98 }}
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center transition-colors"
              style={{ backgroundColor: v.accent }}
            >
              <v.icon className="h-7 w-7" style={{ color: v.iconColor || 'white' }} />
            </div>
            <div className="text-center">
              <span className="text-lg font-bold text-foreground block">{v.label}</span>
              <span className={`text-xs font-medium ${v.disabled ? 'text-muted-foreground' : 'text-primary'}`}>{v.subtitle}</span>
            </div>
            <p className="text-xs text-muted-foreground text-left leading-relaxed min-h-[3.5rem]">
              {v.description}
            </p>
            <ul className="w-full space-y-1.5 mt-1 flex-1">
              {v.features.map((f, fi) => (
                <li key={fi} className="flex items-start gap-2 text-xs text-muted-foreground text-left">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            {!v.disabled && (
              <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
                Explore <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </motion.button>
        ))}
      </div>
      <button
        onClick={() => {
          sessionStorage.removeItem('gate_authenticated');
          navigate('/', { replace: true });
        }}
        className="mt-10 flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-border hover:border-destructive text-muted-foreground hover:text-destructive font-medium transition-all"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </button>
    </div>
  );
}
