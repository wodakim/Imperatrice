'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CheckSquare, RotateCcw } from 'lucide-react';

export default function PackingChecklist() {
  const t = useTranslations('Tools');
  // Access array items by index key since i18n flattens arrays
  const items = [0,1,2,3,4,5,6,7].map(i => t(`pack_items.${i}`));

  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('packing_state');
    if(saved) setCheckedItems(JSON.parse(saved));
    setMounted(true);
  }, []);

  const toggleItem = (index: number) => {
    const newChecked = checkedItems.includes(index)
        ? checkedItems.filter(i => i !== index)
        : [...checkedItems, index];

    setCheckedItems(newChecked);
    localStorage.setItem('packing_state', JSON.stringify(newChecked));

    if(newChecked.length === items.length) {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'packing_done' }));
        }
    }
  };

  const resetList = () => {
    setCheckedItems([]);
    localStorage.setItem('packing_state', '[]');
  };

  if(!mounted) return <div className="h-[300px] animate-pulse bg-[var(--color-bg)] rounded-[20px]" />;

  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-[20px] shadow-[var(--shadow-soft)] card-hover col-span-1 md:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[var(--color-primary-dark)] flex items-center gap-2">
            <CheckSquare size={20} /> {t('packing_title')}
        </h3>
        <button onClick={resetList} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] flex items-center gap-1">
            <RotateCcw size={12} /> {t('reset_list')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, idx) => (
            <label
                key={idx}
                className={`
                    flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none
                    ${checkedItems.includes(idx)
                        ? 'bg-[var(--color-success)] border-transparent text-white'
                        : 'bg-[var(--color-bg)] border-transparent hover:border-[var(--color-accent)]'}
                `}
            >
                <input
                    type="checkbox"
                    checked={checkedItems.includes(idx)}
                    onChange={() => toggleItem(idx)}
                    className="w-5 h-5 rounded-md accent-[var(--color-primary-dark)]"
                />
                <span className={checkedItems.includes(idx) ? 'line-through opacity-80' : ''}>
                    {item}
                </span>
            </label>
        ))}
      </div>
    </div>
  );
}
