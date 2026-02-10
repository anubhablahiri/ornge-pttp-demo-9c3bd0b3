import { useNavigate } from 'react-router-dom';
import orngeLogo from '@/assets/ornge-logo.png';
import { Plane, Shield, ArrowLeft } from 'lucide-react';

export default function V2Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="py-5 px-6 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <img src={orngeLogo} alt="Ornge" className="h-9" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">v2</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Versions
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-4">
          <Plane className="w-5 h-5 text-secondary-foreground" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold font-display text-center mb-2">
          Family Transport Tracking
        </h1>
        <p className="text-muted-foreground text-center mb-10 max-w-md">
          Stay informed about your loved one's patient transport in real time.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg w-full">
          <button
            onClick={() => navigate('/v2/family')}
            className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-border bg-card hover:border-primary hover:shadow-lg transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Plane className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="font-bold text-foreground">Family Portal</h2>
              <p className="text-xs text-muted-foreground mt-1">Track a patient transport</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/v2/admin')}
            className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-border bg-card hover:border-secondary hover:shadow-lg transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
              <Shield className="w-6 h-6 text-secondary" />
            </div>
            <div className="text-center">
              <h2 className="font-bold text-foreground">Admin Portal</h2>
              <p className="text-xs text-muted-foreground mt-1">Operations management</p>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}
