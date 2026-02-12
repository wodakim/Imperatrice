'use client';

import StudioWizard from '@/components/studio/StudioWizard';

export default function StudioPage() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-[var(--color-surface)] rounded-[20px] p-6 shadow-[var(--shadow-soft)] min-h-[500px]">
        <StudioWizard />
      </div>
    </div>
  );
}
