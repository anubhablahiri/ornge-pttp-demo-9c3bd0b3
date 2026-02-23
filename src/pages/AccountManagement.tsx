import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Users, Shield, Eye, Plus, Pencil, Trash2, X, Check,
  Power, PowerOff, KeyRound, Clock, Search, ChevronDown, ChevronUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const ALLOWED_USERS = [
  'arlan.nugara@ornge.ca',
  'arlan.nugara@calian.com',
  'arlan.nugara@alvarnet.ca',
];

type AdminRole = 'full_admin' | 'read_only';
type AccountStatus = 'active' | 'inactive';

interface ActivityEntry {
  id: string;
  action: string;
  timestamp: string;
  performedBy: string;
}

interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AccountStatus;
  createdAt: string;
  lastLogin: string;
  password: string;
  activityLog: ActivityEntry[];
}

const initialAccounts: AdminAccount[] = [
  {
    id: '1', name: 'Arlan Nugara', email: 'arlan.nugara@calian.com', role: 'full_admin', status: 'active',
    createdAt: '2025-12-01', lastLogin: '2026-02-23', password: 'alvar@1234!',
    activityLog: [
      { id: 'a1', action: 'Account created', timestamp: '2025-12-01T09:00:00Z', performedBy: 'System' },
      { id: 'a2', action: 'Logged in', timestamp: '2026-02-23T08:15:00Z', performedBy: 'arlan.nugara@calian.com' },
    ],
  },
  {
    id: '2', name: 'Arlan Nugara', email: 'arlan.nugara@ornge.ca', role: 'full_admin', status: 'active',
    createdAt: '2026-01-15', lastLogin: '2026-02-23', password: 'alvar@1234!',
    activityLog: [
      { id: 'b1', action: 'Account created', timestamp: '2026-01-15T10:00:00Z', performedBy: 'System' },
      { id: 'b2', action: 'Logged in', timestamp: '2026-02-23T07:45:00Z', performedBy: 'arlan.nugara@ornge.ca' },
    ],
  },
  {
    id: '3', name: 'Arlan Nugara', email: 'arlan.nugara@alvarnet.ca', role: 'full_admin', status: 'active',
    createdAt: '2026-01-20', lastLogin: '2026-02-22', password: 'alvar@1234!',
    activityLog: [
      { id: 'c1', action: 'Account created', timestamp: '2026-01-20T11:00:00Z', performedBy: 'System' },
      { id: 'c2', action: 'Logged in', timestamp: '2026-02-22T14:30:00Z', performedBy: 'arlan.nugara@alvarnet.ca' },
    ],
  },
];

