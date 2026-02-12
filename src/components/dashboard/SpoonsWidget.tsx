'use client';

import { Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

const SpoonIcon = ({ size = 24, fill = "none", className = "" }: { size?: number, fill?: string, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z"></path>
    <path d="M12 12v10"></path>
  </svg>
);

export default function SpoonsWidget({ spoons, setSpoons }: { spoons: number; setSpoons: (val: number) => void }) {
  const t = useTranslations('Dashboard');
  const MAX_SPOONS = 12;

  const updateSpoons = (val: number) => {
    // Toggle logic: if clicking the current max, decrease by 1. Else set to clicked value.
    const newVal = val === spoons ? val - 1 : val;
    setSpoons(newVal);
  };

  let color = 'text-[var(--color-text-muted)]';
  let advice = t('spoons_low');

  if (spoons > 8) {
    color = 'text-[var(--color-success)]';
    advice = t('spoons_high');
  } else if (spoons > 4) {
    color = 'text-[var(--color-warning)]';
    advice = t('spoons_mid');
  }

  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)] flex flex-col items-center transition-transform hover:scale-[1.02]">
      <div className="flex justify-between w-full mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-[var(--color-primary-dark)]">
          {/* Prototype uses a Clock-like icon for title, oddly */}
          <Clock size={20} />
          {t('spoons_title')}
        </h3>
        <button className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
          ℹ️
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {Array.from({ length: MAX_SPOONS }).map((_, i) => {
          const spoonNum = i + 1;
          const active = spoonNum <= spoons;
          return (
            <button
              key={i}
              onClick={() => updateSpoons(spoonNum)}
              className={`p-1 transition-all duration-200 ${
                active ? 'text-[var(--color-primary-dark)] scale-110 opacity-100' : 'text-[var(--color-text-muted)] opacity-30 scale-90'
              }`}
              aria-label={`${spoonNum} cuillères`}
            >
              <SpoonIcon size={24} fill={active ? 'currentColor' : 'none'} />
            </button>
          );
        })}
      </div>

      <div className="text-center">
        <p className={`text-2xl font-bold mb-1 ${color}`}>
          {spoons} / {MAX_SPOONS} Cuillères
        </p>
        <p className="text-sm text-[var(--color-text-muted)] italic">
          {advice}
        </p>
      </div>
    </div>
  );
}
