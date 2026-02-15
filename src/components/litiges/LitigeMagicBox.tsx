'use client';

import { useState } from 'react';
import { Sparkles, Copy, Check, Lock, Wand2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface LitigeMagicBoxProps {
  onGenerate: (detail: string, tone: string) => void;
  isGenerating: boolean;
  generatedText: string | null;
  credits: number;
  dailyUsed: boolean;
  onBuyCredits: () => void;
}

export default function LitigeMagicBox({
  onGenerate,
  isGenerating,
  generatedText,
  credits,
  dailyUsed,
  onBuyCredits
}: LitigeMagicBoxProps) {
  const t = useTranslations('Litiges');
  const [detail, setDetail] = useState('');
  const [tone, setTone] = useState('diplomat');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    onGenerate(detail, tone);
  };

  const handleCopy = () => {
    if (generatedText) {
      navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const canGenerate = !dailyUsed || credits > 0;

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white rounded-2xl shadow-md border border-purple-100 p-6 flex flex-col relative overflow-hidden h-full">
      {/* Deco bg */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200 opacity-20 rounded-full -mr-10 -mt-10 pointer-events-none"></div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-serif font-bold text-lg text-purple-900 flex items-center gap-2">
          <Wand2 size={20} />
          <span>{t('ai_box_title')}</span>
        </h3>
        <span className="text-xs font-sans font-normal bg-white px-2 py-1 rounded border border-purple-100 text-purple-600 flex items-center gap-1">
          {canGenerate ? (
            <>
              <Sparkles size={10} />
              {dailyUsed ? `${credits} Credits` : 'Free Daily'}
            </>
          ) : (
            <>
              <Lock size={10} />
              0 Credits
            </>
          )}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">{t('detail_label')}</label>
          <input
            type="text"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder={t('detail_ph')}
            className="w-full text-sm p-2 rounded border border-purple-100 focus:ring-1 focus:ring-purple-500 outline-none bg-white/50"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">{t('tone_label')}</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full text-sm p-2 rounded border border-purple-100 outline-none bg-white/50 cursor-pointer"
          >
            <option value="diplomat">{t('tone_diplomat')}</option>
            <option value="factual">{t('tone_factual')}</option>
            <option value="legal">{t('tone_legal')}</option>
          </select>
        </div>
      </div>

      <div className="relative flex-1 min-h-[150px]">
        <textarea
          readOnly
          value={generatedText || ''}
          className="w-full h-full p-3 text-sm text-gray-700 bg-white rounded-lg border border-purple-100 resize-none font-mono leading-relaxed mb-3 focus:outline-none focus:border-purple-500"
          placeholder={t('output_ph')}
        ></textarea>

        {/* Overlay Button for Generation */}
        {!generatedText && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-lg z-10">
            {canGenerate ? (
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105 flex items-center gap-2 disabled:opacity-70 disabled:scale-100"
              >
                {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <Sparkles size={16} />
                )}
                <span>{t('btn_generate')}</span>
              </button>
            ) : (
              <button
                onClick={onBuyCredits}
                className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105 flex items-center gap-2"
              >
                <Lock size={16} />
                <span>{t('btn_buy')}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {generatedText && (
        <div className="flex gap-2 mt-3">
            <button
                onClick={handleCopy}
                className={`flex-1 font-medium py-2 px-4 rounded-lg transition-all flex justify-center items-center shadow-sm gap-2
                    ${copied ? 'bg-green-600 text-white' : 'bg-gray-800 hover:bg-gray-900 text-white'}
                `}
            >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                <span>{copied ? 'Copié !' : t('btn_copy')}</span>
            </button>
            <button
                onClick={() => onGenerate(detail, tone)} // Regenerate
                disabled={!canGenerate || isGenerating}
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 p-2 rounded-lg transition-colors flex items-center justify-center"
                title="Regenerate"
            >
                <Sparkles size={20} />
            </button>
        </div>
      )}
    </div>
  );
}
