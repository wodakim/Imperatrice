'use client';

import BreathingCircle from '@/components/wellness/BreathingCircle';
import JokeGenerator from '@/components/wellness/JokeGenerator';
import { useTranslations } from 'next-intl';

export default function RelaxPage() {
    const t = useTranslations('Dashboard');

  return (
    <div className="max-w-2xl mx-auto text-center animate-fade-in space-y-8">
      <div>
          <h2 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-2">
             {t('relax_title')}
          </h2>
          <p className="text-[var(--color-text-muted)]">
             {t('relax_subtitle')}
          </p>
      </div>

      <BreathingCircle />
      <JokeGenerator />
    </div>
  );
}
