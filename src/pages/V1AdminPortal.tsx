import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, ArrowLeft, Calendar, Copy, Check, X } from 'lucide-react';
import orngeLogo from '@/assets/ornge-logo.png';
import AdminAccountManagement from '@/components/admin/AdminAccountManagement';
import V1ImplementationRoadmap from '@/components/admin/V1ImplementationRoadmap';
import { QRCodeSVG } from 'qrcode.react';

const STATUS_OPTIONS = [
  'Preparing for transport',
  'En route to patient pickup',
  'With patient',
  'En Route to patient dropoff',
  'Arrived at destination',
  'Transport complete',
];

const SPECIAL_MESSAGES = [
  'Medical Delay: ETA will be posted upon significant event. Thank you for your understanding.',
  'Weather Delay: ETA will be posted upon significant event. Thank you for your understanding.',
];

const HOSPITALS = [
  'Windsor Regional Hospital – Ouellette Campus',
  'Thunder Bay Regional Health Sciences Centre',
  'Toronto General Hospital',
  'Hamilton General Hospital',
  'The Ottawa Hospital',
  'Sudbury Health Sciences North',
];

interface TrackingEntry {
  id: string;
  trackingNumber: string;
  missionNumber: string;
  status: string;
  lastUpdated: string;
  eta: string;
}

const initialEntries: TrackingEntry[] = [
  { id: '1', trackingNumber: '0877248692653397', missionNumber: '1000', status: 'Preparing for transport', lastUpdated: '2/9/2026, 11:03:27 AM', eta: 'TBD' },
  { id: '2', trackingNumber: '0987997083725079', missionNumber: '3000', status: 'With patient', lastUpdated: '2/9/2026, 11:04:23 AM', eta: 'Feb 09, 2026, 04:10 PM' },
  { id: '3', trackingNumber: '2260461044312368', missionNumber: '2000', status: 'En route to patient pickup', lastUpdated: '2/9/2026, 11:03:59 AM', eta: 'Feb 09, 2026, 01:06 PM' },
  { id: '4', trackingNumber: '3077922966412207', missionNumber: '5000', status: 'Arrived at destination', lastUpdated: '2/9/2026, 11:05:34 AM', eta: 'Feb 10, 2026, 12:07 AM' },
  { id: '5', trackingNumber: '8848062908469908', missionNumber: '4000', status: 'En Route to patient dropoff', lastUpdated: '2/9/2026, 11:05:07 AM', eta: 'TBD' },
];

function generateTrackingNumber() {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
}

