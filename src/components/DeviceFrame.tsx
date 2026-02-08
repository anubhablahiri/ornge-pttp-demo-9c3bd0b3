import React from 'react';
import { useApp } from '@/lib/i18n';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export default function DeviceFrame({ children }: DeviceFrameProps) {
  const { deviceFormat } = useApp();

  // Only frame mobile/tablet when viewed on a wide screen (i.e. desktop browser)
  const isWideScreen = typeof window !== 'undefined' && window.innerWidth >= 1024;

  if (!isWideScreen || deviceFormat === 'desktop') {
    return <>{children}</>;
  }

  const isMobile = deviceFormat === 'mobile';

  // Frame dimensions
  const frameWidth = isMobile ? 390 : 820;
  const frameHeight = isMobile ? 844 : 1180;
  const scaledHeight = isMobile ? '85vh' : '85vh';
  const borderRadius = isMobile ? 50 : 36;

  return (
    <div className="min-h-screen bg-muted/50 flex items-center justify-center py-8">
      <div className="flex flex-col items-center gap-4">
        {/* Device label */}
        <span className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-widest">
          {isMobile ? 'iPhone Preview' : 'Tablet Preview'}
        </span>

        {/* Device frame */}
        <div
          className="relative bg-foreground shadow-2xl"
          style={{
            borderRadius,
            padding: isMobile ? 12 : 14,
            maxHeight: scaledHeight,
          }}
        >
          {/* Notch / Dynamic Island (mobile only) */}
          {isMobile && (
            <div
              className="absolute top-3 left-1/2 -translate-x-1/2 bg-foreground rounded-full z-20"
              style={{ width: 120, height: 32 }}
            >
              <div
                className="absolute top-2 right-5 w-3 h-3 rounded-full"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              />
            </div>
          )}

          {/* Screen */}
          <div
            className="relative overflow-hidden bg-background"
            style={{
              width: frameWidth,
              height: frameHeight,
              borderRadius: borderRadius - (isMobile ? 8 : 6),
              maxHeight: `calc(${scaledHeight} - ${isMobile ? 24 : 28}px)`,
            }}
          >
            <div className="w-full h-full overflow-y-auto overflow-x-hidden">
              {children}
            </div>
          </div>

          {/* Home indicator (mobile) */}
          {isMobile && (
            <div className="flex justify-center pt-2">
              <div
                className="rounded-full"
                style={{ width: 134, height: 5, background: 'rgba(255,255,255,0.3)' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
