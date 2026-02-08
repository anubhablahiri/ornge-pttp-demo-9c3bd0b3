import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Transport, getCurrentStatusIndex, isTransportComplete } from '@/data/mockTransports';
import { useApp } from '@/lib/i18n';
import { Plane, Truck } from 'lucide-react';

interface Props {
  transport: Transport;
}

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const originIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:28px;height:28px;background:#22c55e;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const destIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:28px;height:28px;background:#ef4444;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const vehicleIcon = (isAir: boolean) => new L.DivIcon({
  className: '',
  html: `<div style="width:34px;height:34px;background:hsl(22,90%,52%);border:3px solid white;border-radius:50%;box-shadow:0 2px 12px rgba(234,88,12,0.5);display:flex;align-items:center;justify-content:center;animation:pulse 2s infinite;">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      ${isAir
        ? '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.4-.1.9.3 1.1L11 12l-2 3H6l-1 1 3 2 2 3 1-1v-3l3-2 3.8 7.3c.2.4.7.5 1.1.3l.5-.3c.4-.2.6-.6.5-1.1z"/>'
        : '<path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>'
      }
    </svg>
  </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

function FitBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, bounds]);
  return null;
}

export default function TrackingMap({ transport }: Props) {
  const { t, lang } = useApp();
  const complete = isTransportComplete(transport);
  const isAir = transport.mode === 'air';

  const origin: [number, number] = [transport.originCoords.lat, transport.originCoords.lng];
  const dest: [number, number] = [transport.destinationCoords.lat, transport.destinationCoords.lng];
  const current: [number, number] | null = transport.currentPosition
    ? [transport.currentPosition.lat, transport.currentPosition.lng]
    : null;

  const bounds = L.latLngBounds([origin, dest]);
  if (current) bounds.extend(current);

  // Build route path: origin → current (if exists) → destination
  const routePath: [number, number][] = current ? [origin, current, dest] : [origin, dest];

  // Completed path (origin to current or full if complete)
  const completedPath: [number, number][] = complete
    ? routePath
    : current
    ? [origin, current]
    : [origin];

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

      <div className="relative w-full" style={{ height: '300px' }}>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.15); opacity: 0.85; }
          }
          .leaflet-container { background: hsl(var(--muted)); }
        `}</style>
        <MapContainer
          bounds={bounds}
          scrollWheelZoom={false}
          zoomControl={false}
          dragging={true}
          style={{ height: '100%', width: '100%' }}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          />
          <FitBounds bounds={bounds} />

          {/* Full route line (faded) */}
          <Polyline
            positions={routePath}
            pathOptions={{
              color: 'hsl(var(--muted-foreground))',
              weight: 2,
              opacity: 0.3,
              dashArray: '8 8',
            }}
          />

          {/* Completed portion */}
          {completedPath.length > 1 && (
            <Polyline
              positions={completedPath}
              pathOptions={{
                color: 'hsl(22, 90%, 52%)',
                weight: 3,
                opacity: 0.8,
              }}
            />
          )}

          {/* Origin marker */}
          <Marker position={origin} icon={originIcon} />

          {/* Destination marker */}
          <Marker position={dest} icon={destIcon} />

          {/* Vehicle marker */}
          {current && !complete && (
            <Marker position={current} icon={vehicleIcon(isAir)} />
          )}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 flex items-center gap-4 text-[11px] text-muted-foreground border-t border-border">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
          {lang === 'en' ? 'Origin' : 'Origine'}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
          {lang === 'en' ? 'Destination' : 'Destination'}
        </span>
        {current && !complete && (
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: 'hsl(22, 90%, 52%)' }} />
            {isAir ? (lang === 'en' ? 'Aircraft' : 'Aéronef') : (lang === 'en' ? 'Vehicle' : 'Véhicule')}
          </span>
        )}
      </div>
    </div>
  );
}