export default function V1AdminPortal() {
  const [entries, setEntries] = useState<TrackingEntry[]>(initialEntries);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [missionNumber, setMissionNumber] = useState('');
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [eta, setEta] = useState('');
  const [specialMessage, setSpecialMessage] = useState('');
  const [filterText, setFilterText] = useState('');
  const [hospital, setHospital] = useState(HOSPITALS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [tableQR, setTableQR] = useState<string | null>(null);

  const getTrackingUrl = (trackNum: string) =>
    `${window.location.origin}/v1/track/T-1?ref=${trackNum}`;

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  };

  const handleGenerate = () => {
    setTrackingNumber(generateTrackingNumber());
    setEditingId(null);
  };

  const handleSave = () => {
    if (!trackingNumber || !missionNumber) return;
    const now = new Date().toLocaleString('en-US');

    if (editingId) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === editingId
            ? { ...e, trackingNumber, missionNumber, status, lastUpdated: now, eta: eta || 'TBD' }
            : e
        )
      );
      setEditingId(null);
    } else {
      setEntries((prev) => [
        ...prev,
        { id: Date.now().toString(), trackingNumber, missionNumber, status, lastUpdated: now, eta: eta || 'TBD' },
      ]);
    }
    setTrackingNumber('');
    setMissionNumber('');
    setStatus(STATUS_OPTIONS[0]);
    setEta('');
    setSpecialMessage('');
  };

  const handleEdit = (entry: TrackingEntry) => {
    setTrackingNumber(entry.trackingNumber);
    setMissionNumber(entry.missionNumber);
    setStatus(entry.status);
    setEta(entry.eta === 'TBD' ? '' : entry.eta);
    setEditingId(entry.id);
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const filteredEntries = filterText
    ? entries.filter(
        (e) =>
          e.trackingNumber.includes(filterText) ||
          e.missionNumber.includes(filterText) ||
          e.status.toLowerCase().includes(filterText.toLowerCase())
      )
    : entries;

  const inputClass =
    'w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all';
  const selectClass =
    'w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer';
  const labelClass = 'block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5';

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/v1" className="p-1.5 rounded-lg hover:bg-accent transition-colors">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Link>
            <img src={orngeLogo} alt="Ornge" className="h-8" />
            <div>
              <h1 className="font-bold text-lg text-foreground leading-tight">Operations Administration (v1)</h1>
              <p className="text-xs text-muted-foreground">Ornge Transport Medicine</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date().toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6"
        >
          <h2 className="text-xl font-bold text-foreground">Transport Entry</h2>
          {/* Row 1: Core fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Tracking Number</label>
              <div className="flex gap-2">
                <input
                  className={`${inputClass} flex-1`}
                  placeholder="Enter or generate"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
                <button
                  onClick={handleGenerate}
                  className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-3 py-2 rounded-md text-xs transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>Mission #</label>
              <input
                className={inputClass}
                placeholder="e.g. 1000"
                value={missionNumber}
                onChange={(e) => setMissionNumber(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                className={selectClass}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>ETA</label>
              <input
                type="datetime-local"
                className={inputClass}
                value={eta}
                onChange={(e) => setEta(e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: Hospital + Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Hospital</label>
              <select
                className={selectClass}
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
              >
                {HOSPITALS.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Filter</label>
              <input
                className={inputClass}
                placeholder="Search by tracking #, mission, or status"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
          </div>

          {/* Row 3: Special message */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Special Message</label>
              <select
                className={selectClass}
                value={specialMessage}
                onChange={(e) => setSpecialMessage(e.target.value)}
              >
                <option value="">None (optional)</option>
                {SPECIAL_MESSAGES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Additional Notes</label>
              <textarea
                className={`${inputClass} h-20 resize-none`}
                placeholder="Enter any notes…"
                value={specialMessage}
                onChange={(e) => setSpecialMessage(e.target.value)}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2 border-t border-border">
            <button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2.5 rounded-md text-sm transition-colors"
            >
              {editingId ? 'Update Entry' : 'Save Entry'}
            </button>
          </div>
        </motion.div>

        {/* QR Sharing Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.35 }}
          className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-foreground">Share Tracking Link</h2>
          <p className="text-sm text-muted-foreground">Generate and share a QR code or direct link for a tracking number so families can follow transport progress.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (trackingNumber) setShowQR(true);
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2.5 rounded-md text-sm transition-colors flex items-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              Generate QR Code
            </button>
            {!trackingNumber && (
              <span className="text-xs text-muted-foreground">Enter a tracking number above first</span>
            )}
          </div>
          {showQR && trackingNumber && (
            <div className="flex items-start gap-4 p-4 bg-accent/20 rounded-xl border border-border animate-in slide-in-from-top-1 duration-200">
              <div className="bg-white p-3 rounded-xl border border-border shadow-sm shrink-0">
                <QRCodeSVG value={getTrackingUrl(trackingNumber)} size={100} level="M" includeMargin={false} />
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <p className="text-sm font-medium text-foreground">Tracking #{trackingNumber}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0 bg-background border border-border rounded-md px-2.5 py-1.5 text-[11px] text-muted-foreground truncate font-mono">
                    {getTrackingUrl(trackingNumber)}
                  </div>
                  <button
                    onClick={() => handleCopyLink(getTrackingUrl(trackingNumber))}
                    className="shrink-0 p-1.5 rounded-md bg-background hover:bg-accent border border-border transition-colors"
                  >
                    {copiedLink ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                  </button>
                </div>
              </div>
              <button onClick={() => setShowQR(false)} className="p-1 rounded-md hover:bg-accent text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Tracking Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-foreground">Tracking Table</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-foreground font-semibold">
                  <th className="text-left px-5 py-3">Tracking #</th>
                  <th className="text-left px-5 py-3">Mission #</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Last Updated</th>
                  <th className="text-left px-5 py-3">ETA</th>
                  <th className="text-left px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-border hover:bg-accent/30 transition-colors"
                  >
                    <td className="px-5 py-4 font-mono text-sm">{entry.trackingNumber}</td>
                    <td className="px-5 py-4">{entry.missionNumber}</td>
                    <td className="px-5 py-4">{entry.status}</td>
                    <td className="px-5 py-4 text-muted-foreground">{entry.lastUpdated}</td>
                    <td className="px-5 py-4 text-muted-foreground">{entry.eta}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setTableQR(tableQR === entry.trackingNumber ? null : entry.trackingNumber)}
                          className={`p-2 rounded border transition-colors ${tableQR === entry.trackingNumber ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-accent border-border text-muted-foreground hover:text-foreground'}`}
                        >
                          <QrCode className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(entry)}
                          className="bg-accent hover:bg-accent/80 border border-border text-foreground font-medium px-3 py-1.5 rounded text-xs transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold px-3 py-1.5 rounded text-xs transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                      {tableQR === entry.trackingNumber && (
                        <div className="mt-2 flex items-center gap-3 p-2 bg-accent/20 rounded-lg border border-border/50 animate-in slide-in-from-top-1 duration-200">
                          <div className="bg-white p-2 rounded-lg border border-border shrink-0">
                            <QRCodeSVG value={getTrackingUrl(entry.trackingNumber)} size={64} level="M" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] text-muted-foreground font-mono truncate">{getTrackingUrl(entry.trackingNumber)}</p>
                            <button
                              onClick={() => handleCopyLink(getTrackingUrl(entry.trackingNumber))}
                              className="mt-1 text-[10px] text-primary hover:underline flex items-center gap-1"
                            >
                              <Copy className="h-3 w-3" /> Copy Link
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">
            Tip: Share the tracking number with family or staff. No PHI is stored. Old entries auto-delete after ~48 hours.
          </p>
        </motion.div>

        {/* Account Management */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-foreground">Account Management</h2>
          <AdminAccountManagement />
        </motion.div>

        {/* V1 Implementation Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-foreground">V1 Implementation Roadmap</h2>
          <p className="text-sm text-muted-foreground">8-week delivery plan for the Version 1 Patient Transport Tracking Portal — 400 hours across infrastructure, development, testing, and go-live.</p>
          <V1ImplementationRoadmap />
        </motion.div>
      </main>
    </div>
  );
}
