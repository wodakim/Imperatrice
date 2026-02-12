'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useSyncStore<T>(key: string, initialValue: T, dbField?: string): [T, (val: T) => void] {
  // 1. Initial State from LocalStorage or Default
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const supabase = createClient();

  // 2. Set Value Wrapper (Updates Local + DB if needed)
  const setStoredValue = useCallback(async (val: T | ((prev: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = val instanceof Function ? val(value) : val;

      // Update State
      setValue(valueToStore);

      // Update LocalStorage
      if (typeof window !== 'undefined') {
        window.localStorage.getItem(key); // Just to ensure access
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }

      // Update Supabase (Optimistic UI: we don't wait for DB)
      if (dbField) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase
            .from('profiles')
            .update({ [dbField]: valueToStore })
            .eq('id', user.id);
        }
      }

    } catch (error) {
      console.error(error);
    }
  }, [key, value, dbField, supabase]); // Dep array checks

  return [value, setStoredValue];
}
