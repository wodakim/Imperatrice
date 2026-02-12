'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon, Heart, UserCircle } from 'lucide-react';
import { useLocale } from 'next-intl';

const FLAGS: Record<string, string> = {
  fr: '🇫🇷', en: '🇬🇧', de: '🇩🇪', es: '🇪🇸', it: '🇮🇹', pl: '🇵🇱'
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();

  const [langOpen, setLangOpen] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const changeLanguage = (newLocale: string) => {
    // Replace locale segment in path
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');

    router.push(newPath);
    setLangOpen(false);
  };

  const toggleTheme = () => {
    setIsRotating(true);
    setTheme(theme === 'dark' ? 'light' : 'dark');
    setTimeout(() => setIsRotating(false), 500);
  };

  const triggerPanic = () => {
    if (typeof window !== 'undefined') {
      const event = new Event('triggerPanic');
      window.dispatchEvent(event);
    }
  };

  const openLogin = () => {
    if (typeof window !== 'undefined') {
      const event = new Event('openLoginModal');
      window.dispatchEvent(event);
    }
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-8 p-5 bg-[var(--color-surface)] rounded-[20px] shadow-[var(--shadow-soft)] transition-colors gap-4 md:gap-0">
      <div className="flex flex-col text-center md:text-left">
        <h1 className="text-2xl font-bold text-[var(--color-primary-dark)] tracking-wide m-0">
          L'IMPÉRATRICE
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Ton assistante personnelle de vente
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Language Selector (Pill Style) */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-[20px] bg-[var(--color-bg)] border border-[var(--color-accent)] text-[var(--color-text-main)] text-sm hover:border-[var(--color-primary-dark)] transition-colors min-w-[80px]"
            aria-label="Changer la langue"
          >
            <span className="text-lg">{FLAGS[locale] || '🌐'}</span>
            <span className="font-bold">{locale.toUpperCase()}</span>
          </button>

          {langOpen && (
            <div className="absolute right-0 top-full mt-2 bg-[var(--color-surface)] border border-[var(--color-accent)] rounded-xl shadow-xl overflow-hidden z-50 min-w-[120px]">
              {Object.entries(FLAGS).map(([l, flag]) => (
                <button
                  key={l}
                  onClick={() => changeLanguage(l)}
                  className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-primary)] hover:text-white transition-colors ${locale === l ? 'font-bold bg-[var(--color-bg)]' : ''}`}
                >
                  <span>{flag}</span>
                  <span>{l.toUpperCase()}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SOS Button (Pulse Animation) */}
        <button
          onClick={triggerPanic}
          className="w-11 h-11 rounded-full bg-[#ff6b6b] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform animate-pulse-sos flex-shrink-0"
          aria-label="SOS Hypersensibilité"
        >
          <Heart size={20} fill="currentColor" stroke="none" />
        </button>

        {/* Theme Toggle (Rotation) */}
        <button
          onClick={toggleTheme}
          className="w-11 h-11 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary-dark)] flex items-center justify-center hover:bg-[var(--color-bg)] transition-colors flex-shrink-0 overflow-hidden"
          aria-label="Changer le thème"
        >
          <div className={`transition-transform duration-500 ${isRotating ? 'rotate-[360deg]' : 'rotate-0'}`}>
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          </div>
        </button>

        {/* Login Trigger */}
        <button
          onClick={openLogin}
          className="w-11 h-11 rounded-full bg-[var(--color-bg)] text-[var(--color-primary-dark)] flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors flex-shrink-0"
          aria-label="Connexion"
        >
          <UserCircle size={24} />
        </button>
      </div>
    </header>
  );
}
