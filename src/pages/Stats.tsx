import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, RefreshCw, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    l.username,
    l.ip_address || '',
    l.location || '',
    l.device || '',
    l.os || '',
    l.browser || '',
    l.login_time,
    l.session_end_time || '',
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

export default function Stats() {
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // Check access immediately — redirect if not arlan
  useEffect(() => {
    if (
      sessionStorage.getItem('stats_access') !== 'true' ||
      sessionStorage.getItem('gate_username') !== 'arlan'
    ) {
      window.location.href = '/';
      return;
    }
    setAuthorized(true);
  }, []);

  const fetchLogs = async () => {
    const statsSecret = sessionStorage.getItem('stats_secret');
    if (!statsSecret) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-stats', {
        body: { secret: statsSecret },
      });
      if (!error && data?.data) {
        setLogs(data.data as SessionLog[]);
      }
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
    setLoading(false);
  };

  useEffect(() => { if (authorized) fetchLogs(); }, [authorized]);

  const uniqueUsers = new Set(logs.map(l => l.username)).size;
  const totalSessions = logs.length;

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
              <p className="text-sm text-muted-foreground">{totalSessions} sessions from {uniqueUsers} users</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportCSV(logs)} disabled={logs.length === 0}>
              <Download className="h-4 w-4 mr-1.5" />
              Export CSV
            </Button>
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
                  <th className="text-left p-3 font-medium text-muted-foreground">Duration</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No sessions recorded yet.</td></tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium text-foreground">{log.username}</td>
                      <td className="p-3 text-muted-foreground font-mono text-xs">{log.ip_address || '—'}</td>
                      <td className="p-3 text-muted-foreground">{log.location || '—'}</td>
                      <td className="p-3 text-muted-foreground">{log.device || '—'}</td>
                      <td className="p-3 text-muted-foreground">{log.os || '—'}</td>
                      <td className="p-3 text-muted-foreground">{log.browser || '—'}</td>
                      <td className="p-3 text-muted-foreground whitespace-nowrap">{formatDate(log.login_time)}</td>
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
          to="/"
          className="flex items-center gap-1.5 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </motion.div>
    </div>
  );
}
