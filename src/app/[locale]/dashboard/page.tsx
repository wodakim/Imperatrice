'use client';

import SpoonsWidget from '@/components/dashboard/SpoonsWidget';
import ChronoWidget from '@/components/dashboard/ChronoWidget';
import DailyTip from '@/components/dashboard/DailyTip';
import { useSyncStore } from '@/hooks/useSyncStore';

export default function DashboardPage() {
  // Sync Spoons (local key 'spoons', DB field 'spoons')
  const [spoons, setSpoons] = useSyncStore<number>('spoons', 12, 'spoons');

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SpoonsWidget spoons={spoons} setSpoons={setSpoons} />
        <ChronoWidget />
      </div>
      <DailyTip />
    </div>
  );
}
