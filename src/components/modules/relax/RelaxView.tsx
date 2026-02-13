'use client';

import { useTranslations } from 'next-intl';

export default function RelaxView() {
  const t = useTranslations('Relax');
  const tJokes = useTranslations('Jokes'); // Access jokes root if needed or nested

  // Breathing Animation
  // Reuse CSS animation in globals.css

  // Joke logic
  // Simple random display on click
  const showJoke = () => {
      // Logic to pick random joke from t.raw('jokes')
      // For MVP just alert or use DOM replacement if I was lazy, but here:
      const el = document.getElementById('joke-display');
      if(el) {
         try {
             const jokes = t.raw('jokes'); // Assuming this works or use global t
             // If t.raw fails (no array support in strict mode), we fallback
             const r = jokes[Math.floor(Math.random() * jokes.length)];
             el.innerText = r;
             window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'joke_lover' }));
         } catch(e) {
             el.innerText = "Why did the chicken...? (Jokes loading error)";
         }
      }
  };

  return (
    <div className="animate-fade-in bg-[var(--surface)] p-8 rounded-[var(--border-radius)] shadow-[var(--shadow-soft)] text-center max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-[var(--primary-dark)] mb-2">{t('relax_title')}</h2>
        <p className="text-[var(--text-muted)] mb-10">{t('relax_subtitle')}</p>

        {/* Breathing */}
        <div className="mb-12">
            <h3 className="font-bold text-[var(--primary-dark)] mb-6">{t('breath_title')}</h3>
            <div className="animate-breathe w-32 h-32 bg-[var(--primary)] rounded-full mx-auto flex items-center justify-center shadow-[0_0_30px_var(--accent)]">
                <span className="text-white font-bold text-lg">...</span>
            </div>
            <p className="mt-8 text-sm text-[var(--text-muted)]">{t('breath_instruction')}</p>
        </div>

        {/* Jokes */}
        <div className="bg-[var(--background)] p-6 rounded-[20px] border border-dashed border-[var(--secondary)]">
            <h3 className="text-[var(--secondary)] font-bold mb-2">{t('joke_title')}</h3>
            <p id="joke-display" className="italic text-[var(--text-main)] min-h-[60px] flex items-center justify-center">
                ...
            </p>
            <button onClick={showJoke} className="mt-4 bg-[var(--secondary)] text-white px-6 py-2 rounded-full font-bold shadow-sm hover:scale-105 transition-transform">
                {t('btn_next_joke')}
            </button>
        </div>
    </div>
  );
}
