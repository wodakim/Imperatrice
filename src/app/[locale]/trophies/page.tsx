import { useTranslations } from 'next-intl';

export default function TrophiesPage() {
  const t = useTranslations('Trophies');

  const trophies = [
    { id: 'first_visit', icon: '👋', unlocked: true },
    { id: 'dark_mode', icon: '🌙', unlocked: false },
    { id: 'seo_master', icon: '✍️', unlocked: false },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-[var(--color-primary-dark)] text-center">
        {t('trophy_title')}
      </h2>
      <p className="text-center text-[var(--color-text-muted)]">{t('trophy_subtitle')}</p>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {trophies.map(tr => (
            <div
                key={tr.id}
                className={`aspect-square flex flex-col items-center justify-center p-4 rounded-[var(--radius-lg)] transition-all duration-300 ${
                    tr.unlocked
                    ? 'bg-[var(--color-surface)] shadow-[var(--shadow-soft)] scale-100 opacity-100 border-2 border-[var(--color-secondary)]'
                    : 'bg-[var(--color-bg)] opacity-50 grayscale scale-95'
                }`}
            >
                <div className="text-3xl mb-2 filter drop-shadow-sm">{tr.icon}</div>
                <div className="text-[10px] uppercase font-bold text-center tracking-widest text-[var(--color-text-main)] truncate w-full">
                    {t(`tr_n_${tr.id}`)}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
