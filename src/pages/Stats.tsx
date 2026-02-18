import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, RefreshCw, BarChart3, Trash2, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface SessionLog {
  id: string;
  username: string;
  ip_address: string | null;
  location: string | null;
  device: string | null;
  os: string | null;
  browser: string | null;
  login_time: string;
  session_end_time: string | null;
  session_duration_seconds: number | null;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return 'Active';
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-CA', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

function exportCSV(logs: SessionLog[]) {
  const headers = ['Username', 'IP Address', 'Location', 'Device', 'OS', 'Browser', 'Login Time', 'Session End', 'Duration (s)'];
  const rows = logs.map(l => [
    l.username, l.ip_address || '', l.location || '', l.device || '',
    l.os || '', l.browser || '', l.login_time, l.session_end_time || '',
    l.session_duration_seconds?.toString() || '',
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `session-logs-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function uniqueValues(logs: SessionLog[], key: keyof SessionLog): string[] {
  const vals = new Set<string>();
  logs.forEach(l => {
    const v = l[key];
    if (v && typeof v === 'string') vals.add(v);
  });
  return Array.from(vals).sort();
}

export default function Stats() {
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filters
  const [filterUsername, setFilterUsername] = useState('__all__');
  const [filterLocation, setFilterLocation] = useState('__all__');
  const [filterDevice, setFilterDevice] = useState('__all__');
  const [filterOS, setFilterOS] = useState('__all__');
  const [filterBrowser, setFilterBrowser] = useState('__all__');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const gateUser = sessionStorage.getItem('gate_username') || '';
    if (
      sessionStorage.getItem('stats_access') !== 'true' ||
      !['arlan.nugara@calian.com', 'arlan.nugara@alvarnet.ca'].includes(gateUser)
    ) {
      window.location.href = '/';
      return;
    }
    setAuthorized(true);
  }, []);

  const fetchLogs = async () => {
    const statsSecret = sessionStorage.getItem('stats_secret');
    if (!statsSecret) { setLoading(false); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-stats', {
        body: { secret: statsSecret },
      });
      if (!error && data?.data) setLogs(data.data as SessionLog[]);
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
    setLoading(false);
  };

  const clearStats = async () => {
    const statsSecret = sessionStorage.getItem('stats_secret');
    if (!statsSecret) return;
    setClearing(true);
    try {
      const { error } = await supabase.functions.invoke('clear-stats', {
        body: { secret: statsSecret },
      });
      if (!error) {
        setLogs([]);
        setShowClearConfirm(false);
      }
    } catch (e) {
      console.error('Failed to clear stats:', e);
    }
    setClearing(false);
  };

  useEffect(() => { if (authorized) fetchLogs(); }, [authorized]);

  const filteredLogs = useMemo(() => {
    return logs.filter(l => {
      if (filterUsername !== '__all__' && l.username !== filterUsername) return false;
      if (filterLocation !== '__all__' && l.location !== filterLocation) return false;
      if (filterDevice !== '__all__' && l.device !== filterDevice) return false;
      if (filterOS !== '__all__' && l.os !== filterOS) return false;
      if (filterBrowser !== '__all__' && l.browser !== filterBrowser) return false;
      if (searchText) {
        const s = searchText.toLowerCase();
        const searchable = [l.username, l.ip_address, l.location, l.device, l.os, l.browser]
          .filter(Boolean).join(' ').toLowerCase();
        if (!searchable.includes(s)) return false;
      }
      return true;
    });
  }, [logs, filterUsername, filterLocation, filterDevice, filterOS, filterBrowser, searchText]);

  const hasActiveFilters = filterUsername !== '__all__' || filterLocation !== '__all__' || filterDevice !== '__all__' || filterOS !== '__all__' || filterBrowser !== '__all__' || searchText !== '';

  const clearFilters = () => {
    setFilterUsername('__all__');
    setFilterLocation('__all__');
    setFilterDevice('__all__');
    setFilterOS('__all__');
    setFilterBrowser('__all__');
    setSearchText('');
  };

  const uniqueUsers = new Set(filteredLogs.map(l => l.username)).size;
  const totalSessions = filteredLogs.length;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Session Analytics</h1>
              <p className="text-sm text-muted-foreground">
                {totalSessions} sessions from {uniqueUsers} users
                {hasActiveFilters && <span className="text-primary ml-1">(filtered)</span>}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportCSV(filteredLogs)} disabled={filteredLogs.length === 0}>
              <Download className="h-4 w-4 mr-1.5" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => setShowClearConfirm(true)}
              disabled={logs.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Clear Stats
            </Button>
          </div>
        </div>

        {/* Clear confirmation */}
        {showClearConfirm && (
          <motion.div
            className="mb-4 bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-foreground font-medium">
              Are you sure you want to delete <strong>all {logs.length} session logs</strong>? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(false)}>Cancel</Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={clearStats}
                disabled={clearing}
              >
                {clearing ? 'Clearing...' : 'Yes, Clear All'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="mb-4 bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filters</span>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-muted-foreground" onClick={clearFilters}>
                <X className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Search</label>
              <Input
                placeholder="Search..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Username</label>
              <Select value={filterUsername} onValueChange={setFilterUsername}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All</SelectItem>
                  {uniqueValues(logs, 'username').map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Location</label>
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All</SelectItem>
                  {uniqueValues(logs, 'location').map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Device</label>
              <Select value={filterDevice} onValueChange={setFilterDevice}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All</SelectItem>
                  {uniqueValues(logs, 'device').map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">OS</label>
              <Select value={filterOS} onValueChange={setFilterOS}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All</SelectItem>
                  {uniqueValues(logs, 'os').map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Browser</label>
              <Select value={filterBrowser} onValueChange={setFilterBrowser}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All</SelectItem>
                  {uniqueValues(logs, 'browser').map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Username</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">IP Address</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Location</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Device</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">OS</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Browser</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Login Time</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Session End</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Duration</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : filteredLogs.length === 0 ? (
                  <tr><td colSpan={9} className="p-8 text-center text-muted-foreground">
                    {hasActiveFilters ? 'No sessions match the current filters.' : 'No sessions recorded yet.'}
                  </td></tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium text-foreground">{log.username}</td>
                      <td className="p-3 text-muted-foreground font-mono text-xs">{log.ip_address || '—'}</td>
                      <td className="p-3 text-muted-foreground">{log.location || '—'}</td>
                      <td className="p-3 text-muted-foreground">{log.device || '—'}</td>
                      <td className="p-3 text-muted-foreground">{log.os || '—'}</td>
                      <td className="p-3 text-muted-foreground">{log.browser || '—'}</td>
                      <td className="p-3 text-muted-foreground whitespace-nowrap">{formatDate(log.login_time)}</td>
                      <td className="p-3 text-muted-foreground whitespace-nowrap">{log.session_end_time ? formatDate(log.session_end_time) : '—'}</td>
                      <td className="p-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          log.session_end_time
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-green-500/10 text-green-600'
                        }`}>
                          {formatDuration(log.session_duration_seconds)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Link
          to="/versions"
          className="flex items-center gap-1.5 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Prototype Versions
        </Link>
      </motion.div>
    </div>
  );
}
