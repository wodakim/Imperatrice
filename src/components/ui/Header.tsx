'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('Header');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  const triggerPanic = () => {
    // Dispatch event for PanicOverlay to listen
    window.dispatchEvent(new Event('triggerPanic'));
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-8 p-5 bg-[var(--surface)] rounded-[var(--border-radius)] shadow-[var(--shadow-soft)] gap-4">
      <div className="logo-area text-center md:text-left">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)] tracking-wider m-0">
          L&apos;IMPÉRATRICE
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {t('subtitle')}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Language Selector (Simplifié pour le moment, à connecter à next-intl router) */}
        {/* <LangSelect /> */}

        {/* SOS Button */}
        <button
          onClick={triggerPanic}
          aria-label="SOS Hypersensibilité"
          className="bg-[#ff6b6b] text-white w-11 h-11 rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(255,107,107,0.4)] animate-pulse-sos hover:scale-105 active:scale-95 transition-transform"
        >
          <AlertTriangle size={20} fill="white" stroke="none" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Changer le thème"
          className="bg-transparent border-2 border-[var(--primary)] text-[var(--primary-dark)] w-11 h-11 rounded-full flex items-center justify-center overflow-hidden hover:bg-[var(--background)] active:scale-95 transition-all"
        >
          {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
}
