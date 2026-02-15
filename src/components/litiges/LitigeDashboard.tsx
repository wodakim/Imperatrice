'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LitigeStrategy } from '@/data/litiges_strategies';
import LitigeChecklist from './LitigeChecklist';
import LitigeMagicBox from './LitigeMagicBox';
import PaymentModal from './PaymentModal';
import { useLitigeCredits } from '@/hooks/useLitigeCredits'; // Will be created
import { Lightbulb, Gavel } from 'lucide-react';

interface LitigeDashboardProps {
  strategy: LitigeStrategy;
}

const SimpleDonutChart = ({ data, labels }: { data: number[]; labels: string[] }) => {
  // Simple SVG Donut
  const total = data.reduce((acc, v) => acc + v, 0);
  let cumulative = 0;
  const colors = ['#fca5a5', '#93c5fd', '#86efac']; // Red, Blue, Green

  const slices = data.map((value, i) => {
    const startAngle = (cumulative / total) * 360;
    const endAngle = ((cumulative + value) / total) * 360;
    const largeArcFlag = value / total > 0.5 ? 1 : 0;

    // Convert polar to cartesian
    const x1 = 50 + 40 * Math.cos((startAngle - 90) * (Math.PI / 180));
    const y1 = 50 + 40 * Math.sin((startAngle - 90) * (Math.PI / 180));
    const x2 = 50 + 40 * Math.cos((endAngle - 90) * (Math.PI / 180));
    const y2 = 50 + 40 * Math.sin((endAngle - 90) * (Math.PI / 180));

    cumulative += value;

    return (
      <path
        key={i}
        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
        fill={colors[i % colors.length]}
      />
    );
  });

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
        {slices}
        <circle cx="50" cy="50" r="25" fill="white" />
      </svg>
      <div className="mt-4 space-y-1 w-full">
        {labels.map((label, i) => (
          <div key={i} className="flex items-center text-xs text-[var(--color-text-secondary)]">
            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[i % colors.length] }}></span>
            <span>{label} ({data[i]}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function LitigeDashboard({ strategy }: LitigeDashboardProps) {
  const t = useTranslations('Litiges');
  const { credits, isDailyUsed, useCredit, buyCredits } = useLitigeCredits();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (detail: string, tone: string) => {
    // 1. Check Credits
    const hasCredit = await useCredit();
    if (!hasCredit) {
      setIsPaymentModalOpen(true);
      return;
    }

    setIsGenerating(true);
    setGeneratedText(null);

    try {
      // 2. Call API
      // Construct prompt
      const prompt = `Agis comme un expert en résolution de litiges e-commerce (Vinted).
            Rédige une réponse courte pour un vendeur.
            Contexte juridique : ${strategy.context}.
            Détails fournis par le vendeur : ${detail}.
            Ton souhaité : ${tone} (Diplomate=emphatique, Factuel=neutre, Juridique=ferme).
            Instruction : Reste calme, professionnel, ne t'excuse pas si le vendeur est dans son droit. Ne signe pas le message.`;

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setGeneratedText(data.text);

    } catch (e) {
      console.error(e);
      setGeneratedText(strategy.defaultTemplate + " (Erreur IA, modèle par défaut chargé)");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBuyCredits = async () => {
    await buyCredits(); // This might update state optimistically or via DB
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* Left Column: Analysis & Data */}
      <div className="space-y-6">
        <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border-l-4 border-[var(--color-primary)] p-6">
          <h3 className="font-serif font-bold text-lg text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
            <Gavel size={20} />
            {t('legal_context')}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
            {strategy.context}
          </p>
          <div className="bg-[var(--color-bg)] rounded-lg p-3 border border-[var(--color-border)] flex items-start gap-2">
            <Lightbulb className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-[var(--color-text-primary)] font-medium">
              {strategy.tip}
            </p>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] p-6">
          <h3 className="font-serif font-bold text-[var(--color-text-primary)] mb-4 text-sm uppercase tracking-wider">
            {t('outcome_chart')}
          </h3>
          <SimpleDonutChart data={strategy.chartData} labels={strategy.chartLabels} />
        </div>
      </div>

      {/* Center Column: Checklist */}
      <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)]">
        <LitigeChecklist items={strategy.checklist} />
      </div>

      {/* Right Column: Magic Box */}
      <div>
        <LitigeMagicBox
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          generatedText={generatedText}
          credits={credits}
          dailyUsed={isDailyUsed}
          onBuyCredits={() => setIsPaymentModalOpen(true)}
        />
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handleBuyCredits}
      />
    </div>
  );
}
