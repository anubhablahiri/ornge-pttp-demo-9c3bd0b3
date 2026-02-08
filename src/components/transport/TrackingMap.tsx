import { Transport, getCurrentStatusIndex, isTransportComplete } from '@/data/mockTransports';
import { useApp } from '@/lib/i18n';

interface Props {
  transport: Transport;
}

// Convert lat/lng to tile x/y at a given zoom
function latLngToTile(lat: number, lng: number, zoom: number) {
  const n = Math.pow(2, zoom);
  const x = ((lng + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return { x, y };
}

// Convert tile x/y back to lat/lng
function tileToLatLng(x: number, y: number, zoom: number) {
  const n = Math.pow(2, zoom);
  const lng = (x / n) * 360 - 180;
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)));
  const lat = (latRad * 180) / Math.PI;
  return { lat, lng };
}

export default function TrackingMap({ transport }: Props) {
  const { t, lang } = useApp();
  const complete = isTransportComplete(transport);
  const isAir = transport.mode === 'air';

  const origin = transport.originCoords;
  const dest = transport.destinationCoords;
  const current = transport.currentPosition;

  // Calculate bounds
  const allPoints = [origin, dest, ...(current ? [current] : [])];
  const minLat = Math.min(...allPoints.map((p) => p.lat));
  const maxLat = Math.max(...allPoints.map((p) => p.lat));
  const minLng = Math.min(...allPoints.map((p) => p.lng));
  const maxLng = Math.max(...allPoints.map((p) => p.lng));

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  // Calculate zoom to fit
  const latSpan = maxLat - minLat;
  const lngSpan = maxLng - minLng;
  const maxSpan = Math.max(latSpan, lngSpan);
  const zoom = maxSpan > 8 ? 5 : maxSpan > 4 ? 6 : maxSpan > 2 ? 7 : maxSpan > 1 ? 8 : 10;

  // Map dimensions
  const mapWidth = 600;
  const mapHeight = 280;

  // Center tile
  const centerTile = latLngToTile(centerLat, centerLng, zoom);

  // How many tiles we need
  const tilesX = Math.ceil(mapWidth / 256) + 2;
  const tilesY = Math.ceil(mapHeight / 256) + 2;

  const startTileX = Math.floor(centerTile.x - tilesX / 2);
  const startTileY = Math.floor(centerTile.y - tilesY / 2);

  // Pixel offset for the center
  const offsetX = mapWidth / 2 - (centerTile.x - startTileX) * 256;
  const offsetY = mapHeight / 2 - (centerTile.y - startTileY) * 256;

  // Convert a lat/lng to pixel position on our map
  function toPixel(lat: number, lng: number) {
    const t = latLngToTile(lat, lng, zoom);
    return {
      x: (t.x - startTileX) * 256 + offsetX,
      y: (t.y - startTileY) * 256 + offsetY,
    };
  }

  const originPx = toPixel(origin.lat, origin.lng);
  const destPx = toPixel(dest.lat, dest.lng);
  const currentPx = current ? toPixel(current.lat, current.lng) : null;

  // Build SVG path
  const pathPoints = [originPx, ...(currentPx ? [currentPx] : []), destPx];
  const fullPath = pathPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const completedPath = currentPx && !complete
    ? `M${originPx.x},${originPx.y} L${currentPx.x},${currentPx.y}`
    : fullPath;

  // Generate tile elements
  const tiles: { x: number; y: number; tileX: number; tileY: number }[] = [];
  for (let ty = 0; ty < tilesY; ty++) {
    for (let tx = 0; tx < tilesX; tx++) {
      tiles.push({
        x: tx,
        y: ty,
        tileX: startTileX + tx,
        tileY: startTileY + ty,
      });
    }
  }

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

      <div className="relative w-full overflow-hidden" style={{ height: '280px' }}>
        {/* Tile layer */}
        <div
          className="absolute"
          style={{
            left: `${offsetX}px`,
            top: `${offsetY}px`,
          }}
        >
          {tiles.map((tile) => (
            <img
              key={`${tile.tileX}-${tile.tileY}`}
              src={`https://a.basemaps.cartocdn.com/light_all/${zoom}/${tile.tileX}/${tile.tileY}.png`}
              alt=""
              width={256}
              height={256}
              loading="lazy"
              style={{
                position: 'absolute',
                left: `${tile.x * 256}px`,
                top: `${tile.y * 256}px`,
                width: '256px',
                height: '256px',
              }}
            />
          ))}
        </div>

        {/* Route + markers SVG overlay */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          preserveAspectRatio="none"
          style={{ pointerEvents: 'none' }}
        >
          {/* Dashed full route */}
          <path
            d={fullPath}
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="2"
            strokeDasharray="8 6"
            opacity="0.35"
          />
          {/* Solid completed route */}
          {completedPath && (
            <path
              d={completedPath}
              fill="none"
              stroke="hsl(22, 90%, 52%)"
              strokeWidth="3"
              opacity="0.85"
              strokeLinecap="round"
            />
          )}

          {/* Origin marker */}
          <circle cx={originPx.x} cy={originPx.y} r="10" fill="#22c55e" stroke="white" strokeWidth="3" />
          <text x={originPx.x} y={originPx.y + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10" fontWeight="bold">O</text>

          {/* Destination marker */}
          <circle cx={destPx.x} cy={destPx.y} r="10" fill="#ef4444" stroke="white" strokeWidth="3" />
          <text x={destPx.x} y={destPx.y + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10" fontWeight="bold">D</text>

          {/* Vehicle marker */}
          {currentPx && !complete && (
            <>
              <circle cx={currentPx.x} cy={currentPx.y} r="13" fill="hsl(22, 90%, 52%)" stroke="white" strokeWidth="3" opacity="0.3">
                <animate attributeName="r" values="13;18;13" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx={currentPx.x} cy={currentPx.y} r="10" fill="hsl(22, 90%, 52%)" stroke="white" strokeWidth="3" />
              <text x={currentPx.x} y={currentPx.y + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9" fontWeight="bold">
                {isAir ? '✈' : '🚑'}
              </text>
            </>
          )}
        </svg>

        {/* Attribution */}
        <div className="absolute bottom-1 right-2 text-[9px] text-muted-foreground/50">
          © OpenStreetMap © CARTO
        </div>
      </div>

      {/* Legend */}
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
