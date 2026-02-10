import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STATUSES = [
  'Preparing for transport',
  'En route to patient pickup',
  'With patient',
  'En Route to patient dropoff',
  'Arrived at destination',
];

const HOSPITALS = [
  'Trillium Health Partners – Credit Valley Hospital',
  'Trillium Health Partners – Mississauga Hospital',
  'Unity Health Toronto – St. Joseph\'s Health Centre',
  'Unity Health Toronto – St. Michael\'s Hospital',
  'University Health Network – Princess Margaret Cancer Centre',
  'University Health Network – Toronto General Hospital',
  'University Health Network – Toronto Western Hospital',
  'William Osler Health System – Brampton Civic Hospital',
  'William Osler Health System – Etobicoke General Hospital',
  'Windsor Regional Hospital – Met Campus',
  'Windsor Regional Hospital – Ouellette Campus',
];

const SPECIAL_MESSAGES = [
  '',
  'Medical Delay: ETA will be posted upon significant event. Thank you for your understanding.',
  'Weather Delay: ETA will be posted upon significant event. Thank you for your understanding.',
];

interface Transport {
  id: string;
  trackingNumber: string;
  missionNumber: string;
  status: string;
  lastUpdated: string;
  eta: string;
  destination: string;
  specialMessage: string;
  notes: string;
}

function generateTrackingNumber() {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
}

