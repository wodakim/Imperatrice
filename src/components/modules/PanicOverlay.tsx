'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

export default function PanicOverlay() {
  const t = useTranslations('Dashboard'); // Keys are flattened in Dashboard scope in our JSON
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleTrigger = () => setIsOpen(true);
    window.addEventListener('triggerPanic', handleTrigger);
    return () => window.removeEventListener('triggerPanic', handleTrigger);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#a8c0ff] to-[#3f2b96] flex flex-col items-center justify-center p-6 text-center text-white animate-fade-in">

        <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
        >
            <X size={32} />
        </button>

        <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-in-up delay-100">
            {t('panic_title')}
        </h2>

        <p className="text-xl md:text-2xl leading-relaxed max-w-2xl mb-10 opacity-90 animate-slide-in-up delay-200" dangerouslySetInnerHTML={{__html: t.raw('panic_text')}} />

        <div className="bg-white/10 backdrop-blur-md p-8 rounded-[30px] max-w-lg w-full mb-10 border border-white/20 animate-slide-in-up delay-300 text-left">
            <h3 className="text-xl font-bold mb-4 text-center">{t('anchor_title')}</h3>
            <ul className="space-y-3 text-lg">
                <li>👀 <b>5</b> <span dangerouslySetInnerHTML={{__html: t.raw('anchor_5')}} /></li>
                <li>✋ <b>4</b> <span dangerouslySetInnerHTML={{__html: t.raw('anchor_4')}} /></li>
                <li>👂 <b>3</b> <span dangerouslySetInnerHTML={{__html: t.raw('anchor_3')}} /></li>
                <li>👃 <b>2</b> <span dangerouslySetInnerHTML={{__html: t.raw('anchor_2')}} /></li>
                <li>👅 <b>1</b> <span dangerouslySetInnerHTML={{__html: t.raw('anchor_1')}} /></li>
            </ul>
        </div>

        <button
            onClick={() => setIsOpen(false)}
            className="bg-white text-[#3f2b96] px-10 py-4 rounded-full text-xl font-bold shadow-2xl hover:scale-105 active:scale-95 transition-transform animate-bounce-short delay-500"
        >
            {t('btn_better')}
        </button>
    </div>
  );
}
