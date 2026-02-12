'use client';

import { useTranslations } from 'next-intl';
import { TROPHIES } from '@/lib/trophies';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function TrophiesPage() {
  const t = useTranslations('Trophies');
  const [unlockedTrophies] = useLocalStorage<string[]>('unlocked_trophies', []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-[var(--color-primary-dark)] text-center">
        {t('trophy_title')}
      </h2>
      <p className="text-center text-[var(--color-text-muted)]">{t('trophy_subtitle')}</p>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {TROPHIES.map(tr => {
            const isUnlocked = unlockedTrophies.includes(tr.id);
            return (
                <div
                    key={tr.id}
                    className={`aspect-square flex flex-col items-center justify-center p-4 rounded-[var(--radius-lg)] transition-all duration-300 group relative ${
                        isUnlocked
                        ? 'bg-[var(--color-surface)] shadow-[var(--shadow-soft)] scale-100 opacity-100 border-2 border-[var(--color-secondary)]'
                        : 'bg-[var(--color-bg)] opacity-50 grayscale scale-95'
                    }`}
                >
                    <div className="text-3xl mb-2 filter drop-shadow-sm transition-transform group-hover:scale-110">{tr.icon}</div>
                    <div className="text-[10px] uppercase font-bold text-center tracking-widest text-[var(--color-text-main)] truncate w-full">
                        {t(`tr_n_${tr.id}`)}
                    </div>
                    {/* Tooltip on Hover */}
                    <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 bg-black/80 text-white text-xs p-2 rounded pointer-events-none transition-opacity z-10 w-32 text-center">
                        {t(`tr_d_${tr.id}`)}
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
}
