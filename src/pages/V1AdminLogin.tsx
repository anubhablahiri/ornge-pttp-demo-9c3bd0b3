import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import orngeLogo from '@/assets/ornge-logo.png';

export default function V1AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@ornge.ca');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate('/v1/admin'), 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center mb-8">
          <motion.img src={orngeLogo} alt="Ornge" className="h-14 mb-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} />
          <h1 className="text-2xl font-bold text-center text-foreground">Operations Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground text-center">Sign in to access the admin portal</p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg p-6 border border-border">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Secure admin authentication</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="v1-admin-email" className="text-sm font-medium">Email Address</Label>
              <Input id="v1-admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="v1-admin-pass" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input id="v1-admin-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-lg pr-10" />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 border border-border">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Demo Mode:</span> Credentials are pre-filled.
              </p>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold rounded-lg" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">Sign In <ArrowRight className="h-4 w-4" /></span>
              )}
            </Button>
          </form>
        </div>

        <Link
          to="/v1"
          className="flex items-center justify-center gap-1.5 mt-5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Portal Selection
        </Link>
      </motion.div>
    </div>
  );
}
