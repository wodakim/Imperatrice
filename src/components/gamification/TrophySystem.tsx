'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { TROPHY_DATA } from './trophyData';
import { Trophy } from 'lucide-react';

export default function TrophySystem() {
  const t = useTranslations('Trophies');

  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    // Initial Load
    const saved = localStorage.getItem('unlocked_trophies');
    if (saved) setUnlocked(JSON.parse(saved));

    // Event Listener for unlocking
    const handleUnlock = (e: CustomEvent) => {
        const id = e.detail;

        // Simplified: re-read local storage to be safe
        const currentSaved = JSON.parse(localStorage.getItem('unlocked_trophies') || '[]');
        if(!currentSaved.includes(id)) {
            const updated = [...currentSaved, id];
            localStorage.setItem('unlocked_trophies', JSON.stringify(updated));
            setUnlocked(updated);

            // Show Notification
            const trophyDef = TROPHY_DATA.find(tDef => tDef.id === id);
            if(trophyDef) {
                setNotification({ id, name: t(`tr_n_${id}`) }); // Assuming keys exist
                triggerConfetti();
                setTimeout(() => setNotification(null), 4000);
            }
        }
    };

    window.addEventListener('unlockTrophy', handleUnlock as EventListener);

    // Auto-unlock 'first_visit'
    window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'first_visit' }));

    return () => window.removeEventListener('unlockTrophy', handleUnlock as EventListener);
  }, [t]);

  function triggerConfetti() {
    // Simple DOM confetti
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

  // Render Grid
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
                            {t(`tr_n_${trophy.id}`)}
                        </div>
                        <div className={`text-xs text-[var(--color-text-muted)] ${isUnlocked ? 'block' : 'hidden group-hover:block'}`}>
                            {t(`tr_d_${trophy.id}`)}
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Toast Notification */}
        {notification && (
            <div className="fixed bottom-20 right-5 bg-[var(--color-primary-dark)] text-white px-6 py-4 rounded-[15px] shadow-2xl z-50 animate-slide-in-up flex items-center gap-4">
                <div className="text-2xl">🏆</div>
                <div>
                    <div className="font-bold text-sm uppercase tracking-wider opacity-80">Succès débloqué</div>
                    <div className="font-bold text-lg">{notification.name}</div>
                </div>
            </div>
        )}
    </div>
  );
}
