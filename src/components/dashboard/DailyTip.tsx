'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function DailyTip() {
  const t = useTranslations('Dashboard');
  const t_tips = useTranslations('tips'); // Access the array tips directly by index

  const [tip, setTip] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Select tip based on day of month for consistency
    const day = new Date().getDate();
    const tipIndex = day % 9;
    setTip(t_tips(`${tipIndex}`));
    setMounted(true);
  }, [t_tips]);

  if (!mounted) return <div className="h-[150px] animate-pulse bg-[var(--color-bg)] rounded-[20px]" />;

  return (
    <div className="relative transform rotate-[-1deg] hover:rotate-0 transition-transform duration-300 max-w-md mx-auto w-full mt-4">
        {/* Pin */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#ff6b6b] shadow-md z-10 border border-[#d64545]" />

        <div className="bg-[#fff740] text-[#333] p-6 shadow-xl rounded-[2px] font-comic">
            <h3 className="text-center text-[#d4a017] text-lg font-bold border-b-2 border-dashed border-[#d4a017] pb-2 mb-4 font-comic">
                ✨ {t('tip_title')}
            </h3>
            <p className="text-center text-lg leading-relaxed font-comic">
                &quot;{tip}&quot;
            </p>
        </div>
    </div>
  );
}
