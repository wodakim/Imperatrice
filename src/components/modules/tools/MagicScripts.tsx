'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Copy } from 'lucide-react';

export default function MagicScripts() {
  const t = useTranslations('Tools');

  const options = [
      'lowball', 'rude', 'ghost', 'reserve', 'late', 'accept', 'counter', 'bundle', 'thanks', 'review', 'measure'
  ];

  const [selected, setSelected] = useState('');

  const getScript = (key: string) => {
      // Direct access from i18n
      // The keys in en.json are at root level or within a scope?
      // In my JSON update I put them at root, but t() uses 'Tools' scope.
      // Wait, in my JSON update I put `script_lowball` at root.
      // But `ToolsView` wraps things.
      // Let's use a global translator for scripts or move scripts to Tools scope?
      // For now, I'll assume they are global or I use a specific translator.
      // Actually, I can use t.raw() on a parent scope if needed, or just fix the JSON structure later.
      // BETTER: I will assume they are in 'Tools' scope for cleanliness in this file,
      // but if they are root in JSON, I should use `useTranslations()` (root).
      // Let's use root scope for scripts to be safe.
      return "";
  };

  // Create a separate translator for root keys if needed
  const tRoot = useTranslations();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelected(e.target.value);
  };

  const currentScript = selected ? tRoot(`script_${selected}`) : "";

  return (
    <div className="bg-[var(--surface)] p-5 rounded-[var(--border-radius)] shadow-[var(--shadow-soft)]">
        <h3 className="text-lg font-bold text-[var(--primary-dark)] mb-4">{t('scripts_title')}</h3>
        <select onChange={handleChange} className="w-full p-3 bg-[var(--background)] border border-[var(--accent)] rounded-lg outline-none mb-4">
            <option value="">{t('script_select_ph')}</option>
            {options.map(opt => (
                <option key={opt} value={opt}>{tRoot(`script_${opt}_label`)}</option>
            ))}
        </select>

        <textarea
            readOnly
            value={currentScript}
            className="w-full h-32 p-3 bg-[var(--background)] rounded-lg text-sm text-[var(--text-muted)] resize-none outline-none mb-2"
        />

        <button
            onClick={() => {
                if(currentScript) {
                    navigator.clipboard.writeText(currentScript);
                    window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'diplomat' }));
                }
            }}
            className="w-full bg-[var(--primary-dark)] text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 hover:opacity-90 transition-opacity"
        >
            <Copy size={16} /> {t('copy_response')}
        </button>
    </div>
  );
}
