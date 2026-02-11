import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Tablet, Monitor, ArrowRight } from 'lucide-react';

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
      subtitle: 'Basic Dark Theme',
      description: 'Minimal dark UI with horizontal timeline, special message box, and QR sharing.',
      icon: Smartphone,
      path: '/v1',
      accent: 'hsl(224, 70%, 35%)',
    },
    {
      id: 'v2',
      label: 'Version 2',
      subtitle: 'Card-Based Light',
      description: 'Clean light theme with vertical timeline, notification feed, and monitoring dashboard.',
      icon: Tablet,
      path: '/v2',
      accent: 'hsl(22, 90%, 54%)',
    },
    {
      id: 'v3',
      label: 'Version 3',
      subtitle: 'Full Interactive Platform',
      description: 'Complete experience with live maps, device frames, and multi-portal selection.',
      icon: Monitor,
      path: '/v3',
      accent: 'hsl(224, 70%, 35%)',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          FTTP Prototype Versions
        </h1>
        <p className="mt-3 text-muted-foreground text-sm md:text-base max-w-md mx-auto">
          Select a version to explore different iterations of the Family Transport Tracking Portal.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full">
        {versions.map((v, i) => (
          <motion.button
            key={v.id}
            onClick={() => navigate(v.path)}
            className="group bg-card rounded-2xl border-2 border-border hover:border-primary shadow-sm hover:shadow-lg p-8 flex flex-col items-center gap-4 transition-all text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i, duration: 0.4 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center transition-colors"
              style={{ backgroundColor: v.accent }}
            >
              <v.icon className="h-7 w-7 text-white" />
            </div>
            <div className="text-center">
              <span className="text-lg font-bold text-foreground block">{v.label}</span>
              <span className="text-xs font-medium text-primary">{v.subtitle}</span>
            </div>
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              {v.description}
            </p>
            <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Explore <ArrowRight className="h-4 w-4" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
