import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Users, Plus, Trash2, X, Check, RefreshCw,
  Eye, EyeOff, Copy, Clock,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ALLOWED_USERS = [
  'arlan.nugara@ornge.ca',
  'arlan.nugara@calian.com',
  'arlan.nugara@alvarnet.ca',
];

interface Account {
  id: string;
  email: string;
  password: string;
  logins: number;
  sessionAnalytics: boolean;
  acctMgmt: boolean;
  status: boolean;
}

interface ActivityEntry {
  id: string;
  action: string;
  target: string;
  performedBy: string;
  timestamp: string;
}

const initialAccounts: Account[] = [
  { id: '1', email: 'arlan.nugara@ornge.ca', password: 'alvar@1234!', logins: 5, sessionAnalytics: true, acctMgmt: true, status: true },
  { id: '2', email: 'arlan.nugara@calian.com', password: 'alvar@1234!', logins: 3, sessionAnalytics: true, acctMgmt: true, status: true },
  { id: '3', email: 'arlan.nugara@alvarnet.ca', password: 'alvar@1234!', logins: 8, sessionAnalytics: true, acctMgmt: true, status: true },
  { id: '4', email: 'matthew.blacklock@calian.com', password: 'Xp7#mQvL9$kR2wNd', logins: 0, sessionAnalytics: true, acctMgmt: false, status: true },
  { id: '5', email: 'rola.darwish@calian.com', password: 'Tz4&bYcE8!hJ5gWs', logins: 0, sessionAnalytics: false, acctMgmt: false, status: true },
  { id: '6', email: 'zdojcinovic@ornge.ca', password: 'Km9@nFrA3#pV6xUq', logins: 0, sessionAnalytics: false, acctMgmt: false, status: true },
  { id: '7', email: 'ajit.upadhyaya@calian.com', password: 'xzp2050@1!2!@1234!', logins: 0, sessionAnalytics: false, acctMgmt: false, status: true },
];

const initialActivity: ActivityEntry[] = [
  { id: 'init1', action: 'Account created', target: 'arlan.nugara@ornge.ca', performedBy: 'System', timestamp: '2025-12-01T09:00:00Z' },
  { id: 'init2', action: 'Account created', target: 'arlan.nugara@calian.com', performedBy: 'System', timestamp: '2025-12-15T10:00:00Z' },
  { id: 'init3', action: 'Account created', target: 'arlan.nugara@alvarnet.ca', performedBy: 'System', timestamp: '2026-01-10T11:00:00Z' },
  { id: 'init4', action: 'Account created', target: 'matthew.blacklock@calian.com', performedBy: 'arlan.nugara@ornge.ca', timestamp: '2026-01-20T09:30:00Z' },
  { id: 'init5', action: 'Account created', target: 'rola.darwish@calian.com', performedBy: 'arlan.nugara@ornge.ca', timestamp: '2026-01-25T14:00:00Z' },
  { id: 'init6', action: 'Account created', target: 'zdojcinovic@ornge.ca', performedBy: 'arlan.nugara@ornge.ca', timestamp: '2026-02-01T08:45:00Z' },
];

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString('en-CA', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const ACCOUNTS_STORAGE_KEY = 'pttp_accounts';
const ACTIVITY_STORAGE_KEY = 'pttp_account_activity';

function loadAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {}
  return initialAccounts;
}

