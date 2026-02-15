'use client';

import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/navigation'; // Correct next-intl Link
import {
  LayoutDashboard,
  Camera,
  Search,
  Wrench,
  Coffee,
  Gamepad2,
  Trophy
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Navigation() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();

  // Helper to check active state robustly
  // pathname includes locale prefix e.g. /fr/dashboard
  // item.href is /dashboard
  // We check if pathname ends with item.href OR equals item.href (for root)
  // More robust: remove locale prefix and compare
  const isActive = (href: string) => {
      // Remove locale prefix (e.g. /fr)
      const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
      if(pathWithoutLocale === '' && href === '/dashboard') return false; // Edge case
      return pathWithoutLocale.startsWith(href);
  };

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: t('home') },
    { href: '/studio', icon: Camera, label: t('studio') },
    { href: '/seo', icon: Search, label: t('seo') },
    { href: '/tools', icon: Wrench, label: t('tools') },
    { href: '/relax', icon: Coffee, label: t('relax') },
    { href: '/crush', icon: Gamepad2, label: t('crush') },
    { href: '/trophies', icon: Trophy, label: t('trophies') },
  ];

  return (
    <nav className="flex items-center gap-3 p-3 mb-5 bg-[var(--color-surface)] rounded-[20px] shadow-[var(--shadow-soft)] overflow-x-auto hide-scrollbar whitespace-nowrap">
      {navItems.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-[15px] font-semibold text-sm transition-all duration-200
              ${active
                ? 'nav-tab-active'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-primary-dark)]'
              }
            `}
          >
            <Icon size={18} strokeWidth={active ? 2.5 : 2} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
