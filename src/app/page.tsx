'use client';

import { useState } from 'react';
import Header from '@/components/ui/Header';
import Navigation from '@/components/ui/Navigation';
import AdBanner from '@/components/ui/AdBanner';
import PanicOverlay from '@/components/modules/PanicOverlay';

// Views
import DashboardView from '@/components/modules/dashboard/DashboardView';
import StudioWizard from '@/components/modules/studio/StudioWizard';
import SeoGenerator from '@/components/modules/seo/SeoGenerator';
import ToolsView from '@/components/modules/tools/ToolsView';
import RelaxView from '@/components/modules/relax/RelaxView';
import CrushGame from '@/components/modules/crush/CrushGame';
import TrophySystem from '@/components/modules/gamification/TrophySystem';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'studio': return <StudioWizard />;
      case 'seo': return <SeoGenerator />;
      case 'tools': return <ToolsView />;
      case 'relax': return <RelaxView />;
      case 'crush': return <CrushGame />;
      case 'trophies': return <TrophySystem />;
      default: return <DashboardView />;
    }
  };

  return (
    <main className="max-w-[800px] mx-auto p-5 pb-24 min-h-screen relative">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-5 min-h-[500px]">
        {renderContent()}
      </div>

      <AdBanner />
      <PanicOverlay />
    </main>
  );
}
