import React from 'react';
import { useApp } from '@/lib/i18n';
import { Signal, Wifi, Battery } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export default function DeviceFrame({ children }: DeviceFrameProps) {
  const { deviceFormat } = useApp();

  const isWideScreen = typeof window !== 'undefined' && window.innerWidth >= 1024;

  if (!isWideScreen || deviceFormat === 'desktop') {
    return <>{children}</>;
  }

  const isMobile = deviceFormat === 'mobile';

  const frameWidth = isMobile ? 390 : 768;
  const frameHeight = isMobile ? 844 : 1024;
  const borderRadius = isMobile ? 50 : 24;
  const bezelPad = isMobile ? 12 : 16;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-muted/50 flex items-center justify-center py-8">
      <div className="flex flex-col items-center gap-4">
        <span className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-widest">
          {isMobile ? 'iPhone Preview' : 'iPad Preview'}
        </span>

        <div
          className="relative bg-foreground shadow-2xl flex flex-col"
          style={{
            borderRadius,
            padding: bezelPad,
            maxHeight: '88vh',
          }}
        >
          {/* Dynamic Island (mobile) */}
          {isMobile && (
            <div
              className="absolute top-[14px] left-1/2 -translate-x-1/2 bg-black rounded-full z-20"
              style={{ width: 126, height: 34 }}
            >
              <div
                className="absolute top-[10px] right-[18px] w-[10px] h-[10px] rounded-full"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              />
            </div>
          )}

          {/* Screen */}
          <div
            className="relative overflow-hidden bg-background flex flex-col"
            style={{
              width: frameWidth,
              height: frameHeight,
              borderRadius: borderRadius - (isMobile ? 8 : 6),
              maxHeight: `calc(88vh - ${bezelPad * 2}px)`,
            }}
          >
            {/* Status bar */}
            <div
              className="shrink-0 flex items-center justify-between px-6 bg-background relative z-30"
              style={{ height: isMobile ? 54 : 28, paddingTop: isMobile ? 14 : 6 }}
            >
              <span className="text-[13px] font-semibold text-foreground" style={{ fontFamily: 'system-ui' }}>
                {timeStr}
              </span>
              <div className="flex items-center gap-1.5">
                <Signal className="text-foreground" size={14} strokeWidth={2.2} />
                <Wifi className="text-foreground" size={14} strokeWidth={2.2} />
                <Battery className="text-foreground" size={16} strokeWidth={2.2} />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
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