const roleLabels: Record<AdminRole, string> = { full_admin: 'Full Admin', read_only: 'Read Only' };
const roleStyles: Record<AdminRole, string> = {
  full_admin: 'bg-primary/15 text-primary border-primary/30',
  read_only: 'bg-muted text-muted-foreground border-border',
};
const statusStyles: Record<AccountStatus, string> = {
  active: 'bg-green-500/15 text-green-600 border-green-500/30',
  inactive: 'bg-destructive/15 text-destructive border-destructive/30',
};

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString('en-CA', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AccountManagement() {
  const [authorized, setAuthorized] = useState(false);
  const [accounts, setAccounts] = useState<AdminAccount[]>(initialAccounts);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<AdminRole>('read_only');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [statusConfirm, setStatusConfirm] = useState<string | null>(null);
  const [passwordResetId, setPasswordResetId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');

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

  if (!authorized) return null;

  const currentUser = sessionStorage.getItem('gate_username') || '';

  const addActivity = (accountId: string, action: string) => {
    setAccounts(prev => prev.map(a =>
      a.id === accountId
        ? { ...a, activityLog: [...a.activityLog, { id: Date.now().toString(), action, timestamp: new Date().toISOString(), performedBy: currentUser }] }
        : a
    ));
  };

  const resetForm = () => {
    setFormName(''); setFormEmail(''); setFormRole('read_only');
    setEditingId(null); setShowForm(false);
  };

  const handleEdit = (account: AdminAccount) => {
    setFormName(account.name); setFormEmail(account.email);
    setFormRole(account.role); setEditingId(account.id); setShowForm(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formEmail.trim()) return;
    const now = new Date().toISOString().split('T')[0];
    if (editingId) {
      setAccounts(prev => prev.map(a =>
        a.id === editingId ? { ...a, name: formName, email: formEmail, role: formRole } : a
      ));
      addActivity(editingId, `Account updated (role: ${roleLabels[formRole]})`);
    } else {
      const newId = Date.now().toString();
      setAccounts(prev => [...prev, {
        id: newId, name: formName, email: formEmail, role: formRole,
        status: 'active', createdAt: now, lastLogin: '—', password: 'Temp@1234!',
        activityLog: [{ id: `${newId}-1`, action: 'Account created', timestamp: new Date().toISOString(), performedBy: currentUser }],
      }]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    setDeleteConfirm(null);
  };

  const toggleStatus = (id: string) => {
    setAccounts(prev => prev.map(a =>
      a.id === id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a
    ));
    const acct = accounts.find(a => a.id === id);
    if (acct) addActivity(id, `Account ${acct.status === 'active' ? 'deactivated' : 'activated'}`);
    setStatusConfirm(null);
  };

  const handlePasswordReset = (id: string) => {
    if (!newPassword.trim() || newPassword.length < 6) return;
    setAccounts(prev => prev.map(a =>
      a.id === id ? { ...a, password: newPassword } : a
    ));
    addActivity(id, 'Password reset');
    setPasswordResetId(null);
    setNewPassword('');
  };

  const filtered = accounts.filter(a => {
    if (!searchText) return true;
    const s = searchText.toLowerCase();
    return [a.name, a.email, a.role, a.status].join(' ').toLowerCase().includes(s);
  });

  const fullAdminCount = accounts.filter(a => a.role === 'full_admin').length;
  const readOnlyCount = accounts.filter(a => a.role === 'read_only').length;
  const activeCount = accounts.filter(a => a.status === 'active').length;

  const inputClass = 'w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all';
  const selectClass = 'w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer';
  const labelClass = 'block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5';

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <motion.div className="max-w-6xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Account Management</h1>
              <p className="text-sm text-muted-foreground">Manage administrator accounts, permissions, and security</p>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
            <div><p className="text-2xl font-bold text-foreground">{accounts.length}</p><p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><Shield className="h-5 w-5 text-primary" /></div>
            <div><p className="text-2xl font-bold text-foreground">{fullAdminCount}</p><p className="text-[10px] text-muted-foreground uppercase tracking-wide">Full Admin</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted"><Eye className="h-5 w-5 text-muted-foreground" /></div>
            <div><p className="text-2xl font-bold text-foreground">{readOnlyCount}</p><p className="text-[10px] text-muted-foreground uppercase tracking-wide">Read Only</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10"><Power className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold text-foreground">{activeCount}</p><p className="text-[10px] text-muted-foreground uppercase tracking-wide">Active</p></div>
          </CardContent></Card>
        </div>

        {/* Search + Add */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search accounts..." value={searchText} onChange={e => setSearchText(e.target.value)} className="pl-9 h-9" />
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2 rounded-md text-sm transition-colors flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Account
            </button>
          )}
        </div>

        {/* Add/Edit form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{editingId ? 'Edit Account' : 'Add New Account'}</CardTitle>
                    <button onClick={resetForm} className="p-1 rounded-md hover:bg-accent text-muted-foreground"><X className="h-4 w-4" /></button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div><label className={labelClass}>Full Name</label><input className={inputClass} placeholder="e.g. John Smith" value={formName} onChange={e => setFormName(e.target.value)} /></div>
                    <div><label className={labelClass}>Email</label><input className={inputClass} placeholder="e.g. john@ornge.ca" type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} /></div>
                    <div><label className={labelClass}>Role</label>
                      <select className={selectClass} value={formRole} onChange={e => setFormRole(e.target.value as AdminRole)}>
                        <option value="full_admin">Full Admin</option><option value="read_only">Read Only</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2 border-t border-border">
                    <button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2 rounded-md text-sm transition-colors flex items-center gap-2"><Check className="h-4 w-4" />{editingId ? 'Update' : 'Save'}</button>
                    <button onClick={resetForm} className="bg-accent hover:bg-accent/80 text-foreground font-medium px-5 py-2 rounded-md text-sm transition-colors border border-border">Cancel</button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password reset modal */}
        <AnimatePresence>
          {passwordResetId && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-4">
              <Card className="border-primary/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <KeyRound className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Reset Password for {accounts.find(a => a.id === passwordResetId)?.email}</span>
                  </div>
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className={labelClass}>New Password (min 6 chars)</label>
                      <input className={inputClass} type="password" placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    </div>
                    <button onClick={() => handlePasswordReset(passwordResetId)} disabled={newPassword.length < 6} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50">Reset</button>
                    <button onClick={() => { setPasswordResetId(null); setNewPassword(''); }} className="bg-accent hover:bg-accent/80 text-foreground font-medium px-4 py-2 rounded-md text-sm transition-colors border border-border">Cancel</button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status toggle confirmation */}
        <AnimatePresence>
          {statusConfirm && (() => {
            const acct = accounts.find(a => a.id === statusConfirm);
            if (!acct) return null;
            const newStatus = acct.status === 'active' ? 'deactivate' : 'activate';
            return (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-4">
                <Card className={`border ${acct.status === 'active' ? 'border-destructive/30 bg-destructive/5' : 'border-green-500/30 bg-green-500/5'}`}>
                  <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
                    <p className="text-sm text-foreground">Are you sure you want to <strong>{newStatus}</strong> <strong>{acct.email}</strong>?</p>
                    <div className="flex gap-2">
                      <button onClick={() => setStatusConfirm(null)} className="bg-accent hover:bg-accent/80 text-foreground font-medium px-4 py-1.5 rounded text-sm border border-border">Cancel</button>
                      <button onClick={() => toggleStatus(statusConfirm)} className={`font-semibold px-4 py-1.5 rounded text-sm ${acct.status === 'active' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'bg-green-600 text-white hover:bg-green-600/90'}`}>
                        Yes, {newStatus}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Accounts table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-foreground font-semibold">
                    <th className="text-left px-5 py-3">Name</th>
                    <th className="text-left px-5 py-3">Email</th>
                    <th className="text-left px-5 py-3">Role</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-left px-5 py-3">Created</th>
                    <th className="text-left px-5 py-3">Last Login</th>
                    <th className="text-left px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No accounts found.</td></tr>
                  ) : filtered.map(account => (
                    <>
                      <tr key={account.id} className="border-b border-border hover:bg-accent/30 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-foreground">{account.name}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{account.email}</td>
                        <td className="px-5 py-3.5">
                          <Badge variant="outline" className={`text-[10px] font-medium ${roleStyles[account.role]}`}>
                            {account.role === 'full_admin' ? <Shield className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                            {roleLabels[account.role]}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant="outline" className={`text-[10px] font-medium ${statusStyles[account.status]}`}>
                            {account.status === 'active' ? <Power className="h-3 w-3 mr-1" /> : <PowerOff className="h-3 w-3 mr-1" />}
                            {account.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">{account.createdAt}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{account.lastLogin}</td>
                        <td className="px-5 py-3.5">
                          {deleteConfirm === account.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-destructive font-medium">Delete?</span>
                              <button onClick={() => handleDelete(account.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold px-2.5 py-1 rounded text-xs">Yes</button>
                              <button onClick={() => setDeleteConfirm(null)} className="bg-accent hover:bg-accent/80 text-foreground font-medium px-2.5 py-1 rounded text-xs border border-border">No</button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => handleEdit(account)} title="Edit" className="p-1.5 rounded-md bg-accent hover:bg-accent/80 border border-border text-muted-foreground hover:text-foreground transition-colors">
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => setPasswordResetId(account.id)} title="Reset Password" className="p-1.5 rounded-md bg-accent hover:bg-accent/80 border border-border text-muted-foreground hover:text-foreground transition-colors">
                                <KeyRound className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => setStatusConfirm(account.id)} title={account.status === 'active' ? 'Deactivate' : 'Activate'} className="p-1.5 rounded-md bg-accent hover:bg-accent/80 border border-border text-muted-foreground hover:text-foreground transition-colors">
                                {account.status === 'active' ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
                              </button>
                              <button onClick={() => setExpandedLog(expandedLog === account.id ? null : account.id)} title="Activity Log" className={`p-1.5 rounded-md border border-border transition-colors ${expandedLog === account.id ? 'bg-primary/10 text-primary border-primary/30' : 'bg-accent hover:bg-accent/80 text-muted-foreground hover:text-foreground'}`}>
                                <Clock className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => setDeleteConfirm(account.id)} title="Delete" className="p-1.5 rounded-md bg-accent hover:bg-destructive/10 border border-border text-muted-foreground hover:text-destructive transition-colors">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                      {/* Activity log expanded row */}
                      {expandedLog === account.id && (
                        <tr key={`${account.id}-log`} className="bg-muted/20">
                          <td colSpan={7} className="px-5 py-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-4 w-4 text-primary" />
                              <span className="text-sm font-semibold text-foreground">Activity Log — {account.email}</span>
                            </div>
                            {account.activityLog.length === 0 ? (
                              <p className="text-xs text-muted-foreground">No activity recorded.</p>
                            ) : (
                              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                {[...account.activityLog].reverse().map(entry => (
                                  <div key={entry.id} className="flex items-center gap-3 text-xs">
                                    <span className="text-muted-foreground whitespace-nowrap">{formatTimestamp(entry.timestamp)}</span>
                                    <span className="text-foreground font-medium">{entry.action}</span>
                                    <span className="text-muted-foreground">by {entry.performedBy}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Link to="/versions" className="flex items-center gap-1.5 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Prototype Versions
        </Link>
      </motion.div>
    </div>
  );
}
