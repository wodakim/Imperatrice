'use client';

import ProfitCalculator from './ProfitCalculator';
import MagicScripts from './MagicScripts';
import PackingChecklist from './PackingChecklist';
import SeasonalCalendar from './SeasonalCalendar';

export default function ToolsView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
        <SeasonalCalendar />
        <ProfitCalculator />
        <MagicScripts />
        <PackingChecklist />
    </div>
  );
}
