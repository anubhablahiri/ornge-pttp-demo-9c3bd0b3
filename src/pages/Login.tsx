import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import orngeLogoWhite from '@/assets/ornge-logo-white.png';
import { getTransportByRef, mockTransports } from '@/data/mockTransports';

export default function Login() {
  const navigate = useNavigate();
  const [refNumber, setRefNumber] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!refNumber.trim() || !lastName.trim()) {
      setError('Please enter both fields.');
      return;
    }
    setLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      const transport = getTransportByRef(refNumber, lastName);
      if (transport) {
        navigate(`/track/${transport.id}`);
      } else {
        setError('Transport not found. Please check your details and try again.');
      }
      setLoading(false);
    }, 800);
  };

  const handleDemo = () => {
    navigate(`/track/${mockTransports[0].id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero header */}
      <div className="bg-primary px-6 pt-12 pb-16 flex flex-col items-center text-primary-foreground">
        <motion.img
          src={orngeLogoWhite}
          alt="Ornge"
          className="h-16 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />
        <motion.h1
          className="text-2xl md:text-3xl font-display font-bold text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          Family Transport Tracker
        </motion.h1>
        <motion.p
          className="mt-2 text-sm opacity-90 text-center max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Stay informed about your loved one's transport journey.
        </motion.p>
      </div>

      {/* Login card */}
      <motion.div
        className="flex-1 -mt-8 mx-4 md:mx-auto md:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Secure & Private Access</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ref" className="text-sm font-medium">
                Transport Reference Number
              </Label>
              <Input
                id="ref"
                placeholder="e.g. ORN-2025-4821"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                className="h-12"
                maxLength={30}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Patient Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-12"
                maxLength={50}
              />
            </div>

            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Verifying…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Track Transport <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border">
            <Button
              variant="outline"
              className="w-full h-11"
              onClick={handleDemo}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Sample Transport
            </Button>
          </div>
        </div>

        {/* Privacy note */}
        <p className="text-xs text-muted-foreground text-center mt-5 px-4">
          Information is limited for privacy. No medical records or diagnosis information is displayed.
        </p>
      </motion.div>
    </div>
  );
}
