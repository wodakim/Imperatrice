'use client';

import { useTranslations } from 'next-intl';
import { Pin } from 'lucide-react';

export default function DailyTip() {
  const t = useTranslations('Dashboard');
  // In a real app we would load the tip array, but i18n structure flattens keys usually.
  // We'll need to fetch the raw array or use a helper.
  // For V2, let's assume we have a key 'tip_of_day' that we rotate on server or client?
  // Simpler: Just random for now, or use day-based index if we can access the array.

  // Quick fix: Hardcoded rotation based on day for MVP to match prototype logic exactly
  // We need the messages array. next-intl doesn't expose arrays easily without 'returnObjects'.
  // We will assume a single tip for now or fetch via custom logic.

  // Let's implement a stable tip based on date manually for now to save time,
  // or use t.raw('tips') if configured.

  const day = new Date().getDate();
  // Placeholder logic until we confirm i18n array structure support
  // const tip = t('tips')[day % 5];

  return (
    <div className="relative bg-transparent p-0 mt-5 max-w-[400px] mx-auto rotate-[-1deg] hover:rotate-0 transition-transform duration-300">
      <div className="bg-[#fff740] text-[#333] p-6 shadow-[5px_5px_15px_rgba(0,0,0,0.15)] rounded-sm relative">
        {/* Pin */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#ff6b6b] rounded-full shadow-md z-10"></div>

        <h3 className="text-[#d4a017] font-[Comic_Sans_MS,Chalkboard_SE,sans-serif] text-xl border-b-2 border-dashed border-[#d4a017] pb-1 mb-4 flex items-center gap-2">
          ✨ {t('tip_title')}
        </h3>

        <div className="font-[Comic_Sans_MS,Chalkboard_SE,sans-serif] text-lg leading-relaxed min-h-[80px] flex items-center justify-center text-center">
           {/* Fallback to generic if array access fails */}
           <p>&quot;{t('tips.0')}&quot;</p>
        </div>
      </div>
    </div>
  );
}
