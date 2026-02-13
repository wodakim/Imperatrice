'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PremiumContextType {
  isPremium: boolean;
  checkPremium: () => Promise<void>;
  unlockPremium: () => Promise<void>;
  isLoading: boolean;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  const checkPremium = useCallback(async () => {
    if (!user) {
      setIsPremium(false);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching premium status:', error);
        setIsPremium(false);
      } else {
        setIsPremium(data?.is_premium || false);
      }
    } catch (err) {
      console.error('Error:', err);
      setIsPremium(false);
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);

  const unlockPremium = async () => {
    if (!user) return;

    // Simulate payment success immediately for UX
    setIsPremium(true);

    try {
        await supabase
            .from('profiles')
            .update({ is_premium: true })
            .eq('id', user.id);
    } catch (error) {
        console.error("Failed to update premium status", error);
        // In real app, revert state or show error
    }
  };

  useEffect(() => {
    checkPremium();
  }, [checkPremium]);

  return (
    <PremiumContext.Provider value={{ isPremium, checkPremium, unlockPremium, isLoading }}>
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
