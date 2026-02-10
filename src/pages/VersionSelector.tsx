import { useNavigate } from 'react-router-dom';
import orngeLogo from '@/assets/ornge-logo.png';
import { Plane } from 'lucide-react';

const versions = [
  {
    id: 'v1',
    title: 'Version 1',
    subtitle: 'Original Family Portal',
    description: 'Simple tracking interface with admin panel, FAQ, and 5-stage timeline. Dark navy theme.',
    path: '/v1',
    status: 'Complete',
  },
  {
    id: 'v2',
    title: 'Version 2',
    subtitle: 'Enhanced Portal',
    description: 'Refined card-based UI with 7-stage timeline, real-time notifications, and QR sharing. Light theme.',
    path: '/v2',
    status: 'Complete',
  },
  {
    id: 'v3',
    title: 'Version 3',
    subtitle: 'Multi-Platform Experience',
    description: 'Full-featured platform with device-aware views, live maps, 10-stage timeline, bilingual support, and operations dashboard.',
    path: '/v3',
    status: 'Current',
  },
];

export default function VersionSelector() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-[hsl(224,70%,35%)] flex flex-col">
      {/* Header */}
      <header className="py-6 px-8 flex items-center justify-center border-b border-[hsl(220,13%,91%)]">
        <img src={orngeLogo} alt="Ornge" className="h-10" />
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[hsl(224,70%,35%)] flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display">
            Family Transport Tracking Portal
          </h1>
        </div>
        <p className="text-[hsl(215,16%,47%)] text-center mb-12 max-w-lg">
          Select a prototype version to explore
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {versions.map((v) => (
            <button
              key={v.id}
              onClick={() => navigate(v.path)}
              className="group relative text-left rounded-2xl border p-6 transition-all duration-200 border-[hsl(220,13%,91%)] hover:border-[hsl(22,90%,54%)] hover:shadow-[0_0_30px_-10px_hsl(22,90%,54%/0.25)] cursor-pointer bg-white"
            >
              {/* Status badge */}
              <span
                className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full mb-4 ${
                  v.status === 'Current'
                    ? 'bg-[hsl(22,90%,54%/0.1)] text-[hsl(22,90%,54%)]'
                    : v.status === 'Complete'
                    ? 'bg-[hsl(152,60%,40%/0.1)] text-[hsl(152,60%,40%)]'
                    : 'bg-[hsl(220,14%,94%)] text-[hsl(215,16%,47%)]'
                }`}
              >
                {v.status}
              </span>

              <h2 className="text-xl font-bold text-[hsl(224,70%,35%)] mb-1">{v.title}</h2>
              <p className="text-sm text-[hsl(22,90%,54%)] font-medium mb-3">{v.subtitle}</p>
              <p className="text-sm text-[hsl(215,16%,47%)] leading-relaxed">{v.description}</p>

              <div className="mt-5 text-sm font-semibold text-[hsl(22,90%,54%)] group-hover:translate-x-1 transition-transform">
                Explore →
              </div>
            </button>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