function loadActivity(): ActivityEntry[] {
  try {
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return initialActivity;
}

export default function AccountManagement() {
  const [authorized, setAuthorized] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>(loadAccounts);
  const [activity, setActivity] = useState<ActivityEntry[]>(loadActivity);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const gateUser = sessionStorage.getItem('gate_username') || '';
    if (
      sessionStorage.getItem('gate_authenticated') !== 'true' ||
      !ALLOWED_USERS.includes(gateUser)
    ) {
      window.location.href = '/';
      return;
    }
    setAuthorized(true);
  }, []);

  // Persist accounts & activity so they survive reloads and so the login
  // gate can authenticate accounts added here.
  useEffect(() => {
    try { localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts)); } catch {}
  }, [accounts]);
  useEffect(() => {
    try { localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activity)); } catch {}
  }, [activity]);

  if (!authorized) return null;

  const currentUser = sessionStorage.getItem('gate_username') || 'admin';

  const logActivity = (action: string, target: string) => {
    setActivity(prev => [{
      id: Date.now().toString(),
      action,
      target,
      performedBy: currentUser,
      timestamp: new Date().toISOString(),
    }, ...prev]);
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyPassword = (id: string, password: string) => {
    navigator.clipboard?.writeText(password);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const toggleField = (id: string, field: 'sessionAnalytics' | 'acctMgmt' | 'status') => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, [field]: !a[field] } : a));
    const acct = accounts.find(a => a.id === id);
    if (acct) {
      const fieldLabels = { sessionAnalytics: 'Session Analytics', acctMgmt: 'Acct Mgmt', status: 'Status' };
      const newVal = !acct[field];
      logActivity(`${fieldLabels[field]} ${newVal ? 'enabled' : 'disabled'}`, acct.email);
    }
  };

  const handleDelete = (id: string) => {
    const acct = accounts.find(a => a.id === id);
    if (acct) logActivity('Account deleted', acct.email);
    setAccounts(prev => prev.filter(a => a.id !== id));
    setDeleteConfirm(null);
  };

  const handleResetPassword = (id: string) => {
    if (!newPassword.trim() || newPassword.length < 6) return;
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, password: newPassword } : a));
    const acct = accounts.find(a => a.id === id);
    if (acct) logActivity('Password reset', acct.email);
    setResetConfirm(null);
    setNewPassword('');
  };

  const handleAddAccount = () => {
    if (!newEmail.trim() || !newPwd.trim() || newPwd.length < 6) return;
    setAccounts(prev => [...prev, {
      id: Date.now().toString(),
      email: newEmail.trim(),
      password: newPwd,
      logins: 0,
      sessionAnalytics: false,
      acctMgmt: false,
      status: true,
    }]);
    logActivity('Account created', newEmail.trim());
    setNewEmail('');
    setNewPwd('');
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <motion.div className="max-w-6xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Account Management</h1>
            <p className="text-sm text-muted-foreground">Manage accounts, permissions, and security</p>
          </div>
        </div>

        <Tabs defaultValue="accounts" className="w-full">
          <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start gap-0 h-auto p-0">
            <TabsTrigger
              value="accounts"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-5 py-3 text-sm font-medium"
            >
              Accounts
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-5 py-3 text-sm font-medium flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Recent Activity
            </TabsTrigger>
          </TabsList>

          {/* ─── Accounts Tab ─── */}
          <TabsContent value="accounts" className="mt-0">
            <div className="bg-card border border-border rounded-b-xl rounded-tr-xl">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">Accounts ({accounts.length})</h2>
                <div className="flex items-center gap-3">
                  {!showAddForm && (
                    <Button size="sm" onClick={() => setShowAddForm(true)} className="gap-1.5">
                      <Plus className="h-4 w-4" /> Add Account
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <RefreshCw className="h-4 w-4" /> Refresh
                  </Button>
                </div>
              </div>

              {/* Add form */}
              {showAddForm && (
                <div className="px-6 py-4 border-b border-border bg-muted/30">
                  <div className="flex items-end gap-3 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Email</label>
                      <Input placeholder="user@domain.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="h-9" />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Password (min 6 chars)</label>
                      <Input type="password" placeholder="••••••••" value={newPwd} onChange={e => setNewPwd(e.target.value)} className="h-9" />
                    </div>
                    <Button size="sm" onClick={handleAddAccount} disabled={!newEmail.trim() || newPwd.length < 6} className="gap-1.5">
                      <Check className="h-4 w-4" /> Add
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setShowAddForm(false); setNewEmail(''); setNewPwd(''); }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Reset password inline */}
              {resetConfirm && (() => {
                const acct = accounts.find(a => a.id === resetConfirm);
                if (!acct) return null;
                return (
                  <div className="px-6 py-4 border-b border-border bg-primary/5">
                    <div className="flex items-end gap-3 flex-wrap">
                      <p className="text-sm font-medium text-foreground self-center">Reset password for <strong>{acct.email}</strong></p>
                      <div className="flex-1 min-w-[200px]">
                        <Input type="password" placeholder="New password (min 6 chars)" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="h-9" />
                      </div>
                      <Button size="sm" onClick={() => handleResetPassword(resetConfirm)} disabled={newPassword.length < 6} className="gap-1.5">
                        <Check className="h-4 w-4" /> Reset
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { setResetConfirm(null); setNewPassword(''); }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                );
              })()}

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Password</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Logins</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Session Analytics</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Acct Mgmt</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="text-center px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map(account => (
                      <tr key={account.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        {/* Email */}
                        <td className="px-6 py-4">
                          <span className="font-medium text-primary">{account.email}</span>
                        </td>

                        {/* Password */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-foreground min-w-[100px]">
                              {visiblePasswords.has(account.id) ? account.password : '••••••••'}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(account.id)}
                              className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                              title={visiblePasswords.has(account.id) ? 'Hide' : 'Show'}
                            >
                              {visiblePasswords.has(account.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => copyPassword(account.id, account.password)}
                              className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                              title="Copy"
                            >
                              {copiedId === account.id ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                        </td>

                        {/* Logins */}
                        <td className="px-4 py-4 text-center">
                          <Badge variant="secondary" className="font-mono text-xs min-w-[28px] justify-center">
                            {account.logins}
                          </Badge>
                        </td>

                        {/* Session Analytics toggle */}
                        <td className="px-4 py-4 text-center">
                          <div className="flex justify-center">
                            <Switch
                              checked={account.sessionAnalytics}
                              onCheckedChange={() => toggleField(account.id, 'sessionAnalytics')}
                            />
                          </div>
                        </td>

                        {/* Acct Mgmt toggle */}
                        <td className="px-4 py-4 text-center">
                          <div className="flex justify-center">
                            <Switch
                              checked={account.acctMgmt}
                              onCheckedChange={() => toggleField(account.id, 'acctMgmt')}
                            />
                          </div>
                        </td>

                        {/* Status toggle */}
                        <td className="px-4 py-4 text-center">
                          <div className="flex justify-center">
                            <Switch
                              checked={account.status}
                              onCheckedChange={() => toggleField(account.id, 'status')}
                            />
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          {deleteConfirm === account.id ? (
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-xs text-destructive font-medium">Delete?</span>
                              <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => handleDelete(account.id)}>Yes</Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setDeleteConfirm(null)}>No</Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => setResetConfirm(account.id)}
                              >
                                Reset Password
                              </Button>
                              <button
                                onClick={() => setDeleteConfirm(account.id)}
                                className="w-8 h-8 rounded-md bg-destructive/10 hover:bg-destructive text-destructive hover:text-destructive-foreground flex items-center justify-center transition-colors"
                                title="Delete account"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* ─── Recent Activity Tab ─── */}
          <TabsContent value="activity" className="mt-0">
            <div className="bg-card border border-border rounded-b-xl rounded-tr-xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">Recent Activity ({activity.length})</h2>
              </div>
              <div className="divide-y divide-border/50 max-h-[600px] overflow-y-auto">
                {activity.length === 0 ? (
                  <div className="px-6 py-12 text-center text-muted-foreground">No activity recorded yet.</div>
                ) : (
                  activity.map(entry => (
                    <div key={entry.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                      <div className="w-2 h-2 rounded-full shrink-0 bg-primary/60" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">
                          <span className="font-semibold">{entry.action}</span>
                          {' — '}
                          <span className="text-primary font-medium">{entry.target}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          by {entry.performedBy} · {formatTimestamp(entry.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Link to="/versions" className="flex items-center gap-1.5 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Prototype Versions
        </Link>
      </motion.div>
    </div>
  );
}
