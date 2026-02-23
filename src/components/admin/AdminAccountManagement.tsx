import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Eye, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type AdminRole = 'full_admin' | 'read_only';

interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  createdAt: string;
  lastLogin: string;
}

const initialAccounts: AdminAccount[] = [
  { id: '1', name: 'James Carter', email: 'james.carter@ornge.ca', role: 'full_admin', createdAt: '2025-11-10', lastLogin: '2026-02-22' },
  { id: '2', name: 'Priya Sharma', email: 'priya.sharma@ornge.ca', role: 'full_admin', createdAt: '2025-12-05', lastLogin: '2026-02-21' },
  { id: '3', name: 'Sarah Mitchell', email: 'sarah.mitchell@ornge.ca', role: 'read_only', createdAt: '2026-01-20', lastLogin: '2026-02-17' },
  { id: '4', name: 'David Chen', email: 'david.chen@ornge.ca', role: 'full_admin', createdAt: '2026-02-01', lastLogin: '2026-02-16' },
  { id: '5', name: 'Lisa Nguyen', email: 'lisa.nguyen@ornge.ca', role: 'read_only', createdAt: '2026-02-10', lastLogin: '2026-02-15' },
];

const roleLabels: Record<AdminRole, string> = {
  full_admin: 'Full Admin',
  read_only: 'Read Only',
};

const roleStyles: Record<AdminRole, string> = {
  full_admin: 'bg-primary/15 text-primary border-primary/30',
  read_only: 'bg-muted text-muted-foreground border-border',
};

interface Props {
  isReadOnly?: boolean;
}

export default function AdminAccountManagement({ isReadOnly = false }: Props) {
  const [accounts, setAccounts] = useState<AdminAccount[]>(initialAccounts);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<AdminRole>('read_only');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormRole('read_only');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (account: AdminAccount) => {
    setFormName(account.name);
    setFormEmail(account.email);
    setFormRole(account.role);
    setEditingId(account.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formEmail.trim()) return;
    const now = new Date().toISOString().split('T')[0];

    if (editingId) {
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === editingId ? { ...a, name: formName, email: formEmail, role: formRole } : a
        )
      );
    } else {
      setAccounts((prev) => [
        ...prev,
        { id: Date.now().toString(), name: formName, email: formEmail, role: formRole, createdAt: now, lastLogin: '—' },
      ]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    setDeleteConfirm(null);
  };

  const fullAdminCount = accounts.filter((a) => a.role === 'full_admin').length;
  const readOnlyCount = accounts.filter((a) => a.role === 'read_only').length;

  const inputClass =
    'w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all';
  const selectClass =
    'w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer';
  const labelClass = 'block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5';

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{accounts.length}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Accounts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{fullAdminCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Full Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Eye className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{readOnlyCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Read Only</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add button + form */}
      {!isReadOnly && (
        <>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2.5 rounded-md text-sm transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Account
            </button>
          )}

          {showForm && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{editingId ? 'Edit Account' : 'Add New Account'}</CardTitle>
                  <button onClick={resetForm} className="p-1 rounded-md hover:bg-accent text-muted-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input className={inputClass} placeholder="e.g. John Smith" value={formName} onChange={(e) => setFormName(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input className={inputClass} placeholder="e.g. john@ornge.ca" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Role</label>
                    <select className={selectClass} value={formRole} onChange={(e) => setFormRole(e.target.value as AdminRole)}>
                      <option value="full_admin">Full Admin</option>
                      <option value="read_only">Read Only</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2 border-t border-border">
                  <button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2 rounded-md text-sm transition-colors flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    {editingId ? 'Update' : 'Save'}
                  </button>
                  <button onClick={resetForm} className="bg-accent hover:bg-accent/80 text-foreground font-medium px-5 py-2 rounded-md text-sm transition-colors border border-border">
                    Cancel
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

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
                  <th className="text-left px-5 py-3">Created</th>
                  <th className="text-left px-5 py-3">Last Login</th>
                  {!isReadOnly && <th className="text-left px-5 py-3">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id} className="border-b border-border hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-foreground">{account.name}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{account.email}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant="outline" className={`text-[10px] font-medium ${roleStyles[account.role]}`}>
                        {account.role === 'full_admin' ? <Shield className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                        {roleLabels[account.role]}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{account.createdAt}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{account.lastLogin}</td>
                    {!isReadOnly && (
                      <td className="px-5 py-3.5">
                        {deleteConfirm === account.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-destructive font-medium">Confirm?</span>
                            <button onClick={() => handleDelete(account.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold px-2.5 py-1 rounded text-xs transition-colors">
                              Yes
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className="bg-accent hover:bg-accent/80 text-foreground font-medium px-2.5 py-1 rounded text-xs transition-colors border border-border">
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleEdit(account)} className="p-1.5 rounded-md bg-accent hover:bg-accent/80 border border-border text-muted-foreground hover:text-foreground transition-colors">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => setDeleteConfirm(account.id)} className="p-1.5 rounded-md bg-accent hover:bg-destructive/10 border border-border text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
