'use client';

import CrushGame from '@/components/crush/CrushGame';

export default function CrushPage() {
  return (
    <div className="bg-[var(--color-surface)] rounded-[20px] p-6 shadow-[var(--shadow-soft)] min-h-[600px]">
      <CrushGame />
    </div>
  );
}
