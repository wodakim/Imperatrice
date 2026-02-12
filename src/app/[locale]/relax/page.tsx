'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function RelaxPage() {
  const t = useTranslations('Relax');
  const t_jokes = useTranslations('Jokes');
  const [joke, setJoke] = useState('');
  const [breathText, setBreathText] = useState('Inspire');
  const [breathState, setBreathState] = useState('in');

  useEffect(() => {
    // Breathing Cycle
    const interval = setInterval(() => {
      setBreathState(prev => {
        if (prev === 'in') {
          setBreathText('Expire');
          return 'out';
        } else {
          setBreathText('Inspire');
          return 'in';
        }
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const showJoke = () => {
    const jokes = [
      t_jokes('joke_1'),
      t_jokes('joke_2'),
      t_jokes('joke_3'),
      t_jokes('joke_4'),
      t_jokes('joke_5')
    ];
    setJoke(jokes[Math.floor(Math.random() * jokes.length)]);
  };

  return (
    <div className="flex flex-col gap-8 items-center min-h-[60vh]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-2">{t('relax_title')}</h2>
        <p className="text-[var(--color-text-muted)]">{t('relax_subtitle')}</p>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-bold text-[var(--color-primary-dark)] mb-6">{t('breath_title')}</h3>
        <div className={`w-32 h-32 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-[0_0_30px_var(--color-accent)] transition-all duration-[4000ms] ease-in-out ${breathState === 'in' ? 'scale-150 opacity-100' : 'scale-100 opacity-80'}`}>
            {breathText}
        </div>
        <p className="mt-8 text-sm text-[var(--color-text-muted)]">{t('breath_instruction')}</p>
      </div>

      <div className="w-full max-w-md bg-[var(--color-bg)] p-6 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-secondary)] text-center">
        <h3 className="text-[var(--color-secondary)] font-bold mb-4">{t('joke_title')}</h3>
        <p className="min-h-[60px] flex items-center justify-center italic text-[var(--color-text-main)] mb-4">
            {joke || "..."}
        </p>
        <button
            onClick={showJoke}
            className="bg-[var(--color-secondary)] text-white px-6 py-2 rounded-full font-bold shadow-md hover:scale-105 transition-transform"
        >
            {t('btn_next_joke')}
        </button>
      </div>
    </div>
  );
}
