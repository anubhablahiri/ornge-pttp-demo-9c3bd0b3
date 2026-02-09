import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Transport, isTransportComplete } from '@/data/mockTransports';
import { useApp } from '@/lib/i18n';

interface Props {
  transport: Transport;
}

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const makeIcon = (color: string, size: number, pulse = false) =>
  new L.DivIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};border:3px solid white;border-radius:50%;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      ${pulse ? 'animation:tml-pulse 2s infinite;' : ''}
    "></div>
    <style>@keyframes tml-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.3);opacity:0.7}}</style>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

const originIcon = makeIcon('#1c4599', 24);
const destIcon = makeIcon('#16a34a', 24);

const helicopterSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 640 512" fill="white"><path d="M128 32c0-17.7 14.3-32 32-32H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H384v64h32c88.4 0 160 71.6 160 160v64c0 17.7-14.3 32-32 32H448c-17.7 0-32-14.3-32-32V256c0-17.7-14.3-32-32-32H320v128H192L64 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l128-128V128H160c-17.7 0-32-14.3-32-32zM384 128H320v96h64V128z"/></svg>`;

const vehicleIconAir = new L.DivIcon({
  className: '',
  html: `<div style="
    width:32px;height:32px;
    background:#ea580c;border:3px solid white;border-radius:50%;
    box-shadow:0 2px 8px rgba(0,0,0,0.3);
    display:flex;align-items:center;justify-content:center;
    animation:tml-pulse 2s infinite;
  ">${helicopterSvg}</div>
  <style>@keyframes tml-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.3);opacity:0.7}}</style>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});
const vehicleIconLand = makeIcon('#ea580c', 28, true);

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length >= 2) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [35, 35], maxZoom: 10 });
    }
  }, [map, points]);
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

  const allPoints: [number, number][] = [origin, dest, ...(current ? [current] : [])];
  const routePath: [number, number][] = current ? [origin, current, dest] : [origin, dest];
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
        <MapContainer
          center={[46, -82]}
          zoom={5}
          scrollWheelZoom={false}
          zoomControl={true}
          dragging={true}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OSM &copy; CARTO'
          />
          <FitBounds points={allPoints} />

          {/* Full route (dashed) */}
          <Polyline
            positions={routePath}
            pathOptions={{ color: '#ea580c', weight: 2, opacity: 0.5, dashArray: '8 8' }}
          />

          {/* Completed portion (solid) */}
          {completedPath.length > 1 && (
            <Polyline
              positions={completedPath}
              pathOptions={{ color: '#ea580c', weight: 3, opacity: 0.9 }}
            />
          )}

          <Marker position={origin} icon={originIcon} />
          <Marker position={dest} icon={destIcon} />
          {current && !complete && (
            <Marker position={current} icon={isAir ? vehicleIconAir : vehicleIconLand} />
          )}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground border-t border-border">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ background: '#1c4599' }} />
          {lang === 'en' ? 'Origin' : 'Origine'}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block shrink-0" />
          {lang === 'en' ? 'Destination' : 'Destination'}
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
