import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { createClient } from '@/lib/supabase/client';

export function useSyncStore<T>(key: string, initialValue: T, dbField: string) {
  const { user } = useAuth();
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const supabase = createClient();

  // 1. Initial Load: Try LocalStorage first (Optimistic), then DB if user
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load Local
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.log(error);
    }

    // Load Remote (if User)
    if (user) {
      const fetchRemote = async () => {
        const { data } = await supabase
          .from('profiles')
          .select(dbField)
          .eq('id', user.id)
          .single();

        if (data && (data as any)[dbField] !== null) {
          // Remote wins on load (source of truth)
          // Ideally we merge strategies, but "Remote Wins" prevents data loss on device switch
          setStoredValue((data as any)[dbField]);
          // Sync back to local to keep it fresh
          window.localStorage.setItem(key, JSON.stringify((data as any)[dbField]));
        }
      };
      fetchRemote();
    }
  }, [key, user, dbField]);

  // 2. Set Value: Update Local immediately, Push Remote in background
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Update State
      setStoredValue(valueToStore);

      // Update LocalStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }

      // Update Remote (Debounced ideally, but here direct for simplicity/reliability test)
      if (user) {
        const updatePayload: any = {};
        updatePayload[dbField] = valueToStore;

        supabase
          .from('profiles')
          .update(updatePayload)
          .eq('id', user.id)
          .then(({ error }) => {
             if (error) console.error("Sync Error:", error);
          });
      }

    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue, user, dbField]);

  return [storedValue, setValue] as const;
}
