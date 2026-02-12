'use client';

import SpoonsWidget from '@/components/dashboard/SpoonsWidget';
import ChronoWidget from '@/components/dashboard/ChronoWidget';
import DailyTip from '@/components/dashboard/DailyTip';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SpoonsWidget />
        <ChronoWidget />
      </div>
      <DailyTip />
    </div>
  );
}
