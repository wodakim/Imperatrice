'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Eye, Info, TrendingUp, AlertCircle, Ruler, Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

const ICONS: Record<string, any> = {
  camera: Camera,
  refresh: RefreshCw,
  eye: Eye,
  info: Info,
  trending: TrendingUp,
  alert: AlertCircle,
  ruler: Ruler,
  check: Check
};

type Step = {
  id: string;
  title: string;
  description: string;
  algoSecret: string;
  icon: string;
};

type Category = {
  name: string;
  steps: Step[];
};

export default function StudioPage() {
  const t = useTranslations('Studio');
  const [category, setCategory] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories: Record<string, Category> = {
    vetements: {
      name: t('cat_clothes'),
      steps: [
        { id: 'cover', title: t('step_cover_t'), description: t('step_cover_d'), algoSecret: t('step_cover_s'), icon: "camera" },
        { id: 'back', title: t('step_back_t'), description: t('step_back_d'), algoSecret: t('step_back_s'), icon: "refresh" },
        { id: 'label_brand', title: t('step_brand_t'), description: t('step_brand_d'), algoSecret: t('step_brand_s'), icon: "eye" },
        { id: 'label_comp', title: t('step_comp_t'), description: t('step_comp_d'), algoSecret: t('step_comp_s'), icon: "info" },
        { id: 'details', title: t('step_details_t'), description: t('step_details_d'), algoSecret: t('step_details_s'), icon: "trending" },
        { id: 'defects', title: t('step_defects_t'), description: t('step_defects_d'), algoSecret: t('step_defects_s'), icon: "alert" }
      ]
    },
    // Add other categories if translation keys exist or fallback
  };

  useEffect(() => {
    if (category) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [category]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error("Camera error:", err);
      // Don't show error immediately to avoid breaking UI if just permission denied, show placeholder
      setError("Caméra non disponible");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleStepComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (category && currentStep < categories[category].steps.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 500);
    }
  };

  const resetStudio = () => {
    setCategory(null);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  // VIEW 1: SELECTION
  if (!category) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-4">{t('studio_title')}</h2>
        <p className="mb-6">{t('studio_subtitle')}</p>
        <div className="grid gap-4">
          {Object.entries(categories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className="flex items-center p-5 bg-[var(--color-surface)] border border-[var(--color-accent)] rounded-[var(--radius-lg)] text-left gap-4 hover:shadow-md transition-shadow group"
            >
              <div className="text-[var(--color-primary-dark)] group-hover:scale-110 transition-transform">
                <Camera size={24} />
              </div>
              <span className="font-semibold text-lg">{cat.name}</span>
              <div className="ml-auto opacity-50">➜</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const stepData = categories[category].steps[currentStep];
  const StepIcon = ICONS[stepData.icon] || Camera;
  const isDone = completedSteps.includes(currentStep);
  const isFinished = completedSteps.length === categories[category].steps.length;

  // VIEW 2: SUCCESS
  if (isFinished) {
    return (
        <div className="text-center py-10 px-5 animate-fade-in">
            <div className="bg-[var(--color-success)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
                <Check size={40} />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-4">{t('studio_final_title') || "Photos Parfaites !"}</h2>
            <p className="mb-8">{t('studio_success')}</p>

            <div className="bg-[var(--color-bg)] p-6 rounded-[var(--radius-lg)] text-left mb-8 shadow-inner">
                <h4 className="font-bold mb-4">{t('studio_final_subtitle') || "Derniers conseils SEO :"}</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li dangerouslySetInnerHTML={{ __html: t('studio_final_tip1') || "Utilise tous les mots clés." }}></li>
                    <li dangerouslySetInnerHTML={{ __html: t('studio_final_tip2') || "Prix psychologique : 9.90€." }}></li>
                    <li dangerouslySetInnerHTML={{ __html: t('studio_final_tip3') || "Poste Dimanche soir." }}></li>
                </ul>
            </div>

            <button
                onClick={resetStudio}
                className="bg-[var(--color-primary-dark)] text-white px-8 py-4 rounded-full font-bold w-full shadow-lg hover:bg-[var(--color-primary)] transition-colors"
            >
                {t('studio_new')}
            </button>
        </div>
    );
  }

  // VIEW 3: WIZARD CARD
  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={resetStudio} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] flex items-center gap-1">
            <X size={16} /> Quitter
        </button>
        <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary-dark)]">Studio Mode</div>
        <div className="font-bold text-sm">{currentStep + 1}/{categories[category].steps.length}</div>
      </div>

      {/* Immersive Card */}
      <div className="relative bg-[var(--color-surface)] rounded-[25px] overflow-hidden shadow-xl border border-[var(--color-bg)]">

        {/* Visual Indicator (Top Half - Camera Feed) */}
        <div className="relative h-64 md:h-80 bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-surface)] overflow-hidden">
             {/* Camera Feed Layer */}
             {!error ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
             ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)] bg-[var(--color-bg)] z-0">
                    <Camera size={48} className="opacity-20" />
                </div>
             )}

             {/* Gradient Overlay for Text Readability */}
             <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-black/30 z-10"></div>

             {/* Top Icon Overlay */}
             <div className="absolute top-4 right-4 z-20 opacity-80 text-white drop-shadow-md">
                 <StepIcon size={32} />
             </div>

             {/* Guide Overlay */}
             <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                 <div className="border-2 border-white/40 w-3/4 h-3/4 rounded-2xl"></div>
             </div>

             {/* Title Overlay */}
             <div className="absolute bottom-4 left-0 right-0 z-20 text-center px-4">
                 <h3 className="text-2xl font-bold text-[var(--color-primary-dark)] drop-shadow-sm bg-[var(--color-surface)]/80 backdrop-blur-sm inline-block px-4 py-1 rounded-full shadow-sm">
                     {stepData.title}
                 </h3>
             </div>
        </div>

        {/* Action Area (Bottom Half) */}
        <div className="p-6 pt-4 text-center">
            <div className="h-1 w-10 bg-[var(--color-secondary)] mx-auto mb-4 rounded-full"></div>

            <p className="text-base mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: stepData.description }}></p>

            {/* Algo Secret */}
            <div className="bg-[#2D2D3A] text-[#E0E0E0] p-4 rounded-xl text-xs flex gap-3 mb-6 items-start text-left shadow-inner">
                <span className="text-yellow-400 text-lg">⚡</span>
                <span dangerouslySetInnerHTML={{ __html: stepData.algoSecret }}></span>
            </div>

            {/* Main Action Button */}
            <button
                onClick={handleStepComplete}
                className={`w-full py-4 rounded-[18px] font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                    isDone
                    ? 'bg-[var(--color-success)] text-white shadow-none'
                    : 'bg-[var(--color-primary-dark)] text-white hover:bg-[var(--color-primary)] shadow-[var(--color-accent)] shadow-lg'
                }`}
            >
                {isDone ? (<><Check size={20} /> {t('studio_done')}</>) : (<><Camera size={20} /> {t('studio_validate')}</>)}
            </button>

            {isDone && currentStep < categories[category].steps.length - 1 && (
                 <button
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="mt-4 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] font-semibold"
                 >
                    {t('studio_next')} ▼
                 </button>
            )}
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {categories[category].steps.map((_, idx) => (
            <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentStep
                    ? 'w-6 bg-[var(--color-primary-dark)]'
                    : completedSteps.includes(idx)
                        ? 'w-2 bg-[var(--color-success)]'
                        : 'w-2 bg-[var(--color-accent)]'
                }`}
            />
        ))}
      </div>
    </div>
  );
}
