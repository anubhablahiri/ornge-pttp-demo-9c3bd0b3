import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plane, Truck, Activity, CheckCircle2, Clock, AlertTriangle, ArrowLeft,
} from 'lucide-react';

const stats = [
  { icon: Activity, label: 'Live Transports', value: '7' },
  { icon: Plane, label: 'Air Active', value: '4' },
  { icon: Truck, label: 'Land Active', value: '3' },
  { icon: CheckCircle2, label: 'Completed Today', value: '23' },
  { icon: Clock, label: 'Avg Response', value: '14 min' },
  { icon: AlertTriangle, label: 'Delays', value: '2' },
];

const recentTransports = [
  { id: 'ORN-2025-4821', patient: 'S. Mitchell', route: 'Thunder Bay → Toronto', mode: 'air', status: 'In Transit' },
  { id: 'ORN-2025-4819', patient: 'J. Chen', route: 'Brampton → Hamilton', mode: 'land', status: 'Dispatched' },
  { id: 'ORN-2025-4815', patient: 'M. Santos', route: 'Sudbury → Ottawa', mode: 'air', status: 'Completed' },
  { id: 'ORN-2025-4812', patient: 'R. Thompson', route: 'Kenora → Winnipeg', mode: 'air', status: 'Completed' },
  { id: 'ORN-2025-4808', patient: 'L. Nguyen', route: 'London → Toronto', mode: 'land', status: 'Completed' },
];

const fleet = [
  { type: 'Fixed-Wing (PC-12)', total: 10, active: 4, maint: 1 },
  { type: 'Rotor-Wing (AW139)', total: 12, active: 6, maint: 2 },
  { type: 'Land Ambulance', total: 20, active: 3, maint: 3 },
];

const anim = (delay: number) => ({
  initial: { opacity: 0, y: 12 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay, duration: 0.35 },
});

export default function V1AdminPortal() {
  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] text-[hsl(210,40%,96%)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[hsl(220,20%,11%)]/95 backdrop-blur-sm border-b border-[hsl(220,14%,20%)] px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/v1" className="p-1.5 rounded-lg hover:bg-[hsl(220,14%,18%)] transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="font-bold text-lg">Operations Dashboard</span>
            <span className="text-xs text-[hsl(215,20%,45%)]">V1</span>
          </div>
          <span className="text-xs text-[hsl(215,20%,65%)]">
            {new Date().toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stat cards */}
        <motion.div {...anim(0)} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-[hsl(220,20%,11%)] rounded-xl border border-[hsl(220,14%,20%)] p-4">
              <s.icon className="h-5 w-5 text-[hsl(22,90%,54%)] mb-2" />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-[10px] text-[hsl(215,20%,65%)] uppercase tracking-wide mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Recent Transports Table */}
        <motion.div {...anim(0.1)} className="bg-[hsl(220,20%,11%)] rounded-xl border border-[hsl(220,14%,20%)]">
          <div className="px-5 py-3 border-b border-[hsl(220,14%,20%)]">
            <h2 className="font-bold text-base">Recent Transports</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[hsl(220,14%,20%)] text-[hsl(215,20%,65%)] text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-2">ID</th>
                  <th className="text-left px-5 py-2">Patient</th>
                  <th className="text-left px-5 py-2">Route</th>
                  <th className="text-left px-5 py-2">Mode</th>
                  <th className="text-left px-5 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransports.map((t) => (
                  <tr key={t.id} className="border-b border-[hsl(220,14%,20%)]/50 hover:bg-[hsl(220,20%,14%)] transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-[hsl(215,20%,65%)]">{t.id}</td>
                    <td className="px-5 py-3 font-medium">{t.patient}</td>
                    <td className="px-5 py-3 text-[hsl(215,20%,65%)]">{t.route}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        t.mode === 'air' ? 'bg-[hsl(22,90%,54%)]/20 text-[hsl(22,90%,54%)]' : 'bg-[hsl(210,100%,52%)]/20 text-[hsl(210,100%,52%)]'
                      }`}>
                        {t.mode === 'air' ? '✈ Air' : '🚑 Land'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium ${
                        t.status === 'In Transit' ? 'text-[hsl(22,90%,54%)]' :
                        t.status === 'Dispatched' ? 'text-[hsl(45,93%,47%)]' :
                        'text-[hsl(142,72%,47%)]'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Fleet Status */}
        <motion.div {...anim(0.15)} className="bg-[hsl(220,20%,11%)] rounded-xl border border-[hsl(220,14%,20%)] p-5">
          <h2 className="font-bold text-base mb-4">Fleet Status</h2>
          <div className="space-y-4">
            {fleet.map((f) => {
              const available = f.total - f.active - f.maint;
              const pct = (f.active / f.total) * 100;
              return (
                <div key={f.type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{f.type}</span>
                    <span className="text-[hsl(215,20%,65%)]">{f.active}/{f.total} active</span>
                  </div>
                  <div className="h-2 bg-[hsl(220,20%,14%)] rounded-full overflow-hidden">
                    <div className="h-full bg-[hsl(22,90%,54%)] rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex gap-4 text-xs text-[hsl(215,20%,65%)] mt-1">
                    <span><span className="text-[hsl(22,90%,54%)] font-semibold">{f.active}</span> Active</span>
                    <span><span className="text-[hsl(142,72%,47%)] font-semibold">{available}</span> Available</span>
                    <span><span className="text-[hsl(45,93%,47%)] font-semibold">{f.maint}</span> Maintenance</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
