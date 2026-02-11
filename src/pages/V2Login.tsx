import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getTransportByRef } from '@/data/mockTransports';
import orngeLogo from '@/assets/ornge-logo.png';

export default function V2Login() {
  const navigate = useNavigate();
  const [refNumber, setRefNumber] = useState('ORN-2025-4821');
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
      const transport = getTransportByRef(refNumber);
      if (transport) {
        navigate(`/v2/track/${transport.id}`);
      } else {
        setError('Transport not found. Please check your reference number.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center mb-8">
          <motion.img
            src={orngeLogo}
            alt="Ornge"
            className="h-14 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          />
          <h1 className="text-2xl font-bold text-center text-foreground">
            Family Transport Tracking
          </h1>
          <p className="mt-2 text-sm text-muted-foreground text-center">
            Version 2 — Card-Based Light Theme
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg p-6 border border-border">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Secure & Encrypted</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="v2-ref" className="text-sm font-medium">
                Transport Reference ID
              </Label>
              <Input
                id="v2-ref"
                placeholder="e.g. ORN-2025-4821"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                className="h-12 rounded-lg"
                maxLength={30}
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button type="submit" className="w-full h-12 text-base font-semibold rounded-lg" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
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
          to="/versions"
          className="flex items-center justify-center gap-1.5 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Version Selection
        </Link>
      </motion.div>
    </div>
  );
}
