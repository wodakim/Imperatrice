'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, MessageSquare } from 'lucide-react';
import { FloatingLabelSelect, FloatingLabelTextarea } from '@/components/ui/FloatingLabel';

export default function MagicScripts() {
  const t = useTranslations('Tools');
  const [selectedScript, setSelectedScript] = useState('');

  const scripts = [
    'lowball', 'rude', 'ghost', 'reserve', 'late',
    'accept', 'counter', 'bundle', 'thanks', 'review', 'measure'
  ];

  // Map to keys like "script_lowball"
  const currentText = selectedScript ? t(`script_${selectedScript}`) : "";

  const handleCopy = () => {
    if(currentText) {
        navigator.clipboard.writeText(currentText);
        if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'diplomat' }));
    }
  };

  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-[20px] shadow-[var(--shadow-soft)] card-hover flex flex-col h-full">
      <h3 className="text-lg font-bold text-[var(--color-primary-dark)] mb-6 flex items-center gap-2">
        <MessageSquare size={20} /> {t('scripts_title')}
      </h3>

      <div className="flex-1 flex flex-col gap-6">
        <FloatingLabelSelect
            label={t('script_select_ph')}
            value={selectedScript}
            onChange={(e) => setSelectedScript(e.target.value)}
        >
            <option value="">{t('script_select_ph')}</option>
            {scripts.map(s => (
                <option key={s} value={s}>
                    {t(`script_${s}_label`)}
                </option>
            ))}
        </FloatingLabelSelect>

        <div className="relative flex-1 min-h-[150px]">
            <FloatingLabelTextarea
                label="Réponse"
                readOnly
                value={currentText}
                className="h-full"
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
    </div>
  );
}
