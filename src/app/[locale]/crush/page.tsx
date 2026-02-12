'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CrushPage() {
  const t = useTranslations('Crush');
  const [score, setScore] = useState(0);
  const [grid, setGrid] = useState<string[]>(Array(64).fill('🍬'));

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <h2 className="text-3xl font-caveat font-bold text-[var(--color-secondary)] animate-bounce">
        {t('game_title')}
      </h2>

      <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)] border-4 border-[var(--color-primary)]">
        <div className="flex justify-between w-full mb-4 px-4 font-bold text-[var(--color-primary-dark)]">
            <div>Score: {score}</div>
            <div>High Score: {0}</div>
        </div>

        <div className="grid grid-cols-8 gap-1 bg-[var(--color-bg)] p-2 rounded-lg">
            {grid.map((item, i) => (
                <div
                    key={i}
                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-[var(--color-surface)] rounded shadow-sm cursor-pointer hover:scale-110 transition-transform text-xl"
                    onClick={() => {
                        const newGrid = [...grid];
                        newGrid[i] = ['👗', '👠', '👜', '📦', '⭐', '💖'][Math.floor(Math.random() * 6)];
                        setGrid(newGrid);
                        setScore(s => s + 10);
                    }}
                >
                    {item}
                </div>
            ))}
        </div>
      </div>

      <p className="text-[var(--color-text-muted)] italic text-sm text-center max-w-md">
        Version Alpha: Cliquez sur les cases pour tester l'interaction React state.
      </p>
    </div>
  );
}
