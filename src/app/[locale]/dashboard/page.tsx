'use client';

import { useState } from 'react';
import SpoonsWidget from '@/components/dashboard/SpoonsWidget';
import ChronoWidget from '@/components/dashboard/ChronoWidget';
import DailyTip from '@/components/dashboard/DailyTip';

export default function DashboardPage() {
  const [spoons, setSpoons] = useState(12);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SpoonsWidget spoons={spoons} setSpoons={setSpoons} />
        <ChronoWidget />
      </div>
      <DailyTip />
    </div>
  );
}
