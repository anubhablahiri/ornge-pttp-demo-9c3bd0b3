import { useNavigate } from 'react-router-dom';
import orngeLogoWhite from '@/assets/ornge-logo-white.png';

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
    description: 'Coming soon — improved design with additional features and refined UX.',
    path: '/v2',
    status: 'Coming Soon',
    disabled: true,
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
    <div className="min-h-screen bg-[hsl(220,20%,8%)] text-white flex flex-col">
      {/* Header */}
      <header className="py-6 px-8 flex items-center justify-center">
        <img src={orngeLogoWhite} alt="Ornge" className="h-10" />
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold font-display mb-2 text-center">
          Family Transport Tracking Portal
        </h1>
        <p className="text-[hsl(215,20%,65%)] text-center mb-12 max-w-lg">
          Select a prototype version to explore
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {versions.map((v) => (
            <button
              key={v.id}
              disabled={v.disabled}
              onClick={() => navigate(v.path)}
              className={`group relative text-left rounded-2xl border p-6 transition-all duration-200 ${
                v.disabled
                  ? 'border-[hsl(220,14%,20%)] opacity-50 cursor-not-allowed'
                  : 'border-[hsl(220,14%,20%)] hover:border-[hsl(22,90%,54%)] hover:shadow-[0_0_30px_-10px_hsl(22,90%,54%/0.3)] cursor-pointer'
              } bg-[hsl(220,20%,11%)]`}
            >
              {/* Status badge */}
              <span
                className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full mb-4 ${
                  v.status === 'Current'
                    ? 'bg-[hsl(22,90%,54%/0.15)] text-[hsl(22,90%,54%)]'
                    : v.status === 'Complete'
                    ? 'bg-[hsl(152,60%,35%/0.15)] text-[hsl(152,60%,40%)]'
                    : 'bg-[hsl(220,14%,18%)] text-[hsl(215,20%,65%)]'
                }`}
              >
                {v.status}
              </span>

              <h2 className="text-xl font-bold mb-1">{v.title}</h2>
              <p className="text-sm text-[hsl(22,90%,54%)] font-medium mb-3">{v.subtitle}</p>
              <p className="text-sm text-[hsl(215,20%,65%)] leading-relaxed">{v.description}</p>

              {!v.disabled && (
                <div className="mt-5 text-sm font-semibold text-[hsl(22,90%,54%)] group-hover:translate-x-1 transition-transform">
                  Explore →
                </div>
              )}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
