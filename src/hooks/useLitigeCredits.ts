'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export function useLitigeCredits() {
  const [credits, setCredits] = useState(0);
  const [dailyCount, setDailyCount] = useState(0);
  const [lastUsageDate, setLastUsageDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize Supabase client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    loadCredits();
  }, []);

  const getTodayString = () => new Date().toISOString().split('T')[0];

  const loadCredits = async () => {
    setLoading(true);

    // 1. Try to load from Supabase if user is logged in
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('litige_credits, daily_litige_count, last_litige_usage')
        .eq('id', session.user.id)
        .single();

      if (data && !error) {
        setCredits(data.litige_credits || 0);

        // Check if day changed
        const today = getTodayString();
        const lastDate = data.last_litige_usage ? data.last_litige_usage.split('T')[0] : null;

        if (lastDate !== today) {
           // New day, reset daily count locally (and should update DB on next usage)
           setDailyCount(0);
           setLastUsageDate(today);
           // Optionally reset in DB now, but lazy update is fine
        } else {
           setDailyCount(data.daily_litige_count || 0);
           setLastUsageDate(lastDate);
        }
      }
    } else {
      // Guest mode: Use localStorage
      const localCredits = parseInt(localStorage.getItem('litige_credits') || '0');
      const localDaily = parseInt(localStorage.getItem('daily_litige_count') || '0');
      const localDate = localStorage.getItem('last_litige_usage');
      const today = getTodayString();

      setCredits(localCredits);
      if (localDate !== today) {
        setDailyCount(0);
        setLastUsageDate(today);
        localStorage.setItem('daily_litige_count', '0');
        localStorage.setItem('last_litige_usage', today);
      } else {
        setDailyCount(localDaily);
        setLastUsageDate(localDate);
      }
    }
    setLoading(false);
  };

  const updateRemoteProfile = async (updates: any) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
          await supabase.from('profiles').update(updates).eq('id', session.user.id);
      }
  };

  const useCredit = async (): Promise<boolean> => {
    const today = getTodayString();

    // Logic: 1 free per day
    // If dailyCount < 1, it's free.
    // Else, consume credit.

    if (dailyCount < 1) {
      // Use free daily
      const newDaily = 1;
      setDailyCount(newDaily);
      setLastUsageDate(today);

      // Persist
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await updateRemoteProfile({
            daily_litige_count: newDaily,
            last_litige_usage: new Date().toISOString()
        });
      } else {
        localStorage.setItem('daily_litige_count', newDaily.toString());
        localStorage.setItem('last_litige_usage', today);
      }
      return true;
    } else {
      // Use paid credit
      if (credits > 0) {
        const newCredits = credits - 1;
        setCredits(newCredits);

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            await updateRemoteProfile({ litige_credits: newCredits });
        } else {
            localStorage.setItem('litige_credits', newCredits.toString());
        }
        return true;
      } else {
        return false;
      }
    }
  };

  const buyCredits = async () => {
    const newCredits = credits + 5;
    setCredits(newCredits);

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
        await updateRemoteProfile({ litige_credits: newCredits });
    } else {
        localStorage.setItem('litige_credits', newCredits.toString());
    }
  };

  return {
    credits,
    dailyCount,
    isDailyUsed: dailyCount >= 1,
    useCredit,
    buyCredits,
    loading
  };
}
