import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import orngeLogo from '@/assets/ornge-logo.png';
import { ArrowLeft, Search } from 'lucide-react';

export default function V2Family() {
  const [trackingNumber, setTrackingNumber] = useState('ORN-2025-4821');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      navigate(`/v2/status/${trackingNumber.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="py-5 px-6 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <img src={orngeLogo} alt="Ornge" className="h-9" />
        </div>
        <button
          onClick={() => navigate('/v2')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold font-display text-center mb-2">
            Family Portal
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Enter the tracking number provided by the healthcare facility.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Tracking Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. ORN-2025-XXXX"
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 pr-10 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-colors"
            >
              View Transport Status
            </button>
          </form>

          <div className="mt-8 p-4 rounded-xl bg-accent/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              <strong className="text-foreground">Demo:</strong> Try <span className="font-mono text-primary">ORN-2025-4821</span> for an active air transport or <span className="font-mono text-primary">ORN-2025-4819</span> for a land transport.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
