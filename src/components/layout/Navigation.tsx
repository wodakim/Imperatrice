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
  const isActive = (route: string) => pathname.includes(route);

  return (
    <nav className="flex justify-start gap-3 bg-[var(--color-surface)] rounded-[20px] p-[10px] mb-5 shadow-[var(--shadow-soft)] overflow-x-auto hide-scrollbar">
      <NavItem href="/dashboard" icon={LayoutDashboard} label={t('home')} active={isActive('/dashboard')} />
      <NavItem href="/studio" icon={Camera} label={t('studio')} active={isActive('/studio')} />
      <NavItem href="/seo" icon={Search} label={t('seo')} active={isActive('/seo')} />
      <NavItem href="/tools" icon={Wrench} label={t('tools')} active={isActive('/tools')} />
      <NavItem href="/relax" icon={Coffee} label={t('relax')} active={isActive('/relax')} />
      <NavItem href="/crush" icon={Gamepad2} label={t('crush')} active={isActive('/crush')} />
      <NavItem href="/trophies" icon={Trophy} label={t('trophies')} active={isActive('/trophies')} />
    </nav>
  );
}

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={clsx(
        "flex flex-row items-center gap-2 px-4 py-2.5 rounded-[15px] whitespace-nowrap min-w-fit text-sm font-semibold transition-all duration-200",
        active
          ? "nav-tab-active"
          : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-primary-dark)]"
      )}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      <span>{label}</span>
    </Link>
  );
}
