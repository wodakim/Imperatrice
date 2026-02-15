'use client';

import { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface LitigeChecklistProps {
  items: string[];
}

export default function LitigeChecklist({ items }: LitigeChecklistProps) {
  const t = useTranslations('Litiges');
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setCheckedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] p-6">
      <h3 className="font-serif font-bold text-lg text-[var(--color-text-primary)] mb-4 flex items-center">
        <span className="mr-2">🛡️</span> {t('checklist_title')}
      </h3>
      <p className="text-xs text-[var(--color-text-muted)] mb-4">{t('checklist_desc')}</p>

      <div className="space-y-3">
        {items.map((item, index) => {
          const isChecked = checkedItems[index];
          return (
            <div
              key={index}
              onClick={() => toggleItem(index)}
              className={`
                flex items-center space-x-3 cursor-pointer group p-3 rounded-lg border transition-all duration-200
                ${isChecked
                  ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)]'
                  : 'bg-[var(--color-bg)] border-[var(--color-border)] hover:border-[var(--color-primary-light)]'
                }
              `}
            >
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center transition-colors flex-shrink-0
                ${isChecked ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}
              `}>
                {isChecked ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </div>
              <div className={`
                flex-1 text-sm transition-all
                ${isChecked ? 'text-[var(--color-primary-dark)] line-through opacity-70' : 'text-[var(--color-text-secondary)]'}
              `}>
                {item}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
