'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { strategies, LitigeStrategy } from '@/data/litiges_strategies';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface LitigeDiagnosticProps {
  onStrategySelect: (strategy: LitigeStrategy) => void;
}

export default function LitigeDiagnostic({ onStrategySelect }: LitigeDiagnosticProps) {
  const t = useTranslations('Litiges');
  const tStrategies = useTranslations('Litiges.Strategies');
  const [buyerMessage, setBuyerMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ category: string; reason: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleManualSelect = (key: string) => {
    onStrategySelect(strategies[key]);
    // clear analysis if manual selection
    setAnalysisResult(null);
  };

  const analyzeWithGemini = async () => {
    if (!buyerMessage.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const prompt = `Analyses ce message d'un acheteur Vinted : "${buyerMessage}".
      Catégorise le problème parmi ces codes :
      'snad' (Non conforme, tache, trou),
      'mind' (Changement d'avis, taille, style),
      'damage' (Cassé, abimé transport),
      'fake' (Contrefaçon),
      'lost' (Colis perdu, non reçu),
      'scam' (Arnaque, email, lien).
      Réponds UNIQUEMENT au format JSON strict : { "category": "code", "reason": "explication courte en français" }.`;

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error('Erreur API');

      const data = await res.json();
      const text = data.text;

      // Extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const json = JSON.parse(jsonMatch[0]);
        if (strategies[json.category]) {
          setAnalysisResult(json);
          onStrategySelect(strategies[json.category]);
        } else {
            setError("Catégorie non reconnue par l'IA. Veuillez choisir manuellement.");
        }
      } else {
        setError("Format de réponse invalide. Veuillez choisir manuellement.");
      }

    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'analyse. Veuillez réessayer ou choisir manuellement.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] p-6 md:p-8">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] flex items-center">
          <span className="bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 font-bold">1</span>
          {t('step_1_title')}
        </h2>
        <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded border border-purple-100 flex items-center gap-1">
          <Sparkles size={12} />
          {t('step_1_badge')}
        </span>
      </div>

      {/* AI Input Section */}
      <div className="mb-8 bg-[var(--color-bg)] rounded-xl p-4 border border-[var(--color-border)]">
        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
          {t('input_label')}
        </label>
        <div className="relative">
          <textarea
            value={buyerMessage}
            onChange={(e) => setBuyerMessage(e.target.value)}
            rows={3}
            className="w-full p-3 rounded-lg border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-sm bg-[var(--color-surface)] text-[var(--color-text-primary)]"
            placeholder={t('input_ph')}
          />
          <button
            onClick={analyzeWithGemini}
            disabled={isAnalyzing || !buyerMessage.trim()}
            className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded-md shadow transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
            <span>{t('btn_analyze')}</span>
          </button>
        </div>

        {/* Analysis Result or Error */}
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-purple-50 border border-purple-100 rounded-lg text-sm text-purple-800 flex items-start gap-2"
          >
            <Sparkles className="mt-0.5 flex-shrink-0" size={16} />
            <div>
              <p className="font-semibold">Analyse IA :</p>
              <p>{analysisResult.reason}</p>
            </div>
          </motion.div>
        )}

        {error && (
            <div className="mt-3 text-red-500 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
            </div>
        )}
      </div>

      <div className="border-t border-[var(--color-border)] pt-6">
        <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide font-bold mb-4">
          {t('or_manual')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(strategies).map((s) => (
            <label key={s.id} className="cursor-pointer group relative">
              <input
                type="radio"
                name="strategy"
                value={s.id}
                className="peer sr-only"
                onChange={() => handleManualSelect(s.id)}
              />
              <div className="p-5 rounded-xl border-2 border-[var(--color-border)] peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary-light)] hover:bg-[var(--color-bg)] transition-all h-full text-center group-hover:border-[var(--color-border-hover)] bg-[var(--color-surface)]">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="font-medium text-[var(--color-text-primary)]">{tStrategies(`${s.id}.title`)}</div>
                <div className="text-xs text-[var(--color-text-muted)] mt-1">{tStrategies(`${s.id}.description`)}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
