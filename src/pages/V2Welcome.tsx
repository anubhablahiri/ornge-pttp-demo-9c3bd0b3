import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Activity, ArrowLeft } from 'lucide-react';
import orngeLogo from '@/assets/ornge-logo.png';

export default function V2Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <motion.div
        className="w-full max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src={orngeLogo}
          alt="Ornge"
          className="h-14 mx-auto mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        />
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Family Transport Tracking
        </h1>
        <p className="text-sm text-muted-foreground mb-2">Version 2 — Manual data posting of transport data from OCC with minimum real-time data from Flight Vector.</p>
        <p className="text-sm text-muted-foreground mb-10">
          Choose how you'd like to access the system
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-sm mx-auto">
          <motion.button
            onClick={() => navigate('/v2/platform')}
            className="group bg-card rounded-2xl border-2 border-border hover:border-primary shadow-sm hover:shadow-md p-8 flex flex-col items-center gap-4 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
              <Users className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-base font-bold text-foreground">Patient Tracking</span>
            <span className="text-xs text-muted-foreground text-center">Track your loved one's transport</span>
          </motion.button>

          <motion.button
            onClick={() => navigate('/v2/admin-login')}
            className="group bg-card rounded-2xl border-2 border-border hover:border-secondary shadow-sm hover:shadow-md p-8 flex flex-col items-center gap-4 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
              <Activity className="h-7 w-7 text-secondary-foreground" />
            </div>
            <span className="text-base font-bold text-foreground">Operations Dashboard</span>
            <span className="text-xs text-muted-foreground text-center">Admin operations portal</span>
          </motion.button>
        </div>

        <Link
          to="/versions"
          className="flex items-center justify-center gap-1.5 mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Version Selection
        </Link>
      </motion.div>
    </div>
  );
}
