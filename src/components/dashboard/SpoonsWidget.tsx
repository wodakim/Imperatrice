import { Zap, Battery, BatteryCharging, BatteryFull } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function SpoonsWidget({ spoons, setSpoons }: { spoons: number; setSpoons: (val: number) => void }) {
  const t = useTranslations('Dashboard');
  const MAX_SPOONS = 12;

  const updateSpoons = (val: number) => {
    const newVal = val === spoons ? val - 1 : val;
    setSpoons(newVal);
  };

  let Icon = Battery;
  let color = 'text-[var(--color-text-muted)]';
  let advice = t('spoons_low');

  if (spoons > 8) {
    Icon = BatteryFull;
    color = 'text-[var(--color-success)]';
    advice = t('spoons_high');
  } else if (spoons > 4) {
    Icon = BatteryCharging;
    color = 'text-[var(--color-warning)]';
    advice = t('spoons_mid');
  }

  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)] flex flex-col items-center transition-transform hover:scale-[1.02]">
      <div className="flex justify-between w-full mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-[var(--color-primary-dark)]">
          <Zap size={20} /> {t('spoons_title')}
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
                active ? 'text-[var(--color-primary-dark)] scale-110' : 'text-[var(--color-text-muted)] opacity-30 scale-90'
              }`}
              aria-label={`${spoonNum} cuillères`}
            >
              <Zap size={24} fill={active ? 'currentColor' : 'none'} />
            </button>
          );
        })}
      </div>

      <div className="text-center">
        <p className={`text-2xl font-bold mb-1 ${color}`}>
          {spoons} / {MAX_SPOONS}
        </p>
        <p className="text-sm text-[var(--color-text-muted)] italic">
          {advice}
        </p>
      </div>
    </div>
  );
}
