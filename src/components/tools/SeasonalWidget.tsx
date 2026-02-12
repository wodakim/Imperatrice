'use client';

import { useTranslations } from 'next-intl';

export default function SeasonalWidget() {
  const t = useTranslations('Tools');

  // Use raw access for arrays or just assume monthly indices
  // The provided i18n structure has arrays for season_focus and season_prep
  // I will need to use messages or map manually if useTranslations doesn't support array access by index easily without keys.
  // Actually, t('season_focus.0') works if the JSON is nested, but here it is an array.
  // "season_focus": ["...", "..."]
  // t.raw('season_focus') returns the array.

  // Since I can't easily use t.raw with type safety without configuration,
  // I'll try to get the array. If not, I'll fallback or use a different strategy.
  // The standard way in next-intl for arrays is t.raw() if configured, or just iterating keys 0..11.

  const month = new Date().getMonth(); // 0-11

  // Helper to safely get array item
  const getArrayItem = (key: string, idx: number) => {
    try {
        // This relies on next-intl returning the string at index
        return t(`${key}.${idx}`);
    } catch (e) {
        return "...";
    }
  };

  const focus = getArrayItem('season_focus', month);
  const prep = getArrayItem('season_prep', month);

  return (
    <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[250px] bg-[var(--color-bg)] p-4 rounded-[var(--radius-lg)] border-l-4 border-[var(--color-secondary)] shadow-sm">
            <div className="font-bold text-[var(--color-secondary)] mb-2 uppercase tracking-wide text-xs">🔥 {t('season_focus_label') || "À Vendre"}</div>
            <div className="text-lg font-medium text-[var(--color-text-main)]">{focus}</div>
        </div>
        <div className="flex-1 min-w-[250px] bg-[var(--color-bg)] p-4 rounded-[var(--radius-lg)] border-l-4 border-[var(--color-primary-dark)] shadow-sm">
            <div className="font-bold text-[var(--color-primary-dark)] mb-2 uppercase tracking-wide text-xs">👀 {t('season_prep_label') || "À Préparer"}</div>
            <div className="text-lg font-medium text-[var(--color-text-main)]">{prep}</div>
        </div>
    </div>
  );
}
