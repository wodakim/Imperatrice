'use client';

import { useTranslations } from 'next-intl';

export default function SeasonalCalendar() {
  const t = useTranslations('Tools');
  const month = new Date().getMonth();

  const focus = t(`season_focus.${month}`);
  const prep = t(`season_prep.${month}`);

  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-[20px] shadow-[var(--shadow-soft)] card-hover col-span-1 md:col-span-2">
        <h3 className="text-lg font-bold text-[var(--color-primary-dark)] mb-4">
            {t('seasonal_title')}
        </h3>

        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-[var(--color-bg)] p-4 rounded-xl border-l-4 border-[var(--color-secondary)]">
                <div className="font-bold text-[var(--color-secondary)] text-sm mb-1 uppercase tracking-wider">
                    🔥 {t('season_focus_label')}
                </div>
                <div className="text-lg font-medium">{focus}</div>
            </div>

            <div className="flex-1 bg-[var(--color-bg)] p-4 rounded-xl border-l-4 border-[var(--color-primary-dark)]">
                <div className="font-bold text-[var(--color-primary-dark)] text-sm mb-1 uppercase tracking-wider">
                    👀 {t('season_prep_label')}
                </div>
                <div className="text-lg font-medium">{prep}</div>
            </div>
        </div>
    </div>
  );
}
