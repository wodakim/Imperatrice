'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function TrophyListener() {
  const t = useTranslations('Trophies');
  const [notification, setNotification] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    const handleUnlock = (e: CustomEvent) => {
        const id = e.detail;
        const currentSaved = JSON.parse(localStorage.getItem('unlocked_trophies') || '[]');

        if(!currentSaved.includes(id)) {
            const updated = [...currentSaved, id];
            localStorage.setItem('unlocked_trophies', JSON.stringify(updated));

            // Show Notification
            // If translation is missing, it will return key.
            // Ideally we should have a fallback or check if key exists, but next-intl handles fallback gracefully (returns key).
            const name = t(`tr_n_${id}`);
            setNotification({ id, name });
            triggerConfetti();

            // Dispatch a storage event manually so other components can update if needed
            window.dispatchEvent(new Event('local-storage'));

            setTimeout(() => setNotification(null), 4000);
        }
    };

    window.addEventListener('unlockTrophy', handleUnlock as EventListener);

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
        c.style.pointerEvents = 'none';
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

  if (!notification) return null;

  return (
    <div className="fixed bottom-20 right-5 bg-[var(--color-primary-dark)] text-white px-6 py-4 rounded-[15px] shadow-2xl z-50 animate-slide-in-up flex items-center gap-4 border border-white/10">
        <div className="text-2xl">🏆</div>
        <div>
            <div className="font-bold text-sm uppercase tracking-wider opacity-80">{t('notif_trophy')}</div>
            <div className="font-bold text-lg">{notification.name}</div>
        </div>
    </div>
  );
}
