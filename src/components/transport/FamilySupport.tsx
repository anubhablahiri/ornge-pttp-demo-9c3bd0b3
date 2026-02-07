import { Phone, HelpCircle, Heart } from 'lucide-react';
import { useApp } from '@/lib/i18n';

export default function FamilySupport() {
  const { t } = useApp();

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Heart className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">{t('support.title')}</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {t('support.message')}
      </p>

      <div className="space-y-3">
        <a
          href="tel:+18004611911"
          className="flex items-center gap-3 p-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Phone className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{t('support.coordination')}</p>
            <p className="text-xs text-muted-foreground">1-800-461-1911</p>
          </div>
        </a>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <HelpCircle className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{t('support.whatHappens')}</p>
            <p className="text-xs text-muted-foreground">{t('support.whatHappensAnswer')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
