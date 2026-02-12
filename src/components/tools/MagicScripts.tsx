'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, MessageSquare } from 'lucide-react';

export default function MagicScripts() {
  const t = useTranslations('Tools');
  const t_scripts = useTranslations('scripts'); // Assuming direct script keys exist or map them
  const [selectedScript, setSelectedScript] = useState('');

  const scripts = [
    'lowball', 'rude', 'ghost', 'reserve', 'late',
    'accept', 'counter', 'bundle', 'thanks', 'review', 'measure'
  ];

  // We need to map selection to text content.
  // In `messages/fr.json`, keys are `script_lowball`, `script_rude` etc.
  // The select options labels are `script_lowball_label`.

  const currentText = selectedScript ? t(`script_${selectedScript}`) : "";

  const handleCopy = () => {
    if(currentText) {
        navigator.clipboard.writeText(currentText);
        if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'diplomat' }));
    }
  };

  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-[20px] shadow-[var(--shadow-soft)] card-hover">
      <h3 className="text-lg font-bold text-[var(--color-primary-dark)] mb-4 flex items-center gap-2">
        <MessageSquare size={20} /> {t('scripts_title')}
      </h3>

      <select
        className="input-field mb-4 w-full"
        onChange={(e) => setSelectedScript(e.target.value)}
        value={selectedScript}
      >
        <option value="">{t('script_select_ph')}</option>
        {scripts.map(s => (
            <option key={s} value={s}>
                {t(`script_${s}_label`)}
            </option>
        ))}
      </select>

      <div className="relative">
        <textarea
            readOnly
            value={currentText}
            className="w-full h-32 p-3 rounded-xl bg-[var(--color-bg)] text-sm text-[var(--color-text-muted)] border-none focus:ring-0 resize-none"
        />
        {currentText && (
            <button
                onClick={handleCopy}
                className="absolute bottom-3 right-3 bg-[var(--color-primary-dark)] text-white p-2 rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-2 text-xs font-bold"
            >
                <Copy size={14} /> {t('copy_response')}
            </button>
        )}
      </div>
    </div>
  );
}
