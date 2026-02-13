'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

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
  if(b > 0) roi = (profit / b) * 100;
  else if(profit > 0) roi = 100;

  let color = "var(--text-muted)";
  if(profit > 0) color = "var(--success)";
  if(profit < 0) color = "var(--secondary)";

  // Check achievement
  if(profit > 0) window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'profit_calc' }));

  return (
    <div className="bg-[var(--surface)] p-5 rounded-[var(--border-radius)] shadow-[var(--shadow-soft)]">
        <h3 className="text-lg font-bold text-[var(--primary-dark)] mb-4">{t('calc_title')}</h3>
        <div className="space-y-3">
            <input type="number" placeholder={t('calc_buy_ph')} value={buy} onChange={(e) => setBuy(e.target.value)} className="w-full p-3 bg-[var(--background)] border border-[var(--accent)] rounded-lg outline-none" />
            <input type="number" placeholder={t('calc_sell_ph')} value={sell} onChange={(e) => setSell(e.target.value)} className="w-full p-3 bg-[var(--background)] border border-[var(--accent)] rounded-lg outline-none" />
            <input type="number" placeholder={t('calc_fees_ph')} value={fees} onChange={(e) => setFees(e.target.value)} className="w-full p-3 bg-[var(--background)] border border-[var(--accent)] rounded-lg outline-none" />
        </div>
        <div className="mt-5 bg-[var(--background)] p-4 rounded-lg text-center">
            <div className="text-sm text-[var(--text-muted)]">{t('calc_result_label')}</div>
            <div className="text-2xl font-bold mt-1" style={{ color }}>{profit.toFixed(2)} €</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Marge: {roi.toFixed(0)}%</div>
        </div>
    </div>
  );
}
