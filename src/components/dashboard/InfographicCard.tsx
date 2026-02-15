'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Calendar, ArrowRight } from 'lucide-react';

export default function InfographicCard() {
  const t = useTranslations('Dashboard');

  return (
    <Link
      href="/infographie"
      className="block group relative overflow-hidden bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-secondary)] rounded-[20px] p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm shadow-inner border border-white/10">
                <Calendar size={24} className="text-white drop-shadow-sm" />
            </div>
            <div>
                <h3 className="font-bold text-lg leading-tight mb-1">
                    {t('infographic_title')}
                </h3>
                <p className="text-sm opacity-90 font-medium text-white/90 bg-black/10 px-2 py-0.5 rounded-md inline-block">
                    {t('infographic_btn')}
                </p>
            </div>
        </div>
        <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors">
            <ArrowRight size={20} className="text-white group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />
    </Link>
  );
}
