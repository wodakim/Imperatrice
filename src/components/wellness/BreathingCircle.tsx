'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function BreathingCircle() {
  const t = useTranslations('Dashboard'); // Keys are flat in Dashboard/Root based on JSON structure
  const [phase, setPhase] = useState('Inspire');

  useEffect(() => {
    const interval = setInterval(() => {
        setPhase(prev => prev === 'Inspire' ? 'Expire' : 'Inspire');
    }, 4000); // 4s cycle
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[var(--color-surface)] rounded-[20px] shadow-[var(--shadow-soft)] card-hover">
        <h3 className="text-lg font-bold text-[var(--color-primary-dark)] mb-6">
            {t('breath_title')}
        </h3>

        <div className="relative flex items-center justify-center w-32 h-32">
            {/* Pulsing Circle with CSS Animation */}
            <div className="absolute w-full h-full rounded-full animate-breathe flex items-center justify-center">
                 <span className="relative z-10 font-bold text-white text-xl drop-shadow-md">
                    {phase}
                </span>
            </div>
        </div>

        <p className="mt-8 text-sm text-[var(--color-text-muted)] text-center max-w-xs">
            {t('breath_instruction')}
        </p>
    </div>
  );
}