export default function V1Admin() {
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState(generateTrackingNumber());
  const [missionNumber, setMissionNumber] = useState('');
  const [status, setStatus] = useState(STATUSES[0]);
  const [eta, setEta] = useState('');
  const [destination, setDestination] = useState('');
  const [hospitalFilter, setHospitalFilter] = useState('');
  const [specialMessage, setSpecialMessage] = useState('');
  const [notes, setNotes] = useState('');
  const [transports, setTransports] = useState<Transport[]>([
    {
      id: '1',
      trackingNumber: '0877248692653397',
      missionNumber: '1000',
      status: 'Preparing for transport',
      lastUpdated: '2/9/2026, 11:03:27 AM',
      eta: 'TBD',
      destination: 'Windsor Regional Hospital – Ouellette Campus',
      specialMessage: '',
      notes: '',
    },
    {
      id: '2',
      trackingNumber: '0987997083725079',
      missionNumber: '3000',
      status: 'With patient',
      lastUpdated: '2/9/2026, 11:04:23 AM',
      eta: 'Feb 09, 2026, 04:10 PM',
      destination: 'Toronto General Hospital',
      specialMessage: '',
      notes: '',
    },
    {
      id: '3',
      trackingNumber: '2260461044312368',
      missionNumber: '2000',
      status: 'En route to patient pickup',
      lastUpdated: '2/9/2026, 11:03:59 AM',
      eta: 'Feb 09, 2026, 01:06 PM',
      destination: 'Brampton Civic Hospital',
      specialMessage: '',
      notes: '',
    },
  ]);

  const filteredHospitals = hospitalFilter
    ? HOSPITALS.filter((h) => h.toLowerCase().includes(hospitalFilter.toLowerCase()))
    : HOSPITALS;

  const handleSave = () => {
    const newTransport: Transport = {
      id: Date.now().toString(),
      trackingNumber,
      missionNumber,
      status,
      lastUpdated: new Date().toLocaleString(),
      eta: eta || 'TBD',
      destination,
      specialMessage,
      notes,
    };
    setTransports([newTransport, ...transports]);
    setTrackingNumber(generateTrackingNumber());
    setMissionNumber('');
    setEta('');
    setNotes('');
  };

  const handleDelete = (id: string) => {
    setTransports(transports.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold">
            Family Portal Admin<span className="text-[hsl(22,90%,54%)]">.</span>
          </h1>
          <button
            onClick={() => navigate('/v1')}
            className="text-sm text-[hsl(212,80%,60%)] hover:text-[hsl(212,80%,70%)] font-medium transition-colors"
          >
            Home
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-10">
          {/* Row 1: Tracking, Generate, Mission, Status */}
          <div className="flex flex-wrap gap-3 items-end">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="bg-[hsl(220,20%,14%)] border border-[hsl(220,14%,20%)] rounded-lg px-4 py-2.5 text-white w-56 focus:outline-none focus:border-[hsl(22,90%,54%)]"
            />
            <button
              onClick={() => setTrackingNumber(generateTrackingNumber())}
              className="px-5 py-2.5 bg-[hsl(22,90%,54%)] hover:bg-[hsl(22,90%,48%)] text-white font-semibold rounded-lg transition-colors"
            >
              Generate
            </button>
            <input
              type="text"
              value={missionNumber}
              onChange={(e) => setMissionNumber(e.target.value)}
              placeholder="Mission #"
              className="bg-[hsl(220,20%,14%)] border border-[hsl(220,14%,20%)] rounded-lg px-4 py-2.5 text-white w-36 placeholder:text-[hsl(215,20%,40%)] focus:outline-none focus:border-[hsl(22,90%,54%)]"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-[hsl(220,20%,14%)] border border-[hsl(220,14%,20%)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[hsl(22,90%,54%)]"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Row 2: ETA, Save, Share QR */}
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[hsl(215,20%,65%)]">ETA</span>
              <input
                type="datetime-local"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                className="bg-[hsl(220,20%,14%)] border border-[hsl(220,14%,20%)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[hsl(22,90%,54%)]"
              />
            </div>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-[hsl(22,90%,54%)] hover:bg-[hsl(22,90%,48%)] text-white font-semibold rounded-lg transition-colors"
            >
              Save / Update
            </button>
            <button className="px-5 py-2.5 bg-[hsl(220,20%,14%)] border border-[hsl(220,14%,20%)] hover:border-[hsl(220,14%,28%)] text-white font-medium rounded-lg transition-colors">
              Share QR
            </button>
          </div>

          {/* Row 3: Filter + Hospital */}
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[hsl(215,20%,65%)]">Filter:</span>
              <input
                type="text"
                value={hospitalFilter}
                onChange={(e) => setHospitalFilter(e.target.value)}
                placeholder="Type to filter hospitals"
                className="bg-[hsl(220,20%,14%)] border border-[hsl(220,14%,20%)] rounded-lg px-4 py-2.5 text-white placeholder:text-[hsl(215,20%,40%)] w-56 focus:outline-none focus:border-[hsl(22,90%,54%)]"
              />
            </div>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-[hsl(220,20%,14%)] border border-[hsl(220,14%,20%)] rounded-lg px-4 py-2.5 text-white flex-1 min-w-[280px] focus:outline-none focus:border-[hsl(22,90%,54%)]"
            >
              <option value="">Destination (Ontario hospitals)…</option>
              {filteredHospitals.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
              <option value="other">Other (type…)</option>
            </select>
          </div>

          {/* Row 4: Special message */}
          <select
            value={specialMessage}
            onChange={(e) => setSpecialMessage(e.target.value)}
            className="bg-[hsl(220,20%,14%)] border border-[hsl(220,14%,20%)] rounded-lg px-4 py-2.5 text-white w-full max-w-xl focus:outline-none focus:border-[hsl(22,90%,54%)]"
          >
            <option value="">Special message… (optional)</option>
            {SPECIAL_MESSAGES.filter(Boolean).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Row 5: Notes textarea */}
          <div>
            <label className="text-sm text-[hsl(212,80%,60%)] mb-1 block">Special message (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Short note that will appear on the family status page when present."
              rows={3}
              className="w-full bg-[hsl(220,20%,14%)] border border-[hsl(220,14%,20%)] rounded-lg px-4 py-3 text-white placeholder:text-[hsl(215,20%,40%)] focus:outline-none focus:border-[hsl(22,90%,54%)] resize-y"
            />
          </div>
        </div>

        {/* Tracking Table */}
        <h2 className="text-xl font-bold mb-4">Tracking Table</h2>
        <div className="overflow-x-auto rounded-xl border border-[hsl(220,14%,20%)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[hsl(220,20%,14%)] border-b border-[hsl(220,14%,20%)]">
                <th className="text-left px-4 py-3 font-semibold text-[hsl(212,80%,60%)]">Tracking #</th>
                <th className="text-left px-4 py-3 font-semibold text-[hsl(212,80%,60%)]">Mission #</th>
                <th className="text-left px-4 py-3 font-semibold text-[hsl(212,80%,60%)]">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-[hsl(212,80%,60%)]">Last Updated</th>
                <th className="text-left px-4 py-3 font-semibold text-[hsl(212,80%,60%)]">ETA</th>
                <th className="text-left px-4 py-3 font-semibold text-[hsl(212,80%,60%)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transports.map((t) => (
                <tr key={t.id} className="border-b border-[hsl(220,14%,20%)] hover:bg-[hsl(220,20%,14%/0.5)]">
                  <td className="px-4 py-4 text-white font-mono">{t.trackingNumber}</td>
                  <td className="px-4 py-4 text-white">{t.missionNumber}</td>
                  <td className="px-4 py-4 text-white">{t.status}</td>
                  <td className="px-4 py-4 text-[hsl(215,20%,65%)]">{t.lastUpdated}</td>
                  <td className="px-4 py-4 text-[hsl(215,20%,65%)]">{t.eta}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-[hsl(220,20%,18%)] border border-[hsl(220,14%,25%)] text-white text-xs font-medium rounded hover:bg-[hsl(220,20%,22%)] transition-colors">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="px-3 py-1.5 bg-[hsl(22,90%,54%)] text-white text-xs font-semibold rounded hover:bg-[hsl(22,90%,48%)] transition-colors"
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

        <p className="mt-4 text-xs text-[hsl(215,20%,50%)]">
          Tip: Share the tracking number with family or staff. No PHI is stored. Old entries auto-delete after ~48 hours.
        </p>
      </div>
    </div>
  );
}
