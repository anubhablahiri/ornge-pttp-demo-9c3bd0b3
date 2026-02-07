import { useEffect, useState, useRef } from 'react';
import { Transport, getCurrentStatusIndex } from '@/data/mockTransports';
import { useApp } from '@/lib/i18n';

interface Props {
  transport: Transport;
}

export default function LiveMap({ transport }: Props) {
  const { t } = useApp();
  const currentIdx = getCurrentStatusIndex(transport);
  const isEnRoute = currentIdx >= 3 && currentIdx <= 7;
  const isAir = transport.mode === 'air';
  const [progress, setProgress] = useState(0.5);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!isEnRoute) return;
    intervalRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + 0.005, 0.95));
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [isEnRoute]);

  const originX = 80, originY = 160, destX = 320, destY = 80;
  const midX = (originX + destX) / 2;
  const midY = Math.min(originY, destY) - 40;
  const airPath = `M ${originX} ${originY} Q ${midX} ${midY} ${destX} ${destY}`;
  const landPath = `M ${originX} ${originY} C ${originX + 60} ${originY - 20} ${destX - 60} ${destY + 20} ${destX} ${destY}`;

  const getCurvePoint = (t: number) => {
    if (isAir) {
      const x = (1 - t) * (1 - t) * originX + 2 * (1 - t) * t * midX + t * t * destX;
      const y = (1 - t) * (1 - t) * originY + 2 * (1 - t) * t * midY + t * t * destY;
      return { x, y };
    }
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
        <h3 className="text-sm font-semibold text-foreground">{t('dash.liveTracking')}</h3>
        {isAir && transport.altitude && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {t('dash.alt')} {transport.altitude.toLocaleString()} ft
          </span>
        )}
      </div>

      <div className="relative">
        <svg viewBox="0 0 400 220" className="w-full h-auto">
          <defs>
            {/* Background gradient for terrain feel */}
            <linearGradient id="mapBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(210 30% 94%)" />
              <stop offset="100%" stopColor="hsl(152 30% 90%)" />
            </linearGradient>
            {/* Route glow */}
            <filter id="routeGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Vehicle glow */}
            <radialGradient id="vehicleGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </radialGradient>
            {/* Origin marker gradient */}
            <radialGradient id="originGrad" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(22 90% 42%)" stopOpacity="1" />
            </radialGradient>
            {/* Destination marker gradient */}
            <radialGradient id="destGrad" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(152 60% 30%)" stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Background */}
          <rect width="400" height="220" fill="url(#mapBg)" />

          {/* Terrain shapes */}
          <ellipse cx="60" cy="190" rx="50" ry="20" fill="hsl(152 20% 85%)" opacity="0.5" />
          <ellipse cx="200" cy="200" rx="80" ry="15" fill="hsl(152 20% 87%)" opacity="0.4" />
          <ellipse cx="340" cy="110" rx="45" ry="18" fill="hsl(152 20% 84%)" opacity="0.5" />
          <ellipse cx="150" cy="60" rx="35" ry="12" fill="hsl(210 20% 88%)" opacity="0.3" />

          {/* Grid lines (subtle) */}
          {[55, 110, 165].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="hsl(var(--border))" strokeWidth="0.3" opacity="0.3" />
          ))}
          {[100, 200, 300].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="220" stroke="hsl(var(--border))" strokeWidth="0.3" opacity="0.3" />
          ))}

          {/* Route shadow */}
          <path
            d={isAir ? airPath : landPath}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="6"
            opacity="0.08"
          />

          {/* Route dashed trail */}
          <path
            d={isAir ? airPath : landPath}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity="0.3"
          />

          {/* Completed route */}
          <path
            d={isAir ? airPath : landPath}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeDasharray={`${progress * 400} 1000`}
            strokeLinecap="round"
            filter="url(#routeGlow)"
          />

          {/* Origin marker */}
          <circle cx={originX} cy={originY} r="10" fill="url(#originGrad)" opacity="0.15" />
          <circle cx={originX} cy={originY} r="7" fill="url(#originGrad)" />
          <circle cx={originX} cy={originY} r="3" fill="hsl(var(--primary-foreground))" />
          <text x={originX} y={originY + 20} textAnchor="middle" className="text-[9px] fill-foreground font-semibold">
            {t('dash.origin')}
          </text>

          {/* Destination marker */}
          <circle cx={destX} cy={destY} r="10" fill="url(#destGrad)" opacity="0.15" />
          <circle cx={destX} cy={destY} r="7" fill="url(#destGrad)" />
          <circle cx={destX} cy={destY} r="3" fill="hsl(var(--success-foreground))" />
          <text x={destX} y={destY + 20} textAnchor="middle" className="text-[9px] fill-foreground font-semibold">
            {t('dash.destination')}
          </text>

          {/* Vehicle */}
          {isEnRoute && (
            <g className="animate-vehicle-bounce">
              {/* Glow ring */}
              <circle cx={pos.x} cy={pos.y} r="18" fill="url(#vehicleGlow)" />
              {/* Shadow */}
              <ellipse cx={pos.x} cy={pos.y + 14} rx="8" ry="3" fill="hsl(var(--foreground))" opacity="0.08" />
              {/* Vehicle body */}
              <circle cx={pos.x} cy={pos.y} r="10" fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" strokeWidth="2" />
              <text x={pos.x} y={pos.y + 4} textAnchor="middle" className="text-[11px] fill-primary-foreground font-bold">
                {isAir ? '✈' : '🚑'}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Flight progress bar */}
      {isAir && isEnRoute && (
        <div className="px-5 py-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>{t('dash.flightProgress')}</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${progress * 100}%`,
                background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(22 90% 64%))',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
