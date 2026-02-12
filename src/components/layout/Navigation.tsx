'use client';

import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Camera,
  Search,
  Wrench,
  Coffee,
  Gamepad2,
  Trophy
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

export default function Navigation() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();

  // Active state based on route
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <nav className="fixed bottom-0 left-0 w-full md:w-auto md:sticky md:top-5 md:bottom-auto bg-[var(--color-surface)] shadow-[var(--shadow-soft)] p-3 flex md:flex-col justify-between md:h-[calc(100vh-40px)] md:max-w-[100px] z-50 overflow-x-auto md:overflow-visible no-scrollbar">
      <ul className="flex md:flex-col gap-2 w-full min-w-max md:min-w-0 justify-between md:justify-start px-2 md:px-0">
        <NavItem href="/dashboard" icon={LayoutDashboard} label={t('home')} active={isActive('/dashboard')} />
        <NavItem href="/studio" icon={Camera} label={t('studio')} active={isActive('/studio')} />
        <NavItem href="/seo" icon={Search} label={t('seo')} active={isActive('/seo')} />
        <NavItem href="/tools" icon={Wrench} label={t('tools')} active={isActive('/tools')} />
        <NavItem href="/relax" icon={Coffee} label={t('relax')} active={isActive('/relax')} />
        <NavItem href="/crush" icon={Gamepad2} label={t('crush')} active={isActive('/crush')} />
        <NavItem href="/trophies" icon={Trophy} label={t('trophies')} active={isActive('/trophies')} />
      </ul>
    </nav>
  );
}

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
  return (
    <li className="flex-1 md:flex-none">
      <Link
        href={href}
        className={clsx(
          "flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 w-full min-w-[70px] md:min-w-[80px]",
          active
            ? "bg-[var(--color-primary)] text-white shadow-md transform scale-105"
            : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-primary-dark)]"
        )}
      >
        <Icon size={24} strokeWidth={active ? 2.5 : 2} />
        <span className="text-[10px] font-medium mt-1 truncate w-full text-center md:hidden">{label}</span>
      </Link>
    </li>
  );
}
