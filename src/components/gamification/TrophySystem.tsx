'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { TROPHY_DATA } from './trophyData';
import { Trophy } from 'lucide-react';

export default function TrophySystem() {
  const t = useTranslations('Trophies');
  const t_dash = useTranslations('Dashboard'); // For notification prefix "notif_trophy"

  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('unlocked_trophies');
    if (saved) setUnlocked(JSON.parse(saved));

    const handleUnlock = (e: CustomEvent) => {
        const id = e.detail;
        const currentSaved = JSON.parse(localStorage.getItem('unlocked_trophies') || '[]');

        if(!currentSaved.includes(id)) {
            const updated = [...currentSaved, id];
            localStorage.setItem('unlocked_trophies', JSON.stringify(updated));
            setUnlocked(updated);

            // Show Notification
            // Note: We need to access translation dynamically.
            // Since we are inside the component, t is available.
            // Keys: tr_n_first_visit, etc.
            const name = t(`tr_n_${id}`);

            setNotification({ id, name });
            triggerConfetti();
            setTimeout(() => setNotification(null), 4000);
        }
    };

    window.addEventListener('unlockTrophy', handleUnlock as EventListener);

    // Auto check first visit
    setTimeout(() => {
        window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'first_visit' }));
    }, 1000);

    return () => window.removeEventListener('unlockTrophy', handleUnlock as EventListener);
  }, [t]);

  function triggerConfetti() {
    for(let i=0; i<30; i++) {
        const c = document.createElement('div');
        c.style.position = 'fixed';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.top = '-10px';
        c.style.width = '10px';
        c.style.height = '10px';
        c.style.backgroundColor = ['#FFD700', '#FF69B4', '#00BFFF', '#32CD32'][Math.floor(Math.random()*4)];
        c.style.zIndex = '9999';
        c.style.borderRadius = '50%';
        document.body.appendChild(c);

        c.animate([
            { transform: `translateY(0) rotate(0)`, opacity: 1 },
            { transform: `translateY(100vh) rotate(720deg)`, opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 2000,
            easing: 'linear'
        }).onfinish = () => c.remove();
    }
  }

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

        {/* Toast */}
        {notification && (
            <div className="fixed bottom-20 right-5 bg-[var(--color-primary-dark)] text-white px-6 py-4 rounded-[15px] shadow-2xl z-50 animate-slide-in-up flex items-center gap-4">
                <div className="text-2xl">🏆</div>
                <div>
                    <div className="font-bold text-sm uppercase tracking-wider opacity-80">{t_dash('notif_trophy')}</div>
                    <div className="font-bold text-lg">{notification.name}</div>
                </div>
            </div>
        )}
    </div>
  );
}
