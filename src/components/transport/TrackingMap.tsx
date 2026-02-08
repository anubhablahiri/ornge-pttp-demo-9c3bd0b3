import { Transport, getCurrentStatusIndex, isTransportComplete } from '@/data/mockTransports';
import { useApp } from '@/lib/i18n';
import ontarioMap from '@/assets/ontario-map.png';

interface Props {
  transport: Transport;
}

// Ontario bounding box (approximate) mapped to the image
const MAP_BOUNDS = {
  minLat: 41.5,
  maxLat: 51.0,
  minLng: -95.0,
  maxLng: -74.0,
};

function toPercent(lat: number, lng: number) {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;
  const y = (1 - (lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
  return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
}

export default function TrackingMap({ transport }: Props) {
  const { t, lang } = useApp();
  const complete = isTransportComplete(transport);
  const isAir = transport.mode === 'air';

  const origin = toPercent(transport.originCoords.lat, transport.originCoords.lng);
  const dest = toPercent(transport.destinationCoords.lat, transport.destinationCoords.lng);
  const current = transport.currentPosition
    ? toPercent(transport.currentPosition.lat, transport.currentPosition.lng)
    : null;

  const progress = current
    ? Math.sqrt((current.x - origin.x) ** 2 + (current.y - origin.y) ** 2) /
      Math.sqrt((dest.x - origin.x) ** 2 + (dest.y - origin.y) ** 2)
    : complete ? 1 : 0;

  // Curved path
  const midX = (origin.x + dest.x) / 2;
  const midY = Math.min(origin.y, dest.y) - 8;
  const curvePath = `M${origin.x},${origin.y} Q${midX},${midY} ${dest.x},${dest.y}`;

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

      <div className="relative w-full overflow-hidden" style={{ height: '260px' }}>
        {/* Map background image */}
        <img
          src={ontarioMap}
          alt="Ontario map"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* SVG overlay */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ pointerEvents: 'none' }}
        >
          {/* Dashed full route */}
          <path
            d={curvePath}
            fill="none"
            stroke="#64748b"
            strokeWidth="0.5"
            strokeDasharray="1.5 1"
            opacity="0.5"
          />

          {/* Completed route */}
          <path
            d={curvePath}
            fill="none"
            stroke="#ea580c"
            strokeWidth="0.8"
            opacity="0.9"
            strokeLinecap="round"
            strokeDasharray={`${progress * 150} 999`}
          />

          {/* Origin pin */}
          <circle cx={origin.x} cy={origin.y} r="1.8" fill="#16a34a" stroke="white" strokeWidth="0.6" />
          <circle cx={origin.x} cy={origin.y} r="3" fill="none" stroke="#16a34a" strokeWidth="0.25" opacity="0.5">
            <animate attributeName="r" values="3;4.5;3" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.15;0.5" dur="3s" repeatCount="indefinite" />
          </circle>

          {/* Destination pin */}
          <circle cx={dest.x} cy={dest.y} r="1.8" fill="#dc2626" stroke="white" strokeWidth="0.6" />
          <circle cx={dest.x} cy={dest.y} r="3" fill="none" stroke="#dc2626" strokeWidth="0.25" opacity="0.5">
            <animate attributeName="r" values="3;4.5;3" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.15;0.5" dur="3s" repeatCount="indefinite" />
          </circle>

          {/* Vehicle marker */}
          {current && !complete && (
            <>
              <circle cx={current.x} cy={current.y} r="3" fill="#ea580c" opacity="0.15">
                <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx={current.x} cy={current.y} r="2" fill="#ea580c" stroke="white" strokeWidth="0.6" />
              <text x={current.x} y={current.y + 0.6} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="1.8" fontWeight="bold">
                {isAir ? '✈' : '⛑'}
              </text>
            </>
          )}
        </svg>

        {/* Origin label (HTML for better rendering) */}
        <div
          className="absolute text-[10px] font-semibold text-foreground bg-card/90 backdrop-blur-sm px-1.5 py-0.5 rounded shadow-sm border border-border whitespace-nowrap"
          style={{ left: `${origin.x}%`, top: `${origin.y + 4}%`, transform: 'translateX(-50%)' }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-600 mr-1 align-middle" />
          {transport.originFacility.length > 25
            ? transport.originFacility.slice(0, 22) + '…'
            : transport.originFacility}
        </div>

        {/* Destination label */}
        <div
          className="absolute text-[10px] font-semibold text-foreground bg-card/90 backdrop-blur-sm px-1.5 py-0.5 rounded shadow-sm border border-border whitespace-nowrap"
          style={{ left: `${dest.x}%`, top: `${dest.y + 4}%`, transform: 'translateX(-50%)' }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600 mr-1 align-middle" />
          {transport.destinationFacility.length > 25
            ? transport.destinationFacility.slice(0, 22) + '…'
            : transport.destinationFacility}
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground border-t border-border">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block shrink-0" />
          <span>{lang === 'en' ? 'Origin' : 'Origine'}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block shrink-0" />
          <span>{lang === 'en' ? 'Destination' : 'Destination'}</span>
        </span>
        {current && !complete && (
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ background: '#ea580c' }} />
            {isAir ? (lang === 'en' ? 'Aircraft' : 'Aéronef') : (lang === 'en' ? 'Vehicle' : 'Véhicule')}
          </span>
        )}
      </div>
    </div>
  );
}
