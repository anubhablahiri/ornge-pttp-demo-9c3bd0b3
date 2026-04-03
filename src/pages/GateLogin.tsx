import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, AlertCircle, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { logLogin, logSessionEnd } from '@/lib/sessionTracker';
import DemoDisclaimer from '@/components/DemoDisclaimer';

const VALID_CREDENTIALS: Record<string, string> = {
  'arlan.nugara@ornge.ca': 'alvar@1234!',
  'matthew.blacklock@calian.com': 'Xp7#mQvL9$kR2wNd',
  'rola.darwish@calian.com': 'Tz4&bYcE8!hJ5gWs',
  'zdojcinovic@ornge.ca': 'Km9@nFrA3#pV6xUq',
  'arlan.nugara@calian.com': 'alvar@1234!',
  'arlan.nugara@alvarnet.ca': 'alvar@1234!',
  'ajit.upadhyaya@calian.com': 'xzp2050@1!2!@1234!',
};

const STATS_USERS = ['arlan.nugara@calian.com', 'arlan.nugara@ornge.ca', 'arlan.nugara@alvarnet.ca'];

const MAX_ATTEMPTS = 3;
const COOLDOWN_SECONDS = 300;

export default function GateLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const locked = cooldownRemaining > 0;

  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const timer = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          setFailedAttempts(0);
          setError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (VALID_CREDENTIALS[username] && VALID_CREDENTIALS[username] === password) {
        sessionStorage.setItem('gate_authenticated', 'true');
        sessionStorage.setItem('gate_username', username);
        if (STATS_USERS.includes(username)) {
          sessionStorage.setItem('stats_access', 'true');
        }
        // Log session asynchronously
        logLogin(username).then((sid) => {
          if (sid) sessionStorage.setItem('session_id', sid);
        });
        setFailedAttempts(0);
        navigate('/versions');
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        if (newAttempts >= MAX_ATTEMPTS) {
          setCooldownRemaining(COOLDOWN_SECONDS);
          setError(`Too many failed attempts. Please wait ${COOLDOWN_SECONDS} seconds.`);
        } else {
          setError(`Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempt(s) remaining.`);
        }
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">PTTP Demo Access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter credentials to view the prototype versions
          </p>
        </div>

        <div className="mb-4">
          <DemoDisclaimer />
        </div>

        <div className="bg-card rounded-2xl shadow-lg p-6 border border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="h-12 rounded-lg"
                autoComplete="off"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gate-password" className="text-sm font-medium">Password</Label>
              <Input
                id="gate-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="h-12 rounded-lg"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {locked && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 border border-border">
                <Timer className="h-4 w-4 shrink-0 text-destructive" />
                <span>Locked out. Try again in <span className="font-semibold text-foreground">{cooldownRemaining}s</span></span>
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-base font-semibold rounded-lg" disabled={loading || locked}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : locked ? (
                <span className="flex items-center gap-2">
                  <Timer className="h-4 w-4" /> Locked ({cooldownRemaining}s)
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </div>


      </motion.div>
    </div>
  );
}
