import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const mergeLocalData = useCallback(async (userId: string) => {
    // Basic implementation - expand as needed
    const localSpoons = localStorage.getItem('spoons');
    if (localSpoons) {
      await supabase.from('profiles').update({ spoons: parseInt(localSpoons) }).eq('id', userId);
    }
  }, [supabase]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        mergeLocalData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, mergeLocalData]);

  return { user, loading };
}
