'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { STUDIO_DATA, StudioCategory } from './studioData';
import { ChevronRight, Check, ArrowRight, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

export default function StudioWizard() {
  const t = useTranslations('Studio');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const resetStudio = () => {
    setSelectedCategory(null);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
  };

  // --- VIEW 1: SELECTION ---
  if (!selectedCategory) {
    return (
      <div className="animate-fade-in space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-primary-dark)] mb-2">
            {t('studio_title')}
        </h2>
        <p className="text-[var(--color-text-muted)] mb-6">
            {t('studio_subtitle')}
        </p>

        <div className="grid gap-4">
          {Object.values(STUDIO_DATA).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="flex items-center p-5 bg-[var(--color-bg)] border border-[var(--color-accent)] rounded-[20px] text-left gap-4 hover:bg-[var(--color-surface)] hover:shadow-md transition-all group"
            >
              <div className="text-[var(--color-primary-dark)] group-hover:scale-110 transition-transform">
                <cat.icon size={28} />
              </div>
              <span className="font-semibold text-lg flex-1 text-[var(--color-text-main)]">
                {t(cat.nameKey)}
              </span>
              <ChevronRight className="opacity-50" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  const category = STUDIO_DATA[selectedCategory];
  const currentStep = category.steps[currentStepIndex];
  const isFinished = completedSteps.length === category.steps.length;

  // --- VIEW 2: SUCCESS ---
  if (isFinished) {
    // Unlock Trophy Event
    if (typeof window !== 'undefined' && completedSteps.length === category.steps.length) {
         // Prevent loop by checking if we just finished (logic could be refined but event is safe)
         window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'photo_pro' }));
         // Visit count logic would be handled by a sophisticated store but simple event works
         window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'studio_master_check' }));
    }

    return (
      <div className="text-center animate-fade-in py-10">
        <div className="w-20 h-20 bg-[var(--color-success)] rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg animate-bounce-short">
          <Check size={40} strokeWidth={3} />
        </div>

        <h2 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-2">
            {t('studio_final_title') || "Photos Parfaites !"}
        </h2>
        <p className="text-[var(--color-text-main)] mb-6">
            {t('studio_success')}
        </p>

        <div className="bg-[var(--color-bg)] p-6 rounded-[20px] text-left mb-8 shadow-inner">
          <h4 className="font-bold mb-3 text-[var(--color-text-main)]">
              {t('studio_final_subtitle')}
          </h4>
          <ul className="space-y-2 list-disc pl-5 text-[var(--color-text-main)] opacity-90">
            <li dangerouslySetInnerHTML={{__html: t.raw('studio_final_tip1')}} />
            <li dangerouslySetInnerHTML={{__html: t.raw('studio_final_tip2')}} />
            <li dangerouslySetInnerHTML={{__html: t.raw('studio_final_tip3')}} />
          </ul>
        </div>

        <button
          onClick={resetStudio}
          className="w-full bg-[var(--color-primary-dark)] text-white py-4 rounded-[30px] font-bold text-lg hover:brightness-110 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} />
          {t('studio_new')}
        </button>
      </div>
    );
  }

  // --- VIEW 3: WIZARD STEP ---
  const isStepDone = completedSteps.includes(currentStepIndex);

  const handleComplete = () => {
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps([...completedSteps, currentStepIndex]);
    }

    // Auto advance after short delay
    if (currentStepIndex < category.steps.length - 1) {
      setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 600);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
            onClick={resetStudio}
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary-dark)] transition-colors"
        >
            ← Quitter
        </button>
        <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary-dark)]">
            Studio Mode
        </div>
        <div className="text-sm font-bold bg-[var(--color-bg)] px-3 py-1 rounded-full">
            {currentStepIndex + 1}/{category.steps.length}
        </div>
      </div>

      {/* Main Card */}
      <div className="relative bg-[var(--color-surface)] rounded-[25px] overflow-hidden shadow-2xl border border-[var(--color-bg)] mb-6">

        {/* Visual Area */}
        <div className="bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-surface)] p-8 text-center relative min-h-[220px] flex flex-col items-center justify-center">
             {/* Background Icon Watermark */}
             <div className="absolute top-4 right-4 opacity-5 text-[var(--color-primary)] transform rotate-12">
                 <currentStep.icon size={120} />
             </div>

             <div className="bg-white w-20 h-20 rounded-[20px] flex items-center justify-center shadow-sm text-[var(--color-primary-dark)] mb-4 z-10">
                 <currentStep.icon size={40} />
             </div>

             <h3 className="text-2xl font-bold text-[var(--color-text-main)] mb-2 relative z-10">
                 {t(currentStep.titleKey)}
             </h3>
             <div className="h-1 w-12 bg-[var(--color-secondary)] rounded-full mb-4 mx-auto" />

             <p className="text-[var(--color-text-main)] leading-relaxed max-w-xs mx-auto relative z-10" dangerouslySetInnerHTML={{__html: t.raw(currentStep.descKey)}} />
        </div>

        {/* Secret Algo Area */}
        <div className="bg-[#2D2D3A] text-[#E0E0E0] p-5 flex gap-3 items-start border-t border-[var(--color-bg)]">
            <span className="text-yellow-400 text-xl flex-shrink-0">⚡</span>
            <div className="text-sm leading-relaxed opacity-90" dangerouslySetInnerHTML={{__html: t.raw(currentStep.secretKey)}} />
        </div>

        {/* Action Area */}
        <div className="p-5 bg-[var(--color-surface)]">
            <button
                onClick={handleComplete}
                className={clsx(
                    "w-full py-4 rounded-[18px] text-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-md",
                    isStepDone
                        ? "bg-[var(--color-success)] text-white scale-[0.98]"
                        : "bg-[var(--color-primary-dark)] text-white hover:brightness-110 active:scale-95"
                )}
            >
                {isStepDone ? (
                    <>
                        <Check size={24} /> {t('studio_done')}
                    </>
                ) : (
                    <>
                        {t('studio_validate')}
                    </>
                )}
            </button>

            {/* Manual Next (if validated but not last) */}
            {isStepDone && currentStepIndex < category.steps.length - 1 && (
                <div
                    onClick={() => setCurrentStepIndex(prev => prev + 1)}
                    className="text-center mt-4 text-[var(--color-text-muted)] cursor-pointer text-sm hover:text-[var(--color-primary-dark)] flex items-center justify-center gap-1 animate-pulse"
                >
                    {t('studio_next')} <ArrowRight size={14} />
                </div>
            )}
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2">
        {category.steps.map((_, idx) => (
            <div
                key={idx}
                className={clsx(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    idx === currentStepIndex
                        ? "bg-[var(--color-primary-dark)] scale-125"
                        : completedSteps.includes(idx)
                            ? "bg-[var(--color-success)]"
                            : "bg-[var(--color-accent)]"
                )}
            />
        ))}
      </div>
    </div>
  );
}
