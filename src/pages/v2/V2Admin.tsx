import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Plane, Truck, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import orngeLogo from '@/assets/ornge-logo.png';
import { mockTransports, getCurrentStatusIndex, isTransportComplete } from '@/data/mockTransports';

const stats = [
  { icon: Activity, label: 'Active', value: '7', color: 'text-primary' },
  { icon: Plane, label: 'Air', value: '4', color: 'text-primary' },
  { icon: Truck, label: 'Land', value: '3', color: 'text-primary' },
  { icon: CheckCircle2, label: 'Completed', value: '23', color: 'text-success' },
  { icon: Clock, label: 'Avg Response', value: '14m', color: 'text-warning' },
  { icon: AlertTriangle, label: 'Delays', value: '2', color: 'text-destructive' },
];

export default function V2Admin() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="py-4 px-6 flex items-center justify-between border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <img src={orngeLogo} alt="Ornge" className="h-8" />
          <span className="font-display font-bold text-sm">Operations</span>
        </div>
        <button
          onClick={() => navigate('/v2')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-6 space-y-6">
        {/* Stats grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-card rounded-xl border border-border p-3 text-center">
              <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
              <p className="text-lg font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Active transports table */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-display font-bold text-foreground">Active Transports</h2>
          </div>
          <div className="divide-y divide-border">
            {mockTransports.map((t) => {
              const idx = getCurrentStatusIndex(t);
              const complete = isTransportComplete(t);
              return (
                <div key={t.id} className="px-5 py-4 flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.mode === 'air' ? 'bg-primary/10' : 'bg-secondary/10'}`}>
                    {t.mode === 'air' ? <Plane className="w-4 h-4 text-primary" /> : <Truck className="w-4 h-4 text-secondary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{t.referenceId}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {t.originFacility} → {t.destinationFacility}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    complete ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                  }`}>
                    {complete ? 'Completed' : t.statuses[idx]?.label || 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
