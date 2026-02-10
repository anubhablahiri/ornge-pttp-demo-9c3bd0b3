import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const STATUSES = [
  'Preparing for transport',
  'En route to patient pickup',
  'With patient',
  'En Route to patient dropoff',
  'Arrived at destination',
];

const mockData: Record<string, { status: number; eta: string; destination: string; specialMessage?: string }> = {
  '5725497746660201': {
    status: 0,
    eta: 'TBD',
    destination: 'Windsor Regional Hospital – Ouellette Campus',
    specialMessage: 'Weather Delay: ETA will be posted upon significant event. Thank you for your understanding.',
  },
};

export default function V1Status() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const data = (id && mockData[id]) || { status: 1, eta: 'TBD', destination: 'Toronto General Hospital' };
  const lastUpdated = new Date().toLocaleString('en-US', {
    month: 'numeric', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true,
  });

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            Family Portal<span className="text-[hsl(22,90%,54%)]">.</span>
          </h1>
          <button
            onClick={() => navigate('/v1/family')}
            className="text-[hsl(212,80%,60%)] hover:text-[hsl(212,80%,70%)] transition-colors font-medium"
          >
            Change Tracking #
          </button>
        </div>

        {/* QR Code - centered at top */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white p-3 rounded-lg">
            <QRCodeSVG
              value={`${window.location.origin}/v1/status/${id}`}
              size={120}
              bgColor="#ffffff"
              fgColor="#0f1724"
            />
          </div>
          <p className="mt-2 text-xs text-[hsl(215,20%,55%)]">Scan to share this tracking page</p>
        </div>

        {/* Info pills row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <span className="px-4 py-1.5 rounded-full bg-[hsl(220,40%,25%)] text-sm text-[hsl(212,80%,70%)] border border-[hsl(220,40%,35%)]">
            Tracking Number: {id}
          </span>
          <span className="text-sm text-[hsl(215,20%,65%)]">
            Last Updated: {lastUpdated}
          </span>
          <span className="px-4 py-1.5 rounded-full bg-[hsl(220,40%,25%)] text-sm text-[hsl(212,80%,70%)] border border-[hsl(220,40%,35%)]">
            Destination: {data.destination}
          </span>
        </div>

        {/* ETA pill centered */}
        <div className="flex justify-center mb-6">
          <span className="px-5 py-1.5 rounded-full bg-[hsl(220,20%,14%)] text-sm border border-[hsl(220,14%,25%)]">
            ETA: {data.eta}
          </span>
        </div>

        {/* Current status */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-1">{STATUSES[data.status]}</h2>
          <p className="text-[hsl(215,20%,65%)]">The team is preparing for transport.</p>
        </div>

        {/* Special message */}
        {'specialMessage' in data && data.specialMessage && (
          <div className="rounded-xl border-2 border-[hsl(22,90%,54%)] bg-[hsl(220,20%,12%)] p-5 mb-8 text-center">
            <h3 className="text-[hsl(22,90%,54%)] font-bold text-lg mb-1">Special message</h3>
            <p className="text-[hsl(215,20%,75%)]">{data.specialMessage}</p>
          </div>
        )}

        {/* Horizontal timeline */}
        <div className="flex items-center justify-between mb-4 px-2">
          {STATUSES.map((s, i) => (
            <div key={i} className="flex flex-col items-center flex-1 relative">
              {/* Connector line */}
              {i < STATUSES.length - 1 && (
                <div className="absolute top-[10px] left-[calc(50%+10px)] right-[calc(-50%+10px)] flex items-center">
                  <div className={`h-[2px] w-full ${i < data.status ? 'bg-[hsl(212,80%,60%)]' : 'bg-[hsl(220,14%,30%)]'}`} />
                  <div className={`w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] ${i < data.status ? 'border-l-[hsl(212,80%,60%)]' : 'border-l-[hsl(220,14%,30%)]'}`} />
                </div>
              )}
              {/* Dot */}
              <div className={`w-5 h-5 rounded-full border-2 z-10 ${
                i === data.status
                  ? 'bg-[hsl(22,90%,54%)] border-[hsl(22,90%,54%)] shadow-[0_0_8px_hsl(22,90%,54%)]'
                  : i < data.status
                    ? 'bg-[hsl(212,80%,60%)] border-[hsl(212,80%,60%)]'
                    : 'bg-[hsl(220,20%,14%)] border-[hsl(220,14%,30%)]'
              }`} />
              <span className={`text-xs mt-2 text-center leading-tight max-w-[100px] ${
                i === data.status ? 'text-white font-medium' : 'text-[hsl(215,20%,55%)]'
              }`}>
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center mt-8 mb-6">
          <div className="bg-white p-3 rounded-lg">
            <QRCodeSVG
              value={`${window.location.origin}/v1/status/${id}`}
              size={120}
              bgColor="#ffffff"
              fgColor="#0f1724"
            />
          </div>
          <p className="mt-2 text-xs text-[hsl(215,20%,55%)]">Scan to share this tracking page</p>
        </div>

        {/* Footer note */}
        <p className="text-xs text-[hsl(215,20%,45%)] text-center">
          Status updates are provided as soon as information becomes available. Timing may change due to care or operational needs.
        </p>
      </div>
    </div>
  );
}
