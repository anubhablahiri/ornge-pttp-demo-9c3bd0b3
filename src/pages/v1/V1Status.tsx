import { useParams, useNavigate } from 'react-router-dom';

const STATUSES = [
  'Preparing for transport',
  'En route to pickup',
  'With patient',
  'En route to destination',
  'Arrived',
];

const mockData: Record<string, { status: number; eta: string; destination: string }> = {
  '5725497746660201': { status: 0, eta: 'TBD', destination: 'Windsor Regional Hospital' },
};

export default function V1Status() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const data = (id && mockData[id]) || { status: 1, eta: 'TBD', destination: 'Toronto General Hospital' };

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold">
            Family Portal<span className="text-[hsl(22,90%,54%)]">.</span>
          </h1>
          <button
            onClick={() => navigate('/v1/family')}
            className="text-sm text-[hsl(215,20%,65%)] hover:text-white transition-colors"
          >
            Back
          </button>
        </div>

        <div className="bg-[hsl(220,20%,14%)] border border-[hsl(220,14%,20%)] rounded-xl p-6 space-y-4">
          <div className="text-sm text-[hsl(215,20%,65%)]">Tracking #: <span className="text-white font-mono">{id}</span></div>
          <div className="text-sm text-[hsl(215,20%,65%)]">Destination: <span className="text-white">{data.destination}</span></div>
          <div className="text-sm text-[hsl(215,20%,65%)]">ETA: <span className="text-white">{data.eta}</span></div>

          <hr className="border-[hsl(220,14%,20%)]" />

          <div className="space-y-2">
            {STATUSES.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  i < data.status ? 'bg-[hsl(212,80%,60%)]'
                    : i === data.status ? 'bg-[hsl(22,90%,54%)]'
                    : 'bg-[hsl(220,14%,25%)]'
                }`} />
                <span className={`text-sm ${i === data.status ? 'text-white font-medium' : 'text-[hsl(215,20%,65%)]'}`}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-xs text-[hsl(215,20%,50%)] text-center">
          Updates provided as information becomes available.
        </p>
      </div>
    </div>
  );
}
