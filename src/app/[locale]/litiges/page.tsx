'use client';

import LitigeShield from '@/components/litiges/LitigeShield';
import { useTranslations } from 'next-intl';

export default function LitigePage() {
  const t = useTranslations('Litiges');

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <LitigeShield />
    </div>
  );
}
