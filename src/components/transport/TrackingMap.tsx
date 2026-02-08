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

  // Build OpenStreetMap embed URL centered on the route
  const centerLat = current
    ? current.lat
    : (origin.lat + dest.lat) / 2;
  const centerLng = current
    ? current.lng
    : (origin.lng + dest.lng) / 2;

  // Calculate zoom based on distance
  const latDiff = Math.abs(origin.lat - dest.lat);
  const lngDiff = Math.abs(origin.lng - dest.lng);
  const maxDiff = Math.max(latDiff, lngDiff);
  const zoom = maxDiff > 5 ? 5 : maxDiff > 2 ? 6 : maxDiff > 1 ? 8 : 10;

  // Build marker params for OSM
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${Math.min(origin.lng, dest.lng) - 1},${Math.min(origin.lat, dest.lat) - 0.5},${Math.max(origin.lng, dest.lng) + 1},${Math.max(origin.lat, dest.lat) + 0.5}&layer=mapnik&marker=${centerLat},${centerLng}`;

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

      <div className="relative w-full" style={{ height: '280px' }}>
        <iframe
          title="Transport Map"
          src={embedUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Overlay markers */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* We overlay facility labels at bottom */}
        </div>
      </div>

      {/* Legend with facility names */}
      <div className="px-5 py-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground border-t border-border">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block shrink-0" />
          <span className="truncate">{transport.originFacility}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shrink-0" />
          <span className="truncate">{transport.destinationFacility}</span>
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
