'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type BrandTheme = 'classic' | 'fraise';

interface BrandThemeContextType {
  brand: BrandTheme;
  setBrand: (brand: BrandTheme) => void;
}

const BrandThemeContext = createContext<BrandThemeContextType | undefined>(undefined);

export function BrandThemeProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrandState] = useState<BrandTheme>('classic');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('brand-theme') as BrandTheme;
    if (saved && ['classic', 'fraise'].includes(saved)) {
      setBrandState(saved);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-brand', brand);
      localStorage.setItem('brand-theme', brand);
    }
  }, [brand, mounted]);

  const setBrand = (newBrand: BrandTheme) => {
    setBrandState(newBrand);
  };

  // Avoid hydration mismatch by rendering children only after mount,
  // or accept the flash. Better to render, but maybe layout shift.
  // Actually, for theme, it's better to accept initial default to avoid empty screen.

  return (
    <BrandThemeContext.Provider value={{ brand, setBrand }}>
      {children}
    </BrandThemeContext.Provider>
  );
}

export function useBrandTheme() {
  const context = useContext(BrandThemeContext);
  if (context === undefined) {
    throw new Error('useBrandTheme must be used within a BrandThemeProvider');
  }
  return context;
}
