'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Clock } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function ChronoWidget() {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const [timeData, setTimeData] = useState<{status: string, message: string, color: string} | null>(null);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDay, setCurrentDay] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(updateChrono, 60000); // Every minute
    updateChrono();
    return () => clearInterval(interval);
  }, [locale]); // Re-run if locale changes

  const updateChrono = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    // Formatting
    setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const dayName = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(now);
    setCurrentDay(dayName.charAt(0).toUpperCase() + dayName.slice(1));

    // Logic
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
    let status = "neutral";
    let message = t('chrono_calm');

    for(let slot of todaySlots) {
        if(hour >= slot[0] && hour < slot[1]) {
            status = "prime";
            message = t('chrono_prime');
            break;
        }
    }

    if(status === "neutral") {
        for(let slot of todaySlots) {
             if(hour >= slot[0] - 2 && hour < slot[0]) {
                 status = "good";
                 message = t('chrono_good', {h: slot[0]});
                 break;
             }
        }
    }

    let color = "var(--text-muted)";
    if(status === "prime") color = "var(--secondary)";
    if(status === "good") color = "var(--primary-dark)";

    setTimeData({ status, message, color });
  };

  if (!mounted || !timeData) return null;

  return (
    <div className="bg-[var(--surface)] p-5 rounded-[var(--border-radius)] shadow-[var(--shadow-soft)] h-full flex flex-col justify-between">
      <h3 className="text-lg font-bold text-[var(--primary-dark)] flex items-center gap-2 m-0 mb-4">
        <Clock size={20} />
        {t('chrono_title')}
      </h3>

      <div className="text-center flex-1 flex flex-col justify-center">
        <div className="text-4xl font-bold mb-1" style={{ color: timeData.color }}>{currentTime}</div>
        <div className="font-bold mb-2 text-[var(--text-main)]">{currentDay}</div>
        <div className="font-semibold text-sm animate-pulse" style={{ color: timeData.color }}>
            {timeData.message}
        </div>
      </div>
    </div>
  );
}
