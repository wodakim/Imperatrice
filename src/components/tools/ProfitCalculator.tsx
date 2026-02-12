'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';

export default function ProfitCalculator() {
  const t = useTranslations('Tools');
  const [buy, setBuy] = useState('');
  const [sell, setSell] = useState('');
  const [fees, setFees] = useState('');

  const b = parseFloat(buy) || 0;
  const s = parseFloat(sell) || 0;
  const f = parseFloat(fees) || 0;
  const profit = s - b - f;

  let roi = 0;
  if (b > 0) roi = (profit / b) * 100;
  else if (profit > 0) roi = 100;

  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-[20px] shadow-[var(--shadow-soft)] card-hover">
      <h3 className="text-lg font-bold text-[var(--color-primary-dark)] mb-4">
        {t('calc_title')}
      </h3>

      <div className="grid gap-4 mb-4">
        <input
            type="number"
            placeholder={t('calc_buy_ph')}
            value={buy}
            onChange={(e) => setBuy(e.target.value)}
            className="input-field"
        />
        <input
            type="number"
            placeholder={t('calc_sell_ph')}
            value={sell}
            onChange={(e) => setSell(e.target.value)}
            className="input-field"
        />
        <input
            type="number"
            placeholder={t('calc_fees_ph')}
            value={fees}
            onChange={(e) => setFees(e.target.value)}
            className="input-field"
        />
      </div>

      <div className="bg-[var(--color-bg)] p-4 rounded-xl text-center">
        <div className="text-xs text-[var(--color-text-muted)] mb-1">
            {t('calc_result_label')}
        </div>
        <div className={clsx(
            "text-3xl font-bold transition-colors",
            profit > 0 ? "text-[var(--color-success)]" : profit < 0 ? "text-[var(--color-secondary)]" : "text-[var(--color-text-muted)]"
        )}>
            {profit.toFixed(2)} €
        </div>
        <div className="text-xs text-[var(--color-text-muted)] mt-1">
            Marge: {roi.toFixed(0)}%
        </div>
      </div>
    </div>
  );
}
