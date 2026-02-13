'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const trophyList = [
    { id: 'first_visit', icon: '👋' },
    { id: 'dark_mode', icon: '🌙' },
    { id: 'seo_master', icon: '✍️' },
    { id: 'photo_pro', icon: '📸' },
    { id: 'spoon_saver', icon: '🥄' },
    { id: 'gamer', icon: '🎮' },
    { id: 'high_score_100', icon: '💯' },
    { id: 'relax_master', icon: '🧘‍♀️' },
    { id: 'copy_paste', icon: '📋' },
    { id: 'explorer', icon: '🧭' },
    { id: 'panic_button', icon: '💖' },
    { id: 'trend_setter', icon: '👗' },
    { id: 'profit_calc', icon: '💰' },
    { id: 'packing_done', icon: '📦' },
    { id: 'diplomat', icon: '🤝' },
    { id: 'night_owl', icon: '🦉' },
    { id: 'early_bird', icon: '🐦' },
    { id: 'weekend_warrior', icon: '🎉' },
    { id: 'score_500', icon: '🏆' },
    { id: 'combo_master', icon: '🔥' },
    { id: 'seasonal_check', icon: '📅' },
    { id: 'breath_deep', icon: '🌬' },
    { id: 'joke_lover', icon: '😂' },
    { id: 'full_battery', icon: '⚡' },
    { id: 'low_battery', icon: '🪫' },
    { id: 'studio_master', icon: '🎬' },
    { id: 'tag_collector', icon: '🏷' },
    { id: 'share_love', icon: '💌' },
    { id: 'expert_seller', icon: '🎓' },
    { id: 'imperatrice', icon: '👑' }
];

export default function TrophySystem() {
  const t = useTranslations('Trophies');
  const tRoot = useTranslations(); // For tr_n_... keys

  const [unlocked, setUnlocked] = useState<string[]>([]);

  useEffect(() => {
      const saved = JSON.parse(localStorage.getItem('unlocked_trophies') || '[]');
      setUnlocked(saved);

      const handleUnlock = (e: any) => {
          const id = e.detail;
          if (!saved.includes(id)) {
              const newUnlocked = [...saved, id];
              setUnlocked(newUnlocked);
              localStorage.setItem('unlocked_trophies', JSON.stringify(newUnlocked));

              // Notification logic here (simplified console/alert for now, or Toast)
              // We'll rely on the ToastProvider later
          }
      };

      window.addEventListener('unlockTrophy', handleUnlock);
      return () => window.removeEventListener('unlockTrophy', handleUnlock);
  }, []);

  return (
    <div className="animate-fade-in bg-[var(--surface)] p-5 rounded-[var(--border-radius)] shadow-[var(--shadow-soft)]">
        <h2 className="text-xl font-bold text-[var(--primary-dark)] mb-2">{t('trophy_title')}</h2>
        <p className="text-[var(--text-muted)] mb-6">{t('trophy_subtitle')}</p>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {trophyList.map(trophy => {
                const isUnlocked = unlocked.includes(trophy.id);
                return (
                    <div
                        key={trophy.id}
                        className={`
                            p-3 rounded-xl text-center border-2 transition-all duration-300
                            ${isUnlocked
                                ? 'bg-[var(--surface)] border-[var(--secondary)] opacity-100 scale-105 shadow-md'
                                : 'bg-[var(--background)] border-transparent opacity-40 grayscale'}
                        `}
                        title={isUnlocked ? tRoot(`tr_d_${trophy.id}`) : "Locked"}
                    >
                        <div className="text-3xl mb-2">{trophy.icon}</div>
                        <div className="text-xs font-bold truncate text-[var(--text-main)]">
                            {tRoot(`tr_n_${trophy.id}`)}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
}
