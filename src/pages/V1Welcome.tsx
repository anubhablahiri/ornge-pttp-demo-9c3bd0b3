import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Activity, ArrowLeft } from 'lucide-react';

export default function V1Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[hsl(220,20%,8%)] px-4">
      <motion.div
        className="w-full max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-[hsl(210,40%,96%)] mb-2">
          Patient Transport Tracker
        </h1>
        <p className="text-sm text-[hsl(215,20%,65%)] mb-2">Version 1 — Basic Dark Theme</p>
        <p className="text-sm text-[hsl(215,20%,55%)] mb-10">
          Choose how you'd like to access the system
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-sm mx-auto">
          <motion.button
            onClick={() => navigate('/v1/login')}
            className="group bg-[hsl(220,20%,11%)] rounded-xl border-2 border-[hsl(220,14%,20%)] hover:border-[hsl(22,90%,54%)] p-8 flex flex-col items-center gap-4 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-14 h-14 rounded-full bg-[hsl(22,90%,54%)] flex items-center justify-center">
              <Users className="h-7 w-7 text-white" />
            </div>
            <span className="text-base font-bold text-[hsl(210,40%,96%)]">Patient Tracking</span>
            <span className="text-xs text-[hsl(215,20%,65%)] text-center">Track your loved one's transport</span>
          </motion.button>

          <motion.button
            onClick={() => navigate('/v1/admin-login')}
            className="group bg-[hsl(220,20%,11%)] rounded-xl border-2 border-[hsl(220,14%,20%)] hover:border-[hsl(210,100%,52%)] p-8 flex flex-col items-center gap-4 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-14 h-14 rounded-full bg-[hsl(210,100%,52%)] flex items-center justify-center">
              <Activity className="h-7 w-7 text-white" />
            </div>
            <span className="text-base font-bold text-[hsl(210,40%,96%)]">Operations Dashboard</span>
            <span className="text-xs text-[hsl(215,20%,65%)] text-center">Admin operations portal</span>
          </motion.button>
        </div>

        <Link
          to="/versions"
          className="flex items-center justify-center gap-1.5 mt-8 text-sm text-[hsl(215,20%,65%)] hover:text-[hsl(210,40%,96%)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Version Selection
        </Link>
      </motion.div>
    </div>
  );
}
