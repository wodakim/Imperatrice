'use client';

import { useMessages, useTranslations } from 'next-intl';

export default function DailyTip() {
  const t = useTranslations('Dashboard');
  const messages = useMessages() as any;
  const tips = (messages.tips || []) as string[];
  const fallbackTips = [
    "Ne baisse jamais le prix de plus de 10% d'un coup.",
    "Un emballage soigné (papier de soie) fidélise à 100%.",
    "Réponds toujours, même pour dire non."
  ];
  const currentTips = tips.length > 0 ? tips : fallbackTips;
  const day = new Date().getDate();
  const tip = currentTips[day % currentTips.length];

  return (
    <div className="relative transform -rotate-1 hover:rotate-0 transition-transform duration-300 max-w-sm mx-auto mt-6 card-hover cursor-help group">
      {/* Pin Element matching prototype */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#ff6b6b] shadow-md z-10 border border-white/20 shadow-[2px_2px_5px_rgba(0,0,0,0.2)]"></div>

      <div className="bg-[#fff740] p-6 pt-8 shadow-[5px_5px_15px_rgba(0,0,0,0.15)] rounded-sm text-[#333] font-caveat text-xl leading-relaxed relative">
        <h3 className="font-bold border-b-2 border-dashed border-[#d4a017] pb-2 mb-4 text-[#d4a017] text-2xl m-0 flex items-center gap-2">
          ✨ {t('tip_title') || "Conseil du Jour"}
        </h3>
        <p className="font-sans font-medium text-lg leading-snug">"{tip}"</p>
      </div>
    </div>
  );
}
