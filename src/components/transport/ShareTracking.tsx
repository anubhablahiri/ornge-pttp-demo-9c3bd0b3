import { useState } from 'react';
import { QrCode, Copy, Share2, Check } from 'lucide-react';
import { useApp } from '@/lib/i18n';

interface ShareTrackingProps {
  transportId: string;
}

export default function ShareTracking({ transportId }: ShareTrackingProps) {
  const { t } = useApp();
  const [copied, setCopied] = useState(false);

  const trackingUrl = `${window.location.origin}/v3/track/${transportId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(trackingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('share.title'),
          text: t('share.text'),
          url: trackingUrl,
        });
      } catch {
        // user cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
      <h3 className="text-sm font-semibold text-foreground mb-4">{t('share.title')}</h3>

      <div className="flex items-start gap-4">
        {/* QR Code placeholder */}
        <div className="bg-white p-3 rounded-xl border border-border shrink-0">
          <QrCode className="h-16 w-16 text-foreground" />
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <p className="text-xs text-muted-foreground">{t('share.description')}</p>

          {/* Copy link */}
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0 bg-accent/50 border border-border rounded-lg px-3 py-2 text-xs text-muted-foreground truncate">
              {trackingUrl}
            </div>
            <button
              onClick={handleCopy}
              className="shrink-0 p-2 rounded-lg bg-accent hover:bg-accent/80 border border-border transition-colors"
              aria-label="Copy link"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
            {t('share.button')}
          </button>
        </div>
      </div>
    </div>
  );
}
