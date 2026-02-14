'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { Calculator } from 'lucide-react';
import { FloatingLabelInput } from '@/components/ui/FloatingLabel';

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
    <div className="bg-[var(--color-surface)] p-6 rounded-[20px] shadow-[var(--shadow-soft)] card-hover h-full flex flex-col">
      <h3 className="text-lg font-bold text-[var(--color-primary-dark)] mb-6 flex items-center gap-2">
        <Calculator size={20} /> {t('calc_title')}
      </h3>

      <div className="grid gap-6 mb-6 flex-1">
        <FloatingLabelInput
            label={t('calc_buy_ph')}
            placeholder="Ex: 5.00"
            value={buy}
            onChange={(e) => setBuy(e.target.value)}
            type="number"
        />
        <FloatingLabelInput
            label={t('calc_sell_ph')}
            placeholder="Ex: 15.00"
            value={sell}
            onChange={(e) => setSell(e.target.value)}
            type="number"
        />
        <FloatingLabelInput
            label={t('calc_fees_ph')}
            placeholder="Ex: 0.50"
            value={fees}
            onChange={(e) => setFees(e.target.value)}
            type="number"
        />
      </div>

      <div className="bg-[var(--color-bg)] p-4 rounded-xl text-center border-2 border-dashed border-[var(--color-accent)]">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
            {t('calc_result_label')}
        </div>
        <div className={clsx(
            "text-4xl font-black transition-colors my-2",
            profit > 0 ? "text-[var(--color-success)]" : profit < 0 ? "text-[var(--color-secondary)]" : "text-[var(--color-text-muted)]"
        )}>
            {profit.toFixed(2)} €
        </div>
        <div className="flex justify-center gap-4 text-xs font-medium text-[var(--color-text-muted)]">
            <span className="bg-[var(--color-surface)] px-2 py-1 rounded-md shadow-sm">ROI: {roi.toFixed(0)}%</span>
            {profit > 0 && <span className="bg-[var(--color-surface)] px-2 py-1 rounded-md shadow-sm text-[var(--color-success)]">Rentable ✅</span>}
        </div>
      </div>
    </div>
  );
}
