import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import orngeLogo from '@/assets/ornge-logo.png';
import { getTransportByRef, mockTransports } from '@/data/mockTransports';
import { useApp } from '@/lib/i18n';
import LanguageToggle from '@/components/LanguageToggle';

function getTrackPrefix(format: string) {
  if (format === 'desktop') return '/v3/desktop';
  if (format === 'tablet') return '/v3/tablet';
  return '/v3';
}

export default function Login() {
  const navigate = useNavigate();
  const { t, deviceFormat } = useApp();
  const [refNumber, setRefNumber] = useState('ORN-2025-4821');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!refNumber.trim()) {
      setError(t('login.error.empty'));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const transport = getTransportByRef(refNumber);
      if (transport) {
        navigate(`${getTrackPrefix(deviceFormat)}/track/${transport.id}`);
      } else {
        setError(t('login.error.notFound'));
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-8">
          <motion.img
            src={orngeLogo}
            alt="Ornge"
            className="h-14 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <h1 className="text-2xl md:text-3xl font-display font-bold text-center text-foreground">
            {t('login.title')}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground text-center max-w-xs">
            {t('login.subtitle')}
          </p>
        </div>

        {/* Login card */}
        <div className="bg-card rounded-2xl shadow-lg p-6 border border-border">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">{t('login.secure')}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ref" className="text-sm font-medium">
                {t('login.ref')}
              </Label>
              <Input
                id="ref"
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
                  {t('login.verifying')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {t('login.track')} <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

        </div>

        <p className="text-xs text-muted-foreground text-center mt-5 px-4">
          {t('login.privacy')}
        </p>

        {(deviceFormat !== 'mobile' || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
          <Link to="/platform" className="flex items-center justify-center gap-1.5 mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {t('login.backPlatform')}
          </Link>
        )}
      </motion.div>
    </div>
  );
}
