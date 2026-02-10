import { useParams, useNavigate } from 'react-router-dom';

const MILESTONES = [
  'Preparing for transport',
  'En route to patient pickup',
  'With patient',
  'En Route to patient dropoff',
  'Arrived at destination',
];

// Mock data keyed by tracking number
const mockData: Record<string, {
  destination: string;
  lastUpdated: string;
  eta: string;
  statusIndex: number;
  statusLabel: string;
  statusDescription: string;
  specialMessage?: string;
}> = {
  '5725497746660201': {
    destination: 'Windsor Regional Hospital – Ouellette Campus',
    lastUpdated: '2/9/2026, 2:16:28 PM',
    eta: 'TBD',
    statusIndex: 0,
    statusLabel: 'Preparing for transport',
    statusDescription: 'The team is preparing for transport.',
    specialMessage: 'Weather Delay: ETA will be posted upon significant event. Thank you for your understanding.',
  },
};

const DEFAULT_DATA = {
  destination: 'Toronto General Hospital',
  lastUpdated: new Date().toLocaleString(),
  eta: 'TBD',
  statusIndex: 1,
  statusLabel: 'En route to patient pickup',
  statusDescription: 'The transport crew is en route to pick up the patient.',
  specialMessage: undefined as string | undefined,
};

export default function V1Status() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const data = (id && mockData[id]) || DEFAULT_DATA;

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">
            Family Portal<span className="text-[hsl(22,90%,54%)]">.</span>
          </h1>
          <button
            onClick={() => navigate('/v1')}
            className="text-sm text-[hsl(212,80%,60%)] hover:text-[hsl(212,80%,70%)] font-medium transition-colors"
          >
            Change Tracking #
          </button>
        </div>

        {/* Info row */}
        <div className="flex flex-wrap gap-3 mb-6 items-center justify-center">
          <span className="bg-[hsl(22,90%,54%/0.2)] text-[hsl(22,90%,54%)] border border-[hsl(22,90%,54%/0.4)] rounded-full px-4 py-1.5 text-sm font-medium">
            Tracking Number: {id}
          </span>
          <span className="text-sm text-[hsl(215,20%,65%)]">
            Last Updated: {data.lastUpdated}
          </span>
          <span className="bg-[hsl(220,20%,14%)] border border-[hsl(220,14%,20%)] rounded-full px-4 py-1.5 text-sm">
            Destination: {data.destination}
          </span>
        </div>

        {/* ETA badge */}
        <div className="text-center mb-6">
          <span className="inline-block bg-[hsl(220,20%,14%)] border border-[hsl(220,14%,20%)] rounded-full px-4 py-1.5 text-sm">
            ETA: {data.eta}
          </span>
        </div>

        {/* Status */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold mb-1">{data.statusLabel}</h2>
          <p className="text-sm text-[hsl(215,20%,65%)]">{data.statusDescription}</p>
        </div>

        {/* Special message */}
        {data.specialMessage && (
          <div className="border-2 border-[hsl(22,90%,54%/0.5)] rounded-xl p-5 mb-8 bg-[hsl(220,20%,11%)] text-center">
            <h3 className="text-[hsl(22,90%,54%)] font-bold mb-2">Special message</h3>
            <p className="text-sm text-[hsl(215,20%,65%)]">{data.specialMessage}</p>
          </div>
        )}

        {/* Timeline */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Line */}
            <div className="absolute top-3 left-0 right-0 h-0.5 bg-[hsl(212,80%,60%)]" />

            {MILESTONES.map((m, i) => (
              <div key={i} className="relative flex flex-col items-center z-10" style={{ width: `${100 / MILESTONES.length}%` }}>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    i === data.statusIndex
                      ? 'bg-[hsl(22,90%,54%)] border-[hsl(22,90%,54%)] shadow-[0_0_10px_hsl(22,90%,54%/0.5)]'
                      : i < data.statusIndex
                      ? 'bg-[hsl(212,80%,60%)] border-[hsl(212,80%,60%)]'
                      : 'bg-[hsl(220,20%,14%)] border-[hsl(220,14%,25%)]'
                  }`}
                />
                <span className="text-[10px] text-[hsl(215,20%,65%)] text-center mt-2 leading-tight max-w-[90px]">
                  {m}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-[hsl(215,20%,50%)] text-center">
          Status updates are provided as soon as information becomes available. Timing may change due to care or operational needs.
        </p>
      </div>
    </div>
  );
}
