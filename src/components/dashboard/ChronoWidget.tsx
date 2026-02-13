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
      const month = now.getMonth();

      // Update Time Display
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      // Use standard formatting for day
      setDayStr(new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(now));

      // Algo Slots
      const slots: Record<number, number[][]> = {
        0: [[10, 12], [18, 21]], // Sun
        1: [[7, 9], [19, 21]],   // Mon
        2: [[19, 21]],           // Tue
        3: [[12, 14], [18, 20]], // Wed
        4: [[19, 21]],           // Thu
        5: [[13, 16], [20, 23]], // Fri
        6: [[9, 11], [17, 19]]   // Sat
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

      // Season Tip Logic
      // 0=Jan, 1=Feb, 2=Mar, 3=Apr, 4=May, 5=Jun, 6=Jul, 7=Aug, 8=Sep, 9=Oct, 10=Nov, 11=Dec
      // Match prototype logic or month specific logic
      // Proto had logic: 7-8 autumn, 10-11 winter, 0-1 jan, 3-5 summer, else spring
      // Let's implement full coverage or fallback

      let tipKey = 'tip_spring';
      if(month >= 7 && month <= 8) tipKey = 'tip_autumn';
      else if(month >= 10 || month === 11) tipKey = 'tip_winter';
      else if(month >= 0 && month <= 1) tipKey = 'tip_jan';
      else if(month >= 3 && month <= 5) tipKey = 'tip_summer';
      // Fallback for others (March, June/Sept edge cases not fully covered in proto logic?
      // Proto: "else seasonTip = d.tip_spring;" covers it.

      // We must ensure these keys exist in translation files.
      // Based on extract_i18n output, they are in 'Dashboard' namespace if flattened,
      // or we need to access them properly.
      // The extract script creates a flat JSON usually.

      // Let's use t directly.
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
            <div className="text-sm font-bold uppercase tracking-wider mb-2 text-[var(--color-text-main)]">
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
