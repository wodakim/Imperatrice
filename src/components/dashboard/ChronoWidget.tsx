'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Clock } from 'lucide-react';

export default function ChronoWidget() {
  const t = useTranslations('Dashboard');
  const [status, setStatus] = useState<'prime' | 'good' | 'neutral'>('neutral');
  const [message, setMessage] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [dayStr, setDayStr] = useState('');
  const [seasonTip, setSeasonTip] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sun
      const hour = now.getHours();
      const month = now.getMonth(); // 0 = Jan

      // Update Time Display
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDayStr(new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(now));

      // Algo Slots (Updated via Infographic 2026)
      const slots: Record<number, number[][]> = {
        0: [[10, 12], [18, 22]], // Sun (Prime Time extended)
        1: [[19, 21]],           // Mon (Avoid morning)
        2: [[19, 21]],           // Tue
        3: [[14, 16], [18, 20]], // Wed
        4: [[19, 21]],           // Thu
        5: [[17, 23]],           // Fri (Party/Relax)
        6: [[10, 12], [17, 20]]  // Sat
      };

      const todaySlots = slots[day] || [];
      let newStatus: 'prime' | 'good' | 'neutral' = 'neutral';
      let newMessage = t('chrono_calm');

      // Check Prime
      for (const slot of todaySlots) {
        if (hour >= slot[0] && hour < slot[1]) {
          newStatus = 'prime';
          newMessage = t('chrono_prime');
          break;
        }
      }

      // Check Good (Approaching - 2h before)
      if (newStatus === 'neutral') {
        for (const slot of todaySlots) {
          if (hour >= slot[0] - 2 && hour < slot[0]) {
            newStatus = 'good';
            newMessage = t('chrono_good', { h: slot[0] });
            break;
          }
        }
      }

      setStatus(newStatus);
      setMessage(newMessage);

      // Season Tip Logic (Refined)
      let tipKey = 'tip_spring';

      if (month === 0) tipKey = 'tip_jan'; // Jan
      else if (month === 1) tipKey = 'tip_jan'; // Feb (Late winter/resolutions still active?) or tip_spring. Prototype: 0-1 -> tip_jan (which is "Sport Janvier" in prep but "Résolutions" in tip).
      else if (month >= 2 && month <= 4) tipKey = 'tip_spring'; // Mar, Apr, May
      else if (month >= 5 && month <= 7) tipKey = 'tip_summer'; // Jun, Jul, Aug
      else if (month >= 8 && month <= 10) tipKey = 'tip_autumn'; // Sep, Oct, Nov
      else if (month === 11) tipKey = 'tip_winter'; // Dec

      setSeasonTip(t(tipKey));
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [t]);

  if (!mounted) return <div className="h-[200px] animate-pulse bg-[var(--color-bg)] rounded-[20px]" />;

  const statusColor =
    status === 'prime' ? 'text-[var(--color-secondary)]' :
    status === 'good' ? 'text-[var(--color-primary-dark)]' :
    'text-[var(--color-text-muted)]';

  return (
    <div className="bg-[var(--color-surface)] rounded-[20px] p-5 shadow-[var(--shadow-soft)] card-hover h-full flex flex-col justify-between">
       <h3 className="text-lg font-bold text-[var(--color-primary-dark)] flex items-center gap-2 mb-4">
          <Clock size={20} /> {t('chrono_title')}
        </h3>

        <div className="text-center flex-1 flex flex-col justify-center">
            <div className={`text-4xl font-bold mb-1 ${statusColor}`}>
                {timeStr}
            </div>
            <div className="text-sm font-bold uppercase tracking-wider mb-2 text-[var(--color-text-main)] capitalize">
                {dayStr}
            </div>
            <div className={`font-semibold ${statusColor}`}>
                {message}
            </div>
        </div>

        <div className="mt-4 text-xs text-[var(--color-text-muted)] bg-[var(--color-bg)] p-3 rounded-xl">
            💡 {seasonTip}
        </div>
    </div>
  );
}
