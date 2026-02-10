import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function V1Family() {
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
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-white">
            Family Portal<span className="text-[hsl(22,90%,54%)]">.</span>
          </h1>
          <button
            onClick={() => navigate('/v1')}
            className="text-sm text-[hsl(215,20%,65%)] hover:text-white transition-colors"
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm text-[hsl(215,20%,65%)]">Tracking #</label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number"
            className="w-full bg-[hsl(220,20%,14%)] border border-[hsl(220,14%,20%)] rounded-lg px-4 py-3 text-white placeholder:text-[hsl(215,20%,40%)] focus:outline-none focus:border-[hsl(22,90%,54%)]"
          />
          <button
            type="submit"
            className="w-full py-3 bg-[hsl(22,90%,54%)] hover:bg-[hsl(22,90%,48%)] text-white font-semibold rounded-lg transition-colors"
          >
            View Status
          </button>
        </form>

        <p className="mt-6 text-xs text-[hsl(215,20%,50%)] text-center">
          Enter the tracking number provided by the facility.
        </p>
      </div>
    </div>
  );
}
