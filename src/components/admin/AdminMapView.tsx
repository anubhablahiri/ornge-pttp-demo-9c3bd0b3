import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import 'leaflet/dist/leaflet.css';

const vehicleIcon = (color: string) =>
  L.divIcon({
    className: '',
    html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 0 6px ${color}80;"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

const baseIcon = L.divIcon({
  className: '',
  html: `<div style="background:hsl(212 53% 23%);width:10px;height:10px;border-radius:50%;border:2px solid white;"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

interface LiveTransport {
  id: string;
  from: string;
  to: string;
  mode: 'air' | 'land';
  status: string;
  position: [number, number];
  origin: [number, number];
  destination: [number, number];
}

const liveTransports: LiveTransport[] = [
  { id: 'ORN-4821', from: 'Thunder Bay', to: 'Toronto', mode: 'air', status: 'In Transit', position: [47.5, -83.2], origin: [48.38, -89.25], destination: [43.65, -79.38] },
  { id: 'ORN-4819', from: 'Brampton', to: 'Hamilton', mode: 'land', status: 'Dispatched', position: [43.55, -79.82], origin: [43.68, -79.76], destination: [43.25, -79.87] },
  { id: 'ORN-4805', from: 'Timmins', to: 'Sudbury', mode: 'air', status: 'In Transit', position: [47.0, -81.2], origin: [48.47, -81.33], destination: [46.49, -81.0] },
  { id: 'ORN-4830', from: 'Ottawa', to: 'Kingston', mode: 'land', status: 'In Transit', position: [44.8, -75.9], origin: [45.42, -75.69], destination: [44.23, -76.49] },
  { id: 'ORN-4832', from: 'Kenora', to: 'Sioux Lookout', mode: 'air', status: 'Dispatched', position: [50.2, -93.5], origin: [49.77, -94.49], destination: [50.1, -91.92] },
];

const bases = [
  { name: 'Toronto Base', pos: [43.68, -79.63] as [number, number] },
  { name: 'Sudbury Base', pos: [46.49, -81.0] as [number, number] },
  { name: 'Thunder Bay Base', pos: [48.38, -89.25] as [number, number] },
  { name: 'Ottawa Base', pos: [45.32, -75.67] as [number, number] },
];

export default function AdminMapView() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-display">Live Transport Map</CardTitle>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" />Air</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" />Land</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-secondary" />Base</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden rounded-b-lg">
        <div className="h-[400px]">
          <MapContainer
            center={[49.5, -84.5]}
            zoom={5}
            className="h-full w-full"
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

            {bases.map((b) => (
              <Marker key={b.name} position={b.pos} icon={baseIcon}>
                <Popup className="text-xs">{b.name}</Popup>
              </Marker>
            ))}

            {liveTransports.map((t) => (
              <span key={t.id}>
                <Polyline
                  positions={[t.origin, t.position]}
                  pathOptions={{ color: 'hsl(22, 90%, 54%)', weight: 2.5, opacity: 0.8 }}
                />
                <Polyline
                  positions={[t.position, t.destination]}
                  pathOptions={{ color: 'hsl(22, 90%, 54%)', weight: 2, opacity: 0.3, dashArray: '6 4' }}
                />
                <Marker
                  position={t.position}
                  icon={vehicleIcon(t.mode === 'air' ? 'hsl(22, 90%, 54%)' : 'hsl(152, 60%, 40%)')}
                >
                  <Popup>
                    <div className="text-xs space-y-1">
                      <p className="font-semibold">{t.id}</p>
                      <p>{t.from} → {t.to}</p>
                      <p className="capitalize">{t.mode} · {t.status}</p>
                    </div>
                  </Popup>
                </Marker>
              </span>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
