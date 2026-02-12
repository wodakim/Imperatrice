'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

type PremiumContextType = {
  isPremium: boolean;
  unlockPremium: () => Promise<void>;
  loading: boolean;
};

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Load premium status
  useEffect(() => {
    async function checkPremium() {
      if (!user) {
        // Guest mode: check localStorage for simulated premium (for dev/demo)
        // In real prod, guests are never premium unless they login
        const localPremium = localStorage.getItem('is_premium_guest') === 'true';
        setIsPremium(localPremium);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', user.id)
        .single();

      setIsPremium(data?.is_premium || false);
      setLoading(false);
    }

    checkPremium();
  }, [user]);

  const unlockPremium = async () => {
    // Simulate payment process
    await new Promise(resolve => setTimeout(resolve, 1500)); // Fake API delay

    if (user) {
      // Update DB
      await supabase.from('profiles').update({ is_premium: true }).eq('id', user.id);
      setIsPremium(true);
    } else {
      // Update Local
      localStorage.setItem('is_premium_guest', 'true');
      setIsPremium(true);
      // Ideally, trigger login flow here in real app
    }
  };

  return (
    <PremiumContext.Provider value={{ isPremium, unlockPremium, loading }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
}
