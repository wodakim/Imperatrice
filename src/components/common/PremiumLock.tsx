'use client';

import { useState } from 'react';
import { usePremium } from '@/context/PremiumContext';
import { Lock, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PremiumLock({
  children,
  title = "Fonctionnalité Premium",
  price = "9.99€"
}: {
  children: React.ReactNode;
  title?: string;
  price?: string;
}) {
  const { isPremium, unlockPremium } = usePremium();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    await unlockPremium();
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  if (isPremium) return <>{children}</>;

  return (
    <div className="relative group overflow-hidden rounded-[var(--radius-lg)]">
      {/* Content Blurrred */}
      <div className="filter blur-md pointer-events-none select-none opacity-50 transition-all duration-500 group-hover:blur-lg">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm z-10 p-6 text-center animate-fade-in">
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-xl border border-[var(--color-accent)] max-w-sm w-full transform transition-transform hover:scale-105">
          <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-primary-dark)]">
            <Lock size={24} />
          </div>

          <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-2">{title}</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            Débloquez cette fonctionnalité et accédez à l'expérience complète pour seulement <span className="font-bold text-[var(--color-primary-dark)]">{price}</span>.
          </p>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-[var(--color-primary-dark)] text-white py-3 rounded-xl font-bold shadow-lg hover:bg-[var(--color-primary)] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            ) : success ? (
              "Débloqué ! 🎉"
            ) : (
              <>
                <CreditCard size={18} />
                Débloquer ({price})
              </>
            )}
          </button>

          <p className="text-[10px] text-[var(--color-text-muted)] mt-3">
            Paiement sécurisé via Stripe (Simulation). Satisfait ou remboursé.
          </p>
        </div>
      </div>
    </div>
  );
}
