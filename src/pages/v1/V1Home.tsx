import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function V1Home() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      navigate(`/v1/status/${trackingNumber.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-[hsl(220,20%,11%)] border border-[hsl(220,14%,20%)] rounded-2xl p-8 md:p-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Family Portal<span className="text-[hsl(22,90%,54%)]">.</span>
          </h1>
          <button
            onClick={() => navigate('/v1/admin')}
            className="text-sm text-[hsl(212,80%,60%)] hover:text-[hsl(212,80%,70%)] font-medium transition-colors"
          >
            Admin
          </button>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h2 className="text-lg text-white font-medium mb-2">Check a transport</h2>
          <p className="text-sm text-[hsl(215,20%,65%)]">
            Enter the tracking number provided by the facility.
          </p>
          <button
            onClick={() => navigate('/v1/faq')}
            className="mt-3 text-sm text-[hsl(212,80%,60%)] hover:text-[hsl(212,80%,70%)] font-medium transition-colors"
          >
            FAQ
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm text-[hsl(215,20%,65%)] font-medium">
            Tracking #
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g., 1234567891234567"
              className="flex-1 bg-[hsl(220,20%,14%)] border border-[hsl(220,14%,20%)] rounded-lg px-4 py-3 text-white placeholder:text-[hsl(215,20%,40%)] focus:outline-none focus:border-[hsl(22,90%,54%)] transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[hsl(22,90%,54%)] hover:bg-[hsl(22,90%,48%)] text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              View status
            </button>
          </div>
        </form>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-[hsl(215,20%,50%)] leading-relaxed">
          Status updates are provided as soon as information becomes available. Timing may change due to care or operational needs.
        </p>
      </div>
    </div>
  );
}
