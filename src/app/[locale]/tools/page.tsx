'use client';

import ProfitCalculator from '@/components/tools/ProfitCalculator';
import MagicScripts from '@/components/tools/MagicScripts';
import PackingChecklist from '@/components/tools/PackingChecklist';
import SeasonalCalendar from '@/components/tools/SeasonalCalendar';

export default function ToolsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in max-w-4xl mx-auto">
      <SeasonalCalendar />
      <ProfitCalculator />
      <MagicScripts />
      <PackingChecklist />
    </div>
  );
}
