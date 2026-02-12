'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Info } from 'lucide-react';

const SPOON_MAX = 12;

export default function SpoonsWidget() {
  const t = useTranslations('Dashboard');
  const [spoons, setSpoons] = useState(SPOON_MAX);
  const [showInfo, setShowInfo] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Persistence Logic
    const saved = localStorage.getItem('spoons');
    const savedDate = localStorage.getItem('spoons_date');
    const today = new Date().toDateString();

    if (savedDate !== today) {
      // Reset if new day
      setSpoons(SPOON_MAX);
      localStorage.setItem('spoons', SPOON_MAX.toString());
      localStorage.setItem('spoons_date', today);
    } else if (saved !== null) {
      setSpoons(parseInt(saved, 10));
    }
    setMounted(true);
  }, []);

  const updateSpoons = (newCount: number) => {
    const validCount = Math.max(0, Math.min(newCount, SPOON_MAX));
    setSpoons(validCount);
    localStorage.setItem('spoons', validCount.toString());
    // Update date to avoid reset on refresh same day
    localStorage.setItem('spoons_date', new Date().toDateString());

    // Check for Spoon Saver Trophy
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'spoon_saver' }));
        if(validCount === 12) window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'full_battery' }));
        if(validCount < 3) window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'low_battery' }));
    }
  };

  if (!mounted) return <div className="h-[200px] animate-pulse bg-[var(--color-bg)] rounded-[20px]" />;

  let advice = "";
  if (spoons > 8) advice = t('spoons_high');
  else if (spoons > 4) advice = t('spoons_mid');
  else advice = t('spoons_low');

  return (
    <div className="bg-[var(--color-surface)] rounded-[20px] p-5 shadow-[var(--shadow-soft)] card-hover h-full flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[var(--color-primary-dark)] flex items-center gap-2">
          🥄 {t('spoons_title')}
        </h3>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-[var(--color-primary-dark)] hover:bg-[var(--color-bg)] p-1 rounded-full transition-colors"
        >
          <Info size={18} />
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {Array.from({ length: SPOON_MAX }).map((_, i) => {
          const spoonIndex = i + 1;
          const isActive = spoonIndex <= spoons;

          return (
            <button
              key={i}
              onClick={() => {
                  // Toggle logic: if clicking active last spoon, decrease. Else set to index.
                  if(isActive && spoonIndex === spoons) updateSpoons(spoonIndex - 1);
                  else updateSpoons(spoonIndex);
              }}
              className={`
                transition-all duration-200 transform active:scale-95 p-1
                ${isActive ? 'opacity-100 text-[var(--color-primary-dark)]' : 'opacity-30 text-[var(--color-text-muted)]'}
              `}
              aria-label={`${spoonIndex} cuillères`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z"></path>
                <path d="M12 12v10"></path>
              </svg>
            </button>
          );
        })}
      </div>

      <div className="text-center">
        <p className="font-bold text-[var(--color-primary-dark)] mb-1">
          {spoons} / {SPOON_MAX}
        </p>
        <p className="text-sm text-[var(--color-text-muted)] min-h-[40px]">
          {advice}
        </p>
      </div>

      {showInfo && (
        <div className="mt-4 text-xs text-[var(--color-text-muted)] bg-[var(--color-bg)] p-3 rounded-xl animate-in fade-in slide-in-from-top-2">
          <strong className="block mb-1">Coût Énergétique :</strong>
          <ul className="list-disc pl-4 space-y-1">
            <li>📸 Shooting (10 articles) : <b>4-5</b></li>
            <li>📝 Rédaction : <b>3</b></li>
            <li>📦 Colis : <b>3</b></li>
            <li>💬 Messages : <b>1</b></li>
          </ul>
        </div>
      )}
    </div>
  );
}
