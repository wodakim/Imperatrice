'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const t = useTranslations('Legal');

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-[var(--color-accent)] p-4 shadow-[0_-5px_15px_rgba(0,0,0,0.1)] z-50 flex flex-col md:flex-row items-center justify-between gap-4 animate-slide-up">
      <div className="text-sm text-[var(--color-text-muted)] max-w-2xl">
        <strong className="text-[var(--color-primary-dark)]">🍪 Cookies & Privacy:</strong> Nous utilisons uniquement des cookies essentiels (Auth, Langue, Thème) pour faire fonctionner l'app.
        <span className="hidden md:inline"> Pas de traceurs, pas de pubs. C'est promis.</span>
        <a href="/legal/privacy" className="underline ml-2 hover:text-[var(--color-primary)]">En savoir plus</a>.
      </div>
      <button
        onClick={accept}
        className="bg-[var(--color-primary-dark)] text-white px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform whitespace-nowrap"
      >
        J'accepte 👍
      </button>
    </div>
  );
}
