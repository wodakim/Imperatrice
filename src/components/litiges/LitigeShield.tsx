'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import LitigeDiagnostic from './LitigeDiagnostic';
import LitigeDashboard from './LitigeDashboard';
import { LitigeStrategy } from '@/data/litiges_strategies';
import { motion, AnimatePresence } from 'framer-motion';

export default function LitigeShield() {
  const t = useTranslations('Litiges');
  const [currentStrategy, setCurrentStrategy] = useState<LitigeStrategy | null>(null);

  const handleStrategySelect = (strategy: LitigeStrategy) => {
    setCurrentStrategy(strategy);
    // Smooth scroll to dashboard
    setTimeout(() => {
        document.getElementById('strategy-dashboard')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8 pb-24">
      {/* Header / Intro */}
      <section className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-serif text-[var(--color-text-primary)] mb-3">{t('title')}</h1>
        <p className="text-[var(--color-text-muted)]">
          {t('desc')}
        </p>
      </section>

      {/* Step 1: Diagnostic */}
      <LitigeDiagnostic onStrategySelect={handleStrategySelect} />

      {/* Step 2: Dashboard (Animated) */}
      <AnimatePresence>
        {currentStrategy && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            id="strategy-dashboard"
          >
            <LitigeDashboard strategy={currentStrategy} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
