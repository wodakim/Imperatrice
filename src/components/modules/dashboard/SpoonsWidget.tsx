'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const SPOON_MAX = 12;

export default function SpoonsWidget() {
  const t = useTranslations('Dashboard');
  const [spoons, setSpoons] = useState(SPOON_MAX);
  const [showDetails, setShowDetails] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('spoons');
    const savedDate = localStorage.getItem('spoons_date');
    const today = new Date().toDateString();

    if (savedDate !== today) {
      setSpoons(SPOON_MAX);
      localStorage.setItem('spoons', SPOON_MAX.toString());
      localStorage.setItem('spoons_date', today);
    } else if (saved !== null) {
      setSpoons(parseInt(saved, 10));
    }
  }, []);

  const updateSpoons = (count: number) => {
    setSpoons(count);
    localStorage.setItem('spoons', count.toString());
    localStorage.setItem('spoons_date', new Date().toDateString());

    // Unlock trophy logic here later
    if(count < 3) window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'low_battery' }));
  };

  if (!mounted) return null;

  let advice = "";
  if (spoons > 8) advice = t('spoons_high');
  else if (spoons > 4) advice = t('spoons_mid');
  else advice = t('spoons_low');

  return (
    <div className="bg-[var(--surface)] p-5 rounded-[var(--border-radius)] shadow-[var(--shadow-soft)] transition-all">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[var(--primary-dark)] flex items-center gap-2 m-0">
          <AlertTriangle size={20} />
          {t('spoons_title')}
        </h3>
        <button onClick={() => setShowDetails(!showDetails)} className="text-[var(--primary-dark)] hover:scale-110 transition-transform">
          <Info size={20} />
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {Array.from({ length: SPOON_MAX }).map((_, i) => {
          const spoonIndex = i + 1;
          const isActive = spoonIndex <= spoons;
          return (
            <button
              key={i}
              onClick={() => updateSpoons(isActive && spoonIndex === spoons ? spoonIndex - 1 : spoonIndex)}
              className={cn(
                "p-1.5 transition-all duration-200 hover:scale-110",
                isActive ? "text-[var(--primary-dark)] opacity-100" : "text-[var(--text-muted)] opacity-30"
              )}
              aria-label={`${spoonIndex} spoons`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z"></path>
                <path d="M12 12v10"></path>
              </svg>
            </button>
          );
        })}
      </div>

      <p className="text-center font-bold text-[var(--primary-dark)] mb-2">
        {spoons} / {SPOON_MAX}
      </p>

      <p className="text-center text-sm text-[var(--text-muted)] italic animate-fade-in">
        {advice}
      </p>

      {showDetails && (
        <div className="mt-4 p-3 bg-[var(--background)] rounded-lg text-xs text-[var(--text-muted)] animate-fade-in">
            <strong className="block mb-2">Coût Énergétique :</strong>
            <ul className="list-disc pl-5 space-y-1">
                <li>📸 Shooting (10 articles) : <b>4-5 Cuillères</b></li>
                <li>📝 Rédaction & Mise en ligne : <b>3 Cuillères</b></li>
                <li>📦 Emballage colis : <b>3 Cuillères</b></li>
                <li>🚶‍♀️ Dépôt Point Relais : <b>2-4 Cuillères</b></li>
                <li>💬 Réponses messages : <b>1 Cuillère</b></li>
            </ul>
        </div>
      )}
    </div>
  );
}
