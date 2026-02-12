'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon, Languages, Heart, UserCircle } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();

  const [langOpen, setLangOpen] = useState(false);

  const changeLanguage = (newLocale: string) => {
    const path = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(path);
    setLangOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
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
    <header className="flex flex-col md:flex-row justify-between items-center mb-8 p-5 bg-[var(--color-surface)] rounded-2xl shadow-[var(--shadow-soft)] transition-colors gap-4 md:gap-0">
      <div className="flex flex-col text-center md:text-left">
        <h1 className="text-2xl font-bold text-[var(--color-primary-dark)] tracking-wide m-0">
          L'IMPÉRATRICE
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Ton assistante personnelle de vente
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="p-2 rounded-full hover:bg-[var(--color-bg)] text-[var(--color-text-muted)] transition-colors"
            aria-label="Changer la langue"
          >
            <Languages size={20} />
          </button>

          {langOpen && (
            <div className="absolute right-0 top-full mt-2 bg-[var(--color-surface)] border border-[var(--color-accent)] rounded-xl shadow-xl overflow-hidden z-50 min-w-[120px]">
              {['fr', 'en', 'de', 'es', 'it', 'pl'].map((l) => (
                <button
                  key={l}
                  onClick={() => changeLanguage(l)}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-primary)] hover:text-white transition-colors ${locale === l ? 'font-bold bg-[var(--color-bg)]' : ''}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SOS Button */}
        <button
          onClick={triggerPanic}
          className="w-11 h-11 rounded-full bg-[#ff6b6b] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform animate-pulse"
          aria-label="SOS Hypersensibilité"
        >
          <Heart size={20} fill="currentColor" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-11 h-11 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary-dark)] flex items-center justify-center hover:bg-[var(--color-bg)] transition-colors"
          aria-label="Changer le thème"
        >
          {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Login Trigger */}
        <button
          onClick={openLogin}
          className="w-11 h-11 rounded-full bg-[var(--color-bg)] text-[var(--color-primary-dark)] flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors"
          aria-label="Connexion"
        >
          <UserCircle size={24} />
        </button>
      </div>
    </header>
  );
}
