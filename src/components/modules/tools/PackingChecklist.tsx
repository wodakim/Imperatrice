'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PackingChecklist() {
  const t = useTranslations('Tools');
  // Assume pack_items is array in JSON.
  let items = [];
  try { items = t.raw('pack_items') || []; } catch(e) { items = ["Error loading items"]; }

  const [checked, setChecked] = useState<number[]>([]);

  useEffect(() => {
      const saved = JSON.parse(localStorage.getItem('packing_state') || '[]');
      setChecked(saved);
  }, []);

  const toggle = (idx: number) => {
      const newChecked = checked.includes(idx)
        ? checked.filter(i => i !== idx)
        : [...checked, idx];

      setChecked(newChecked);
      localStorage.setItem('packing_state', JSON.stringify(newChecked));

      if(newChecked.length === items.length && items.length > 0) {
          window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'packing_done' }));
      }
  };

  const reset = () => {
      setChecked([]);
      localStorage.setItem('packing_state', '[]');
  };

  return (
    <div className="bg-[var(--surface)] p-5 rounded-[var(--border-radius)] shadow-[var(--shadow-soft)] col-span-1 md:col-span-2">
        <h3 className="text-lg font-bold text-[var(--primary-dark)] mb-4">{t('packing_title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map((item: string, idx: number) => (
                <div
                    key={idx}
                    onClick={() => toggle(idx)}
                    className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border",
                        checked.includes(idx)
                            ? "bg-[var(--background)] border-[var(--success)]"
                            : "bg-transparent border-transparent hover:bg-[var(--background)]"
                    )}
                >
                    <div className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                        checked.includes(idx) ? "bg-[var(--success)] border-[var(--success)]" : "border-[var(--accent)]"
                    )}>
                        {checked.includes(idx) && <Check size={14} color="white" />}
                    </div>
                    <span className={cn("text-sm", checked.includes(idx) && "line-through text-[var(--text-muted)]")}>
                        {item}
                    </span>
                </div>
            ))}
        </div>
        <button onClick={reset} className="mt-4 text-xs text-[var(--text-muted)] underline hover:text-[var(--primary-dark)]">
            {t('reset_list')}
        </button>
    </div>
  );
}
