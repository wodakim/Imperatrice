'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Eye, Info, TrendingUp, AlertCircle, Ruler, Check } from 'lucide-react';
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
      setError("Impossible d'accéder à la caméra.");
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
    if (currentStep < categories[category!].steps.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 500);
    }
  };

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
              className="flex items-center p-5 bg-[var(--color-surface)] border border-[var(--color-accent)] rounded-[var(--radius-lg)] text-left gap-4 hover:shadow-md transition-shadow"
            >
              <div className="text-[var(--color-primary-dark)]">
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

  return (
    <div className="relative min-h-[80vh] flex flex-col">
      <div className="relative flex-1 bg-black rounded-[var(--radius-lg)] overflow-hidden shadow-lg mb-4 aspect-[3/4] md:aspect-video">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-white p-4 text-center">
            {error}
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 border-2 border-white/30 pointer-events-none m-4 rounded-lg flex items-center justify-center">
             <div className="text-white/50 text-sm bg-black/20 px-2 rounded">Aligner ici</div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pt-20">
            <div className="flex items-center justify-between text-white mb-4">
                <button onClick={() => setCategory(null)} className="text-sm opacity-80 hover:opacity-100">← Quitter</button>
                <div className="font-bold text-sm tracking-widest uppercase text-[var(--color-secondary)]">Studio Mode</div>
                <div className="font-bold">{currentStep + 1}/{categories[category].steps.length}</div>
            </div>
            <div className="bg-[var(--color-surface)]/90 backdrop-blur-md rounded-2xl p-5 text-[var(--color-text-main)] shadow-xl transition-all">
                <div className="flex gap-4 mb-4">
                    <div className="bg-[var(--color-bg)] p-3 rounded-xl text-[var(--color-primary-dark)] h-fit">
                        <StepIcon size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-1">{stepData.title}</h3>
                        <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: stepData.description }}></p>
                    </div>
                </div>
                <div className="bg-[#2D2D3A] text-[#E0E0E0] p-3 rounded-lg text-xs flex gap-2 mb-4 items-center">
                    <span className="text-yellow-400 text-lg">⚡</span>
                    <span dangerouslySetInnerHTML={{ __html: stepData.algoSecret }}></span>
                </div>
                <button
                    onClick={handleStepComplete}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                        isDone ? 'bg-[var(--color-success)] text-white scale-95' : 'bg-[var(--color-primary-dark)] text-white hover:bg-[var(--color-primary)] shadow-[var(--color-accent)] shadow-lg'
                    }`}
                >
                    {isDone ? (<><Check size={20} /> {t('studio_done')}</>) : (<><Camera size={20} /> {t('studio_validate')}</>)}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
