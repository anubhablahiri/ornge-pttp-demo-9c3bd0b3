import { Transport, getCurrentStatusIndex, isTransportComplete } from '@/data/mockTransports';
import { useApp } from '@/lib/i18n';

interface Props {
  transport: Transport;
}

export default function TrackingMap({ transport }: Props) {
  const { t, lang } = useApp();
  const complete = isTransportComplete(transport);
  const isAir = transport.mode === 'air';

  const origin = transport.originCoords;
  const dest = transport.destinationCoords;
  const current = transport.currentPosition;

  // Normalize coordinates to SVG space
  const allPoints = [origin, dest, ...(current ? [current] : [])];
  const minLat = Math.min(...allPoints.map((p) => p.lat)) - 1;
  const maxLat = Math.max(...allPoints.map((p) => p.lat)) + 1;
  const minLng = Math.min(...allPoints.map((p) => p.lng)) - 2;
  const maxLng = Math.max(...allPoints.map((p) => p.lng)) + 2;

  const toX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * 100;
  const toY = (lat: number) => 100 - ((lat - minLat) / (maxLat - minLat)) * 100; // flip Y

  const ox = toX(origin.lng), oy = toY(origin.lat);
  const dx = toX(dest.lng), dy = toY(dest.lat);
  const cx = current ? toX(current.lng) : null;
  const cy = current ? toY(current.lat) : null;

  // Curved path control point
  const midX = (ox + dx) / 2;
  const midY = Math.min(oy, dy) - 12;
  const curvePath = `M${ox},${oy} Q${midX},${midY} ${dx},${dy}`;

  // Completed curve (approximate to current position)
  const progress = cx !== null && cy !== null
    ? Math.sqrt((cx - ox) ** 2 + (cy - oy) ** 2) / Math.sqrt((dx - ox) ** 2 + (dy - oy) ** 2)
    : complete ? 1 : 0;

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {lang === 'en' ? 'Live Map' : 'Carte en direct'}
        </h3>
        {isAir && transport.altitude && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {t('dash.alt')} {transport.altitude.toLocaleString()} ft
          </span>
        )}
      </div>

      <div className="relative w-full" style={{ height: '240px' }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
          style={{ background: 'hsl(var(--muted) / 0.3)' }}
        >
          {/* Grid lines for map feel */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(var(--border))" strokeWidth="0.15" opacity="0.6" />
            </pattern>
            {/* Gradient for land mass */}
            <radialGradient id="land1" cx="40%" cy="50%" r="45%">
              <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="land2" cx="70%" cy="35%" r="30%">
              <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.4" />
              <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background */}
          <rect width="100" height="100" fill="hsl(var(--background))" />
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Abstract land masses */}
          <ellipse cx="40" cy="50" rx="35" ry="40" fill="url(#land1)" />
          <ellipse cx="70" cy="35" rx="25" ry="20" fill="url(#land2)" />
          <ellipse cx="25" cy="30" rx="15" ry="12" fill="hsl(var(--muted))" opacity="0.2" />
          <ellipse cx="60" cy="70" rx="20" ry="15" fill="hsl(var(--muted))" opacity="0.15" />

          {/* Dashed full route */}
          <path
            d={curvePath}
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="0.6"
            strokeDasharray="2 1.5"
            opacity="0.4"
          />

          {/* Completed route (solid) */}
          <path
            d={curvePath}
            fill="none"
            stroke="hsl(22, 90%, 52%)"
            strokeWidth="0.8"
            opacity="0.85"
            strokeLinecap="round"
            strokeDasharray={`${progress * 150} 999`}
          />

          {/* Origin marker */}
          <circle cx={ox} cy={oy} r="2.5" fill="#22c55e" stroke="white" strokeWidth="0.8" />
          <circle cx={ox} cy={oy} r="4" fill="none" stroke="#22c55e" strokeWidth="0.3" opacity="0.4" />

          {/* Destination marker */}
          <circle cx={dx} cy={dy} r="2.5" fill="#ef4444" stroke="white" strokeWidth="0.8" />
          <circle cx={dx} cy={dy} r="4" fill="none" stroke="#ef4444" strokeWidth="0.3" opacity="0.4" />

          {/* Vehicle marker (if in transit) */}
          {cx !== null && cy !== null && !complete && (
            <>
              <circle cx={cx} cy={cy} r="3.5" fill="hsl(22, 90%, 52%)" stroke="white" strokeWidth="0.8" opacity="0.2">
                <animate attributeName="r" values="3.5;5.5;3.5" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.25;0.08;0.25" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx={cx} cy={cy} r="2.8" fill="hsl(22, 90%, 52%)" stroke="white" strokeWidth="0.8" />
              <text x={cx} y={cy! + 0.8} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="2.5" fontWeight="bold">
                {isAir ? '✈' : '⛑'}
              </text>
            </>
          )}

          {/* Origin label */}
          <text x={ox} y={oy + 5} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="2.2" fontWeight="600" opacity="0.7">
            {transport.originFacility.split(' ').slice(0, 2).join(' ')}
          </text>

          {/* Destination label */}
          <text x={dx} y={dy + 5} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="2.2" fontWeight="600" opacity="0.7">
            {transport.destinationFacility.split(' ').slice(0, 2).join(' ')}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground border-t border-border">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block shrink-0" />
          <span className="truncate">{lang === 'en' ? 'Origin' : 'Origine'}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shrink-0" />
          <span className="truncate">{lang === 'en' ? 'Destination' : 'Destination'}</span>
        </span>
        {current && !complete && (
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ background: 'hsl(22, 90%, 52%)' }} />
            {isAir ? (lang === 'en' ? 'Aircraft' : 'Aéronef') : (lang === 'en' ? 'Vehicle' : 'Véhicule')}
          </span>
        )}
      </div>
    </div>
  );
}
