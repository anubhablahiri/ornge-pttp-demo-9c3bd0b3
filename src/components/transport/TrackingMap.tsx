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
        >
          <defs>
            {/* Water pattern */}
            <pattern id="water" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="4" height="4" fill="#d4e8f0" />
              <path d="M0 2 Q1 1.5 2 2 T4 2" fill="none" stroke="#c0dce8" strokeWidth="0.15" />
            </pattern>
            {/* Road dash */}
            <pattern id="roadDash" width="2" height="1" patternUnits="userSpaceOnUse">
              <rect width="1.2" height="0.2" y="0.4" fill="#bbb" />
            </pattern>
          </defs>

          {/* Water background (Great Lakes / generic water) */}
          <rect width="100" height="100" fill="url(#water)" />

          {/* Ontario land mass - rough shape */}
          <path d="
            M5,15 C8,12 15,8 25,10 C35,12 40,8 50,10 C55,11 58,15 62,14
            C68,12 75,15 80,18 C85,21 88,28 90,35 C92,42 95,48 93,55
            C91,62 88,68 85,72 C82,76 78,78 72,80 C66,82 60,85 55,88
            C50,90 45,92 38,90 C30,88 25,85 20,80 C15,75 12,68 10,60
            C8,52 6,45 5,38 C4,30 4,22 5,15 Z
          " fill="#e8e4da" stroke="#d0cbc0" strokeWidth="0.3" />

          {/* Northern terrain (forests) */}
          <path d="
            M10,18 C15,15 22,12 30,14 C38,16 42,13 48,15 C52,16 55,20 50,22
            C45,24 40,22 35,24 C28,26 20,25 15,22 C12,20 10,20 10,18 Z
          " fill="#c8d4b0" opacity="0.5" />
          <path d="
            M50,14 C56,12 62,15 68,18 C72,20 70,24 65,23 C60,22 55,20 52,18
            C50,16 48,16 50,14 Z
          " fill="#c8d4b0" opacity="0.4" />

          {/* Lake shapes carved out */}
          <ellipse cx="18" cy="55" rx="10" ry="14" fill="url(#water)" /> {/* Lake Huron */}
          <ellipse cx="42" cy="78" rx="14" ry="8" fill="url(#water)" /> {/* Lake Erie */}
          <ellipse cx="65" cy="68" rx="10" ry="6" fill="url(#water)" /> {/* Lake Ontario */}
          <ellipse cx="8" cy="35" rx="6" ry="10" fill="url(#water)" /> {/* Georgian Bay */}

          {/* Grid lines (lat/lng feel) */}
          {[20, 40, 60, 80].map((v) => (
            <g key={v}>
              <line x1={v} y1="0" x2={v} y2="100" stroke="#b8c8d0" strokeWidth="0.12" opacity="0.4" />
              <line x1="0" y1={v} x2="100" y2={v} stroke="#b8c8d0" strokeWidth="0.12" opacity="0.4" />
            </g>
          ))}

          {/* Highway lines */}
          <path d="M25,65 C30,60 40,55 50,50 C55,47 60,48 68,52 C75,55 80,50 85,45" fill="none" stroke="#ccc" strokeWidth="0.4" opacity="0.5" />
          <path d="M30,70 C35,68 45,65 55,62 C60,60 65,58 72,60" fill="none" stroke="#ccc" strokeWidth="0.3" opacity="0.4" />
          <path d="M15,40 C20,38 28,42 35,45 C42,48 48,50 50,50" fill="none" stroke="#ccc" strokeWidth="0.3" opacity="0.4" />

          {/* City dots */}
          {[
            { x: 68, y: 52, name: 'Toronto' },
            { x: 60, y: 58, name: 'Hamilton' },
            { x: 50, y: 50, name: 'London' },
            { x: 85, y: 42, name: 'Ottawa' },
            { x: 22, y: 22, name: 'Sudbury' },
            { x: 12, y: 15, name: 'Thunder Bay' },
            { x: 55, y: 55, name: 'Kitchener' },
            { x: 72, y: 60, name: 'Niagara' },
          ].map((city) => (
            <g key={city.name}>
              <circle cx={city.x} cy={city.y} r="0.8" fill="#999" opacity="0.5" />
              <text x={city.x + 1.5} y={city.y + 0.5} fontSize="1.8" fill="#888" opacity="0.5">{city.name}</text>
            </g>
          ))}

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

          {/* Vehicle marker */}
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
          <rect x={ox - 12} y={oy + 3.5} width="24" height="3.5" rx="0.5" fill="white" opacity="0.75" />
          <text x={ox} y={oy + 5.5} textAnchor="middle" fill="#333" fontSize="2" fontWeight="600">
            {transport.originFacility.split(' ').slice(0, 3).join(' ')}
          </text>

          {/* Destination label */}
          <rect x={dx - 12} y={dy + 3.5} width="24" height="3.5" rx="0.5" fill="white" opacity="0.75" />
          <text x={dx} y={dy + 5.5} textAnchor="middle" fill="#333" fontSize="2" fontWeight="600">
            {transport.destinationFacility.split(' ').slice(0, 3).join(' ')}
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
