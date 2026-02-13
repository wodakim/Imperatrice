'use client';

import SpoonsWidget from './SpoonsWidget';
import ChronoWidget from './ChronoWidget';
import DailyTip from './DailyTip';

export default function DashboardView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
      <SpoonsWidget />
      <ChronoWidget />
      <div className="col-span-1 md:col-span-2">
        <DailyTip />
      </div>
    </div>
  );
}
