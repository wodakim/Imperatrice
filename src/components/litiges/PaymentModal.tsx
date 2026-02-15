'use client';

import { useState } from 'react';
import { X, Lock, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBuy = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    onSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                <Lock size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Débloquez l'IA Illimitée</h2>
              <p className="text-gray-600 text-sm">
                Vous avez atteint votre limite quotidienne gratuite. <br/>
                Obtenez plus de réponses intelligentes maintenant.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 mb-6 flex items-center justify-between">
              <div>
                <p className="font-semibold text-purple-900">Pack Recharge</p>
                <p className="text-xs text-purple-700">5 Réponses IA Premium</p>
              </div>
              <div className="text-xl font-bold text-purple-600">1,99 €</div>
            </div>

            <button
              onClick={handleBuy}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  Payer 1,99 €
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
              <Lock size={12} /> Paiement sécurisé (Simulation)
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
