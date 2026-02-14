'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Smile } from 'lucide-react';

export default function JokeGenerator() {
  const t = useTranslations('Dashboard');
  const [joke, setJoke] = useState("...");
  const [jokeCount, setJokeCount] = useState(0);

  const getNextJoke = () => {
      const idx = Math.floor(Math.random() * 5);
      return t(`jokes.${idx}`);
  };

  useEffect(() => {
      setJoke(getNextJoke());
  }, []);

  const handleNext = () => {
      setJoke(getNextJoke());
      setJokeCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 5 && typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'joke_lover' }));
          }
          return newCount;
      });
  };

  return (
    <div className="bg-[var(--color-bg)] border border-dashed border-[var(--color-secondary)] p-6 rounded-[20px] text-center max-w-sm mx-auto w-full flex flex-col items-center">
        <h3 className="text-[var(--color-secondary)] font-bold text-lg mb-4 flex items-center justify-center gap-2">
            <Smile size={24} /> {t('joke_title')}
        </h3>

        <p className="min-h-[80px] flex items-center justify-center text-[var(--color-text-main)] font-medium italic mb-6 leading-relaxed px-4">
            &quot;{joke}&quot;
        </p>

        <button
            onClick={handleNext}
            className="bg-[var(--color-secondary)] text-white px-6 py-2 rounded-full font-bold shadow-md hover:scale-105 transition-transform flex items-center gap-2"
        >
            {t('btn_next_joke')}
        </button>
    </div>
  );
}
