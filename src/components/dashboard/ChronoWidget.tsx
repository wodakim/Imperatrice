'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Clock } from 'lucide-react';

export default function ChronoWidget() {
  const t = useTranslations('Dashboard');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const day = time.getDay();
  const hour = time.getHours();

  const slots: Record<number, number[][]> = {
    0: [[10, 12], [18, 21]],
    1: [[7, 9], [19, 21]],
    2: [[19, 21]],
    3: [[12, 14], [18, 20]],
    4: [[19, 21]],
    5: [[13, 16], [20, 23]],
    6: [[9, 11], [17, 19]]
  };

  const todaySlots = slots[day] || [];
  let status = "neutral";
  let message = t('chrono_calm');

  for(let slot of todaySlots) {
    if(hour >= slot[0] && hour < slot[1]) {
      status = "prime";
      message = t('chrono_prime');
      break;
    }
    if(hour >= slot[0] - 2 && hour < slot[0]) {
      status = "good";
      message = t('chrono_good', { h: slot[0] });
    }
  }

  const colorClass = status === 'prime'
    ? 'text-[var(--color-secondary)] animate-pulse'
    : status === 'good'
      ? 'text-[var(--color-primary-dark)]'
      : 'text-[var(--color-text-muted)]';

  const dayName = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(time);
  const dayNameCap = dayName.charAt(0).toUpperCase() + dayName.slice(1);

  const month = time.getMonth();
  let seasonTipKey = 'tip_spring';
  if(month >= 7 && month <= 8) seasonTipKey = 'tip_autumn';
  else if(month >= 10) seasonTipKey = 'tip_winter';
  else if(month >= 0 && month <= 1) seasonTipKey = 'tip_jan';
  else if(month >= 3 && month <= 5) seasonTipKey = 'tip_summer';

  const seasonTip = t(seasonTipKey);

  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)] flex flex-col items-center justify-between h-full card-hover">
      <div className="flex items-center gap-2 mb-4 w-full justify-start text-[var(--color-primary-dark)]">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <h3 className="text-lg font-bold">{t('chrono_title')}</h3>
      </div>

      <div className="text-center mb-6">
        <div className={`text-4xl font-bold mb-1 tracking-wider font-mono ${colorClass}`}>
          {time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
        <div className="text-sm uppercase font-bold text-[var(--color-text-muted)] mb-3 tracking-wide">
          {dayNameCap}
        </div>
        <div className={`font-semibold text-lg ${colorClass}`}>
          {message}
        </div>
      </div>

      <div className="mt-auto w-full text-sm bg-[var(--color-bg)] p-3 rounded-xl border border-[var(--color-accent)]/20">
        💡 {seasonTip}
      </div>
    </div>
  );
}
