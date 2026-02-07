import { useApp } from '@/lib/i18n';
import { Globe } from 'lucide-react';

export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useApp();

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold hover:bg-accent/80 transition-colors ${className}`}
    >
      <Globe className="h-3.5 w-3.5" />
      {lang === 'en' ? 'FR' : 'EN'}
    </button>
  );
}
