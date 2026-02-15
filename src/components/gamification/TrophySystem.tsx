'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { TROPHY_DATA } from './trophyData';
import { Trophy } from 'lucide-react';

export default function TrophySystem() {
  const t = useTranslations('Trophies');

  const [unlocked, setUnlocked] = useState<string[]>([]);

  useEffect(() => {
    // Initial load
    const loadTrophies = () => {
        const saved = localStorage.getItem('unlocked_trophies');
        if (saved) setUnlocked(JSON.parse(saved));
    };
    loadTrophies();

    // Listen for global updates (from TrophyListener)
    const handleStorageUpdate = () => {
        loadTrophies();
    };

    window.addEventListener('local-storage', handleStorageUpdate);
    // Also listen to storage event for cross-tab sync
    window.addEventListener('storage', handleStorageUpdate);

    // Auto check first visit (idempotent, handled by Listener if not already unlocked)
    setTimeout(() => {
        window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'first_visit' }));
    }, 1000);

    return () => {
        window.removeEventListener('local-storage', handleStorageUpdate);
        window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  return (
    <div className="animate-fade-in">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-2 flex items-center justify-center gap-2">
                <Trophy className="text-yellow-500" /> {t('trophy_title')}
            </h2>
            <p className="text-[var(--color-text-muted)]">
                {t('trophy_subtitle')} ({unlocked.length}/{TROPHY_DATA.length})
            </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {TROPHY_DATA.map((trophy) => {
                const isUnlocked = unlocked.includes(trophy.id);
                // Dynamic keys check
                const nameKey = `tr_n_${trophy.id}`;
                const descKey = `tr_d_${trophy.id}`;

                return (
                    <div
                        key={trophy.id}
                        className={`
                            p-4 rounded-[15px] text-center border transition-all duration-300 relative overflow-hidden group
                            ${isUnlocked
                                ? 'bg-[var(--color-surface)] border-[var(--color-secondary)] shadow-md scale-100 opacity-100'
                                : 'bg-[var(--color-bg)] border-transparent opacity-50 grayscale scale-95'}
                        `}
                    >
                        <div className="text-4xl mb-2 transition-transform group-hover:scale-110">
                            {trophy.icon}
                        </div>
                        <div className="font-bold text-sm text-[var(--color-text-main)] mb-1">
                            {t(nameKey)}
                        </div>
                        <div className={`text-xs text-[var(--color-text-muted)] ${isUnlocked ? 'block' : 'hidden group-hover:block'}`}>
                            {t(descKey)}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
}
