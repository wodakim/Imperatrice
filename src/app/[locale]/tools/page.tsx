'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Calculator, Calendar, Box, MessageSquare } from 'lucide-react';
import SeasonalWidget from '@/components/tools/SeasonalWidget';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function ToolsPage() {
  const t = useTranslations('Tools');

  const [buyPrice, setBuyPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [fees, setFees] = useState(0);
  const profit = sellPrice - buyPrice - fees;
  const roi = buyPrice > 0 ? (profit / buyPrice) * 100 : (profit > 0 ? 100 : 0);

  const [selectedScript, setSelectedScript] = useState('');
  const scripts = {
    lowball: t('script_lowball'),
    rude: t('script_rude'),
    ghost: t('script_ghost'),
    reserve: t('script_reserve'),
    late: t('script_late'),
    accept: t('script_accept'),
    counter: t('script_counter'),
    bundle: t('script_bundle'),
    thanks: t('script_thanks'),
    review: t('script_review'),
    measure: t('script_measure')
  };

  const [packedItems, setPackedItems] = useLocalStorage<number[]>('packing_state', []);
  const packingList = [
    "Lavé & Repassé", "Pliage soigné", "Papier de soie", "Petit mot", "Cadeau (option)", "Parfum", "Scotch fermé", "Bordereau collé"
  ];
  const togglePackingItem = (idx: number) => {
    if (packedItems.includes(idx)) setPackedItems(packedItems.filter(i => i !== idx));
    else setPackedItems([...packedItems, idx]);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* 1. Seasonal Calendar Widget */}
      <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)]">
        <h2 className="text-xl font-bold text-[var(--color-primary-dark)] mb-4 flex items-center gap-2">
            <Calendar size={24} /> {t('seasonal_title') || "Calendrier Stratégique"}
        </h2>
        <SeasonalWidget />
      </div>

      {/* 2. Profit Calculator (Vertical Stack) */}
      <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)]">
        <h2 className="text-xl font-bold text-[var(--color-primary-dark)] mb-4 flex items-center gap-2">
            <Calculator size={24} /> {t('calc_title')}
        </h2>
        <div className="flex flex-col gap-3 mb-4">
            <input type="number" placeholder={t('calc_buy_ph')} className="p-3 rounded-lg border border-[var(--color-accent)] bg-[var(--color-bg)] outline-none transition-shadow focus:shadow-md" onChange={e => setBuyPrice(parseFloat(e.target.value) || 0)} />
            <input type="number" placeholder={t('calc_sell_ph')} className="p-3 rounded-lg border border-[var(--color-accent)] bg-[var(--color-bg)] outline-none transition-shadow focus:shadow-md" onChange={e => setSellPrice(parseFloat(e.target.value) || 0)} />
            <input type="number" placeholder={t('calc_fees_ph')} className="p-3 rounded-lg border border-[var(--color-accent)] bg-[var(--color-bg)] outline-none transition-shadow focus:shadow-md" onChange={e => setFees(parseFloat(e.target.value) || 0)} />
        </div>
        <div className="text-center bg-[var(--color-bg)] p-4 rounded-xl">
            <div className="text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-1">{t('calc_result_label')}</div>
            <div className={`text-3xl font-bold ${profit >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-secondary)]'}`}>
                {profit.toFixed(2)} €
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1 font-medium">Marge: {roi.toFixed(0)}%</div>
        </div>
      </div>

      {/* 3. Soft Skills Scripts */}
      <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)]">
        <h2 className="text-xl font-bold text-[var(--color-primary-dark)] mb-4 flex items-center gap-2">
            <MessageSquare size={24} /> {t('scripts_title')}
        </h2>
        <select
            className="w-full p-3 mb-4 rounded-lg border border-[var(--color-accent)] bg-[var(--color-bg)] outline-none"
            onChange={(e) => setSelectedScript(e.target.value)}
        >
            <option value="">{t('script_select_ph')}</option>
            {Object.keys(scripts).map(key => (
                <option key={key} value={key}>{t(`script_${key}_label`)}</option>
            ))}
        </select>
        <textarea
            readOnly
            value={(scripts as any)[selectedScript] || ''}
            className="w-full h-32 p-3 rounded-lg border border-[var(--color-accent)] bg-[var(--color-bg)] outline-none resize-none text-sm leading-relaxed"
        ></textarea>
        <button
            onClick={() => navigator.clipboard.writeText((scripts as any)[selectedScript] || '')}
            className="w-full mt-2 bg-[var(--color-primary-dark)] text-white py-2 rounded-lg font-bold hover:bg-[var(--color-primary)] transition-colors active:scale-95 transform"
        >
            {t('copy_response')}
        </button>
      </div>

      {/* 4. Packing Checklist (Vertical Stack) */}
      <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)]">
        <h2 className="text-xl font-bold text-[var(--color-primary-dark)] mb-4 flex items-center gap-2">
            <Box size={24} /> {t('packing_title')}
        </h2>
        <div className="flex flex-col gap-2">
            {packingList.map((item, idx) => (
                <label key={idx} className="flex items-center gap-3 cursor-pointer p-3 hover:bg-[var(--color-bg)] rounded-lg transition-colors border-b border-[var(--color-bg)] last:border-0">
                    <input
                        type="checkbox"
                        checked={packedItems.includes(idx)}
                        onChange={() => togglePackingItem(idx)}
                        className="w-5 h-5 accent-[var(--color-primary)] rounded border-[var(--color-accent)]"
                    />
                    <span className={`text-sm ${packedItems.includes(idx) ? 'line-through text-[var(--color-text-muted)] opacity-70' : 'text-[var(--color-text-main)]'}`}>{item}</span>
                </label>
            ))}
        </div>
        <button
            onClick={() => setPackedItems([])}
            className="text-sm text-[var(--color-text-muted)] underline mt-4 hover:text-[var(--color-secondary)] w-fit"
        >
            {t('reset_list')}
        </button>
      </div>

    </div>
  );
}
