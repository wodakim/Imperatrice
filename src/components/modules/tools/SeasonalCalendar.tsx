'use client';

import { useTranslations } from 'next-intl';

export default function SeasonalCalendar() {
  const t = useTranslations('Tools'); // Using Tools scope
  // Assuming keys are like season_focus.0 in translation...
  // next-intl doesn't easy support arrays.
  // We'll use a hardcoded mapping that relies on translated month names or keys.
  // Or assume the array is accessible.
  // Workaround: We use date index and fetch specific key like `season_focus_jan`.
  // BUT the prototype uses an array.
  // Let's assume we have access to t.raw('season_focus') as array.

  let focus = [], prep = [];
  try {
      focus = t.raw('season_focus') || [];
      prep = t.raw('season_prep') || [];
  } catch (e) {
      focus = ["Error"]; prep = ["Error"];
  }

  const month = new Date().getMonth();
  const currentFocus = focus[month] || "...";
  const currentPrep = prep[month] || "...";

  return (
    <div className="bg-[var(--surface)] p-5 rounded-[var(--border-radius)] shadow-[var(--shadow-soft)]">
        <h3 className="text-lg font-bold text-[var(--primary-dark)] mb-4">{t('seasonal_title')}</h3>
        <div className="flex flex-wrap gap-4">
             <div className="flex-1 min-w-[200px] bg-[var(--background)] p-4 rounded-xl border-l-4 border-[var(--secondary)]">
                <div className="font-bold text-[var(--secondary)] mb-1">🔥 {t('season_focus_label')}</div>
                <div className="text-lg">{currentFocus}</div>
             </div>
             <div className="flex-1 min-w-[200px] bg-[var(--background)] p-4 rounded-xl border-l-4 border-[var(--primary-dark)]">
                <div className="font-bold text-[var(--primary-dark)] mb-1">👀 {t('season_prep_label')}</div>
                <div className="text-lg">{currentPrep}</div>
             </div>
        </div>
    </div>
  );
}
