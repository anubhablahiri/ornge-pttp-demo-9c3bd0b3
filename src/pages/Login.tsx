import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import orngeLogoWhite from '@/assets/ornge-logo-white.png';
import { getTransportByRef, mockTransports } from '@/data/mockTransports';
import { useApp } from '@/lib/i18n';
import LanguageToggle from '@/components/LanguageToggle';

export default function Login() {
  const navigate = useNavigate();
  const { t } = useApp();
  const [refNumber, setRefNumber] = useState('ORN-2025-4821');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!refNumber.trim() || !lastName.trim()) {
      setError(t('login.error.empty'));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const transport = getTransportByRef(refNumber, lastName);
      if (transport) {
        navigate(`/track/${transport.id}`);
      } else {
        setError(t('login.error.notFound'));
      }
      setLoading(false);
    }, 800);
  };

  const handleDemo = () => {
    navigate(`/track/${mockTransports[0].id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="bg-primary px-6 pt-12 pb-16 flex flex-col items-center text-primary-foreground relative">
        <div className="absolute top-4 right-4">
          <LanguageToggle className="bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25" />
        </div>
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
          {t('login.title')}
        </motion.h1>
        <motion.p
          className="mt-2 text-sm opacity-90 text-center max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {t('login.subtitle')}
        </motion.p>
      </div>

      <motion.div
        className="flex-1 -mt-8 mx-4 md:mx-auto md:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
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
                className="h-12"
                maxLength={30}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-sm font-medium">
                {t('login.lastName')}
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

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
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

          <div className="mt-6 pt-4 border-t border-border">
            <Button variant="outline" className="w-full h-11" onClick={handleDemo}>
              <Eye className="h-4 w-4 mr-2" />
              {t('login.sample')}
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-5 px-4">
          {t('login.privacy')}
        </p>
      </motion.div>
    </div>
  );
}
