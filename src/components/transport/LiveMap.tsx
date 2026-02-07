import { useEffect, useState, useRef } from 'react';
import { Transport, getCurrentStatusIndex } from '@/data/mockTransports';
import { Plane, Truck } from 'lucide-react';

interface Props {
  transport: Transport;
}

export default function LiveMap({ transport }: Props) {
  const currentIdx = getCurrentStatusIndex(transport);
  const isEnRoute = currentIdx >= 3 && currentIdx <= 7;
  const isAir = transport.mode === 'air';
  const [progress, setProgress] = useState(0.5);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!isEnRoute) return;
    // Simulate movement
    intervalRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + 0.005, 0.95));
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [isEnRoute]);

  // Simple SVG map
  const originX = 80;
  const originY = 160;
  const destX = 320;
  const destY = 80;
  const vehicleX = originX + (destX - originX) * progress;
  const vehicleY = originY + (destY - originY) * progress;

  // Curved path for air
  const midX = (originX + destX) / 2;
  const midY = Math.min(originY, destY) - 40;
  const airPath = `M ${originX} ${originY} Q ${midX} ${midY} ${destX} ${destY}`;
  const landPath = `M ${originX} ${originY} C ${originX + 60} ${originY - 20} ${destX - 60} ${destY + 20} ${destX} ${destY}`;

  // Calculate position along curve
  const getCurvePoint = (t: number) => {
    if (isAir) {
      const x = (1 - t) * (1 - t) * originX + 2 * (1 - t) * t * midX + t * t * destX;
      const y = (1 - t) * (1 - t) * originY + 2 * (1 - t) * t * midY + t * t * destY;
      return { x, y };
    }
    // Cubic bezier for land
    const cx1 = originX + 60, cy1 = originY - 20;
    const cx2 = destX - 60, cy2 = destY + 20;
    const x = Math.pow(1-t,3)*originX + 3*Math.pow(1-t,2)*t*cx1 + 3*(1-t)*t*t*cx2 + t*t*t*destX;
    const y = Math.pow(1-t,3)*originY + 3*Math.pow(1-t,2)*t*cy1 + 3*(1-t)*t*t*cy2 + t*t*t*destY;
    return { x, y };
  };

  const pos = getCurvePoint(progress);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Live Tracking</h3>
        {isAir && transport.altitude && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            Alt: {transport.altitude.toLocaleString()} ft
          </span>
        )}
      </div>

      <div className="relative">
        <svg viewBox="0 0 400 220" className="w-full h-auto bg-accent/30">
          {/* Grid lines for map feel */}
          {[40, 80, 120, 160, 200].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.5" />
          ))}
          {[80, 160, 240, 320].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="220" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.5" />
          ))}

          {/* Route path */}
          <path
            d={isAir ? airPath : landPath}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity="0.4"
          />

          {/* Completed portion */}
          <path
            d={isAir ? airPath : landPath}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
            strokeDasharray={`${progress * 400} 1000`}
          />

          {/* Origin marker */}
          <circle cx={originX} cy={originY} r="6" fill="hsl(var(--primary))" />
          <circle cx={originX} cy={originY} r="3" fill="hsl(var(--primary-foreground))" />
          <text x={originX} y={originY + 18} textAnchor="middle" className="text-[9px] fill-muted-foreground font-medium">
            Origin
          </text>

          {/* Destination marker */}
          <circle cx={destX} cy={destY} r="6" fill="hsl(var(--success))" />
          <circle cx={destX} cy={destY} r="3" fill="hsl(var(--success-foreground))" />
          <text x={destX} y={destY + 18} textAnchor="middle" className="text-[9px] fill-muted-foreground font-medium">
            Destination
          </text>

          {/* Vehicle icon */}
          {isEnRoute && (
            <g className="animate-vehicle-bounce">
              <circle cx={pos.x} cy={pos.y} r="12" fill="hsl(var(--primary))" opacity="0.2" />
              <circle cx={pos.x} cy={pos.y} r="8" fill="hsl(var(--primary))" />
              <text x={pos.x} y={pos.y + 3.5} textAnchor="middle" className="text-[10px] fill-primary-foreground">
                {isAir ? '✈' : '🚑'}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Flight progress bar for air */}
      {isAir && isEnRoute && (
        <div className="px-5 py-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Flight Progress</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
