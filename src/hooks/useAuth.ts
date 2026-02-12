import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Smart Data Merge Logic
      if (event === 'SIGNED_IN' && session?.user) {
        mergeLocalData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function mergeLocalData(userId: string) {
    // 1. Spoons
    const localSpoons = localStorage.getItem('spoons');
    if (localSpoons) {
      await supabase.from('profiles').update({ spoons: parseInt(localSpoons) }).eq('id', userId);
      // Optional: Clear local after sync or keep as cache?
      // Let's keep for offline resilience but prefer DB data.
    }

    // 2. High Score
    const localScore = localStorage.getItem('crush_highscore');
    if (localScore) {
       // Only update if higher
       const { data } = await supabase.from('profiles').select('high_score').eq('id', userId).single();
       if (data && parseInt(localScore) > (data.high_score || 0)) {
           await supabase.from('profiles').update({ high_score: parseInt(localScore) }).eq('id', userId);
       }
    }

    // 3. Trophies
    const localTrophies = JSON.parse(localStorage.getItem('unlocked_trophies') || '[]');
    if (localTrophies.length > 0) {
        const { data } = await supabase.from('profiles').select('unlocked_trophies').eq('id', userId).single();
        const dbTrophies = (data?.unlocked_trophies as string[]) || [];
        const newTrophies = [...new Set([...dbTrophies, ...localTrophies])];
        await supabase.from('profiles').update({ unlocked_trophies: newTrophies }).eq('id', userId);
    }
  }

  return { user, loading };
}
