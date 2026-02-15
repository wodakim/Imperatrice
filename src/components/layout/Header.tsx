'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { Sun, Moon, Heart, ChevronDown, Palette } from 'lucide-react';
import InstallPWA from './InstallPWA'; // Assuming this component exists
import ReloadPrompt from './ReloadPrompt';
import { useBrandTheme } from '@/components/providers/BrandThemeProvider';

const FLAGS: Record<string, string> = {
  fr: '🇫🇷', en: '🇬🇧', de: '🇩🇪', es: '🇪🇸', it: '🇮🇹', pl: '🇵🇱'
};

const THEMES = [
  { id: 'classic', name: 'Classique', icon: '✨' },
  { id: 'fraise', name: 'Fraise', icon: '🍓' },
];

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { brand, setBrand } = useBrandTheme();
  const router = useRouter();
  const pathname = usePathname();

  // Extract locale from path
  const currentLocale = pathname.split('/')[1] || 'fr';
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [showReload, setShowReload] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setIsRotating(true);
    setTheme(theme === 'dark' ? 'light' : 'dark');
    setTimeout(() => setIsRotating(false), 500);
  };

  const changeLanguage = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
    setIsLangOpen(false);
    setShowReload(true);
  };

  const triggerPanic = () => {
      // Dispatch custom event for PanicRoom component to listen
      window.dispatchEvent(new Event('triggerPanic'));
  };

  if (!mounted) return <div className="h-[88px] mb-8" />; // Skeleton placeholder height

  return (
    <>
      <ReloadPrompt show={showReload} onReload={() => setShowReload(false)} />
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 p-5 bg-[var(--color-surface)] rounded-[20px] shadow-[var(--shadow-soft)] gap-4 md:gap-0 transition-all duration-300">

        {/* Logo Area */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold text-[var(--color-primary-dark)] tracking-wide m-0">
          L'IMPÉRATRICE
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1 font-medium">
          Ton assistante personnelle de vente
        </p>
      </div>

      {/* Actions Area */}
      <div className="flex items-center gap-3">

        {/* Language Selector (Pill) */}
        <div className="relative z-50">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-bg)] border border-[var(--color-accent)] rounded-[20px] text-[var(--color-text-main)] text-sm font-bold hover:border-[var(--color-primary-dark)] transition-colors"
          >
            <span className="text-lg">{FLAGS[currentLocale]}</span>
            <span>{currentLocale.toUpperCase()}</span>
            <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`}/>
          </button>

          {isLangOpen && (
            <div className="absolute right-0 top-full mt-2 w-32 bg-[var(--color-surface)] dark:bg-[#383848] border border-[var(--color-accent)] rounded-[15px] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[60]">
              {Object.entries(FLAGS).map(([loc, flag]) => (
                <button
                  key={loc}
                  onClick={() => changeLanguage(loc)}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-[var(--color-bg)] dark:hover:bg-black/20 transition-colors
                    ${currentLocale === loc ? 'font-bold text-[var(--color-primary-dark)] bg-[var(--color-bg)] dark:bg-black/20' : 'text-[var(--color-text-main)]'}
                  `}
                >
                  <span className="text-lg">{flag}</span>
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SOS Button */}
        <button
          onClick={triggerPanic}
          className="w-11 h-11 rounded-full bg-[#ff6b6b] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform animate-pulse-sos"
          aria-label="SOS"
          title="Zone d'Urgence"
        >
          <Heart size={20} fill="currentColor" stroke="none" />
        </button>

        {/* Brand Theme Selector */}
        <div className="relative z-40">
            <button
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className="w-11 h-11 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-bg)] text-[var(--color-primary-dark)] flex items-center justify-center hover:bg-[var(--color-surface)] transition-colors"
                title="Changer le style"
            >
                <Palette size={20} />
            </button>

            {isThemeOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-[var(--color-surface)] border border-[var(--color-accent)] rounded-[15px] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {THEMES.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => { setBrand(t.id as any); setIsThemeOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-[var(--color-bg)] transition-colors
                                ${brand === t.id ? 'font-bold text-[var(--color-primary-dark)] bg-[var(--color-bg)]' : 'text-[var(--color-text-main)]'}
                            `}
                        >
                            <span className="text-lg">{t.icon}</span>
                            {t.name}
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* Light/Dark Toggle */}
        <button
          onClick={toggleTheme}
          className="w-11 h-11 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary-dark)] bg-transparent flex items-center justify-center hover:bg-[var(--color-bg)] transition-colors overflow-hidden"
          aria-label="Changer le mode jour/nuit"
          title={theme === 'dark' ? 'Mode Jour' : 'Mode Nuit'}
        >
           <div className={`transition-transform duration-500 ease-in-out ${isRotating ? 'rotate-[360deg]' : 'rotate-0'}`}>
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          </div>
        </button>

        {/* PWA Install (Optional) */}
        <div className="hidden sm:block">
            <InstallPWA />
        </div>

      </div>
    </header>
    </>
  );
}
