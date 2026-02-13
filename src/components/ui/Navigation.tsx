'use client';

import { Home, Camera, Type, PenTool, Coffee, Heart, Trophy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const t = useTranslations('Navigation');

  const tabs = [
    { id: 'dashboard', label: t('home'), icon: Home },
    { id: 'studio', label: t('studio'), icon: Camera },
    { id: 'seo', label: t('seo'), icon: Type },
    { id: 'tools', label: t('tools'), icon: PenTool },
    { id: 'relax', label: t('relax'), icon: Coffee },
    { id: 'crush', label: t('crush'), icon: Heart },
    { id: 'trophies', label: t('trophies'), icon: Trophy },
  ];

  return (
    <nav className="flex justify-start gap-2.5 bg-[var(--surface)] rounded-[var(--border-radius)] p-2.5 mb-5 shadow-[var(--shadow-soft)] overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-[15px] font-semibold text-sm whitespace-nowrap transition-all duration-300",
              isActive
                ? "bg-[var(--primary)] text-white"
                : "bg-transparent text-[var(--text-muted)] hover:bg-[var(--background)] hover:text-[var(--primary-dark)]"
            )}
          >
            <Icon size={18} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
