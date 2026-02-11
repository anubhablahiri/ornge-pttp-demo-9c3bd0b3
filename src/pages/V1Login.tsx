import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getTransportByRef } from '@/data/mockTransports';

export default function V1Login() {
  const navigate = useNavigate();
  const [refNumber, setRefNumber] = useState('5725497746660201');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!refNumber.trim()) {
      setError('Please enter a Transport Reference ID.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // V1 uses a numeric-style ID; map it to the first transport for demo
      const transport = getTransportByRef(refNumber) || (refNumber === '5725497746660201' ? { id: 'T-1' } : null);
      if (transport) {
        navigate(`/v1/track/${transport.id}`);
      } else {
        setError('Transport not found. Please check your reference number.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[hsl(220,20%,8%)] px-4">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[hsl(210,40%,96%)]">
            Patient Transport Tracker
          </h1>
          <p className="mt-2 text-sm text-[hsl(215,20%,65%)]">
            Version 1 — Basic Dark Theme
          </p>
        </div>

        <div className="bg-[hsl(220,20%,11%)] rounded-xl p-6 border border-[hsl(220,14%,20%)]">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="h-4 w-4 text-[hsl(22,90%,54%)]" />
            <span className="text-xs text-[hsl(215,20%,65%)]">Secure & Encrypted</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="v1-ref" className="text-sm font-medium text-[hsl(210,40%,96%)]">
                Transport Reference ID
              </Label>
              <Input
                id="v1-ref"
                placeholder="e.g. 5725497746660201"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                className="h-12 rounded-lg bg-[hsl(220,20%,14%)] border-[hsl(220,14%,20%)] text-[hsl(210,40%,96%)] placeholder:text-[hsl(215,20%,45%)]"
                maxLength={30}
              />
            </div>
            {error && <p className="text-[hsl(0,72%,51%)] text-sm">{error}</p>}

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold rounded-lg bg-[hsl(22,90%,54%)] hover:bg-[hsl(22,90%,48%)] text-white"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Track Transport <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </div>

        <Link
          to="/v1"
          className="flex items-center justify-center gap-1.5 mt-6 text-sm text-[hsl(215,20%,65%)] hover:text-[hsl(210,40%,96%)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Portal Selection
        </Link>
      </motion.div>
    </div>
  );
}
