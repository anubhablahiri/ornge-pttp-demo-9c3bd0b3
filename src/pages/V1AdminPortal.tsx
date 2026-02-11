import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, Trash2, Pencil } from 'lucide-react';

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
    'bg-[hsl(220,25%,14%)] border border-[hsl(220,14%,25%)] rounded-lg px-4 py-2.5 text-sm text-[hsl(210,40%,96%)] placeholder:text-[hsl(215,20%,45%)] focus:outline-none focus:border-[hsl(22,90%,54%)] transition-colors';
  const selectClass =
    'bg-[hsl(220,25%,14%)] border border-[hsl(220,14%,25%)] rounded-lg px-4 py-2.5 text-sm text-[hsl(210,40%,96%)] focus:outline-none focus:border-[hsl(22,90%,54%)] transition-colors appearance-none cursor-pointer';

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] text-[hsl(210,40%,96%)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[hsl(220,20%,11%)]/95 backdrop-blur-sm border-b border-[hsl(220,14%,20%)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">
            Family Portal Admin<span className="text-[hsl(22,90%,54%)]">.</span>
          </span>
          <Link to="/v1" className="text-[hsl(22,90%,54%)] hover:underline text-sm font-medium">
            Home
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-4"
        >
          {/* Row 1: Tracking #, Generate, Mission #, Status */}
          <div className="flex flex-wrap gap-3 items-center">
            <input
              className={`${inputClass} w-64`}
              placeholder="Tracking number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              className="bg-[hsl(22,90%,54%)] hover:bg-[hsl(22,90%,48%)] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              Generate
            </button>
            <input
              className={`${inputClass} w-40`}
              placeholder="Mission #"
              value={missionNumber}
              onChange={(e) => setMissionNumber(e.target.value)}
            />
            <select
              className={`${selectClass} w-64`}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Row 2: ETA, Save/Update, Share QR */}
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm text-[hsl(215,20%,65%)]">ETA</span>
            <input
              type="datetime-local"
              className={`${inputClass} w-64`}
              value={eta}
              onChange={(e) => setEta(e.target.value)}
            />
            <button
              onClick={handleSave}
              className="bg-[hsl(22,90%,54%)] hover:bg-[hsl(22,90%,48%)] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              Save / Update
            </button>
            <button className="bg-[hsl(220,20%,18%)] hover:bg-[hsl(220,20%,22%)] border border-[hsl(220,14%,25%)] text-[hsl(210,40%,96%)] font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
              Share QR
            </button>
          </div>

          {/* Row 3: Filter + Hospital */}
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm text-[hsl(215,20%,65%)]">Filter:</span>
            <input
              className={`${inputClass} w-64`}
              placeholder="Type to filter hospitals"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <select
              className={`${selectClass} flex-1 min-w-[280px]`}
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
            >
              {HOSPITALS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {/* Row 4: Special message + textarea */}
          <div className="space-y-3">
            <select
              className={`${selectClass} w-full max-w-2xl`}
              value={specialMessage}
              onChange={(e) => setSpecialMessage(e.target.value)}
            >
              <option value="">Special message… (optional)</option>
              {SPECIAL_MESSAGES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <textarea
              className={`${inputClass} w-full max-w-3xl h-24 resize`}
              placeholder="Additional notes…"
              value={specialMessage}
              onChange={(e) => setSpecialMessage(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Tracking Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
        >
          <h2 className="text-xl font-bold mb-4">Tracking Table</h2>
          <div className="overflow-x-auto rounded-xl border border-[hsl(220,14%,20%)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(220,20%,11%)] border-b border-[hsl(220,14%,20%)] text-[hsl(210,40%,96%)] font-semibold">
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
                    className="border-b border-[hsl(220,14%,20%)]/50 hover:bg-[hsl(220,20%,14%)] transition-colors"
                  >
                    <td className="px-5 py-4 font-mono text-sm">{entry.trackingNumber}</td>
                    <td className="px-5 py-4">{entry.missionNumber}</td>
                    <td className="px-5 py-4">{entry.status}</td>
                    <td className="px-5 py-4 text-[hsl(215,20%,65%)]">{entry.lastUpdated}</td>
                    <td className="px-5 py-4 text-[hsl(215,20%,65%)]">{entry.eta}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 bg-[hsl(220,20%,18%)] border border-[hsl(220,14%,25%)] rounded">
                          <QrCode className="h-4 w-4 text-[hsl(215,20%,65%)]" />
                        </button>
                        <button
                          onClick={() => handleEdit(entry)}
                          className="bg-[hsl(220,20%,22%)] hover:bg-[hsl(220,20%,28%)] border border-[hsl(220,14%,25%)] text-[hsl(210,40%,96%)] font-medium px-3 py-1.5 rounded text-xs transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="bg-[hsl(22,90%,54%)] hover:bg-[hsl(22,90%,48%)] text-white font-semibold px-3 py-1.5 rounded text-xs transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[hsl(215,20%,45%)] mt-3">
            Tip: Share the tracking number with family or staff. No PHI is stored. Old entries auto-delete after ~48 hours.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
