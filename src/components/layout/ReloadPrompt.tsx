'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { RotateCcw } from 'lucide-react';

export default function ReloadPrompt({ show, onReload }: { show: boolean, onReload: () => void }) {
  const t = useTranslations();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) setVisible(true);
  }, [show]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[var(--color-surface)] border border-[var(--color-primary)] p-4 rounded-[20px] shadow-2xl z-[100] animate-slide-in-up flex flex-col items-center gap-3 min-w-[300px]">
        <p className="text-sm font-medium text-[var(--color-text-main)] text-center">
            {t('msg_reload') || "Veuillez recharger la page..."}
        </p>
        <button
            onClick={() => {
                onReload();
                window.location.reload();
            }}
            className="bg-[var(--color-primary-dark)] text-white px-6 py-2 rounded-full font-bold shadow-md hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
        >
            <RotateCcw size={16} /> {t('btn_reload') || "Recharger"}
        </button>
    </div>
  );
}
