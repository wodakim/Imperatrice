'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Smile } from 'lucide-react';

export default function JokeGenerator() {
  const t = useTranslations('Dashboard');
  const t_jokes = useTranslations('jokes'); // Array logic

  // Need joke count or raw array. Hardcoded 5 in proto.
  const getJoke = () => {
      const idx = Math.floor(Math.random() * 5);
      return t_jokes(`${idx}`);
  };

  const [joke, setJoke] = useState(getJoke());

  return (
    <div className="bg-[var(--color-bg)] border border-dashed border-[var(--color-secondary)] p-6 rounded-[20px] text-center max-w-sm mx-auto w-full">
        <h3 className="text-[var(--color-secondary)] font-bold text-lg mb-4 flex items-center justify-center gap-2">
            <Smile size={24} /> {t('joke_title')}
        </h3>

        <p className="min-h-[60px] flex items-center justify-center text-[var(--color-text-main)] font-medium italic mb-4">
            &quot;{joke}&quot;
        </p>

        <button
            onClick={() => { setJoke(getJoke()); if(typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'joke_lover' })); }}
            className="bg-[var(--color-secondary)] text-white px-6 py-2 rounded-full font-bold shadow-md hover:scale-105 transition-transform"
        >
            {t('btn_next_joke')}
        </button>
    </div>
  );
}
