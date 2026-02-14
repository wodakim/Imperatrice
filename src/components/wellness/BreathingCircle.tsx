'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';

export default function BreathingCircle() {
  const t = useTranslations('Dashboard');
  const [phase, setPhase] = useState<'Inspire' | 'Expire'>('Inspire');

  useEffect(() => {
    const interval = setInterval(() => {
        setPhase(prev => prev === 'Inspire' ? 'Expire' : 'Inspire');
    }, 4000); // 4s cycle

    // Achievement check
    if(typeof window !== 'undefined') {
        const timer = setTimeout(() => {
            window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'breath_deep' }));
        }, 10000); // 10s usage
        return () => { clearTimeout(timer); clearInterval(interval); };
    }
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[var(--color-surface)] rounded-[20px] shadow-[var(--shadow-soft)] card-hover h-full">
        <h3 className="text-lg font-bold text-[var(--color-primary-dark)] mb-6 flex items-center gap-2">
           <Wind size={20} /> {t('breath_title')}
        </h3>

        <div className="relative flex items-center justify-center w-40 h-40">
            {/* Pulsing Circle */}
            <motion.div
                className="absolute w-24 h-24 rounded-full bg-[var(--color-primary)] opacity-80 shadow-lg shadow-[var(--color-accent)]"
                animate={{
                    scale: [1, 1.6, 1],
                    opacity: [0.8, 1, 0.8],
                    backgroundColor: ["var(--color-primary)", "var(--color-primary-dark)", "var(--color-primary)"]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <span className="relative z-10 font-bold text-white text-xl drop-shadow-md">
                {phase}
            </span>
        </div>

        <p className="mt-8 text-sm text-[var(--color-text-muted)] text-center max-w-xs">
            {t('breath_instruction')}
        </p>
    </div>
  );
}
