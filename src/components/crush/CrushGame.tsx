'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { RotateCcw } from 'lucide-react';

const WIDTH = 8;
const CANDY_COLORS = ['👗', '👠', '👜', '📦', '⭐', '💖'];

export default function CrushGame() {
  const t = useTranslations('Crush'); // Or Trophies/Dashboard depending on structure

  const [grid, setGrid] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [replacedId, setReplacedId] = useState<number | null>(null);

  // Init
  useEffect(() => {
    const saved = localStorage.getItem('crush_highscore');
    if(saved) setHighScore(parseInt(saved));
    createBoard();
  }, []);

  const createBoard = () => {
    const newGrid = [];
    for (let i = 0; i < WIDTH * WIDTH; i++) {
        const randomColor = CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)];
        newGrid.push(randomColor);
    }
    setGrid(newGrid);
    setScore(0);
  };

  // Drag Handlers
  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (id) setDraggedId(parseInt(id));
  };
  const onDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (id) setReplacedId(parseInt(id));
  };
  const onDragEnd = () => {
      if(draggedId === null || replacedId === null) return;

      const newGrid = [...grid];
      const validMoves = [draggedId - 1, draggedId - WIDTH, draggedId + 1, draggedId + WIDTH];

      if(validMoves.includes(replacedId)) {
          // Swap
          newGrid[replacedId] = grid[draggedId];
          newGrid[draggedId] = grid[replacedId];
          setGrid(newGrid);

          // Dummy score increment for prototype "feel"
          // In real app, check matches here.
          const points = 10;
          const newScore = score + points;
          setScore(newScore);

          if(newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('crush_highscore', newScore.toString());
          }

          // Check Trophies
          if (typeof window !== 'undefined') {
              if(newScore >= 100) window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'high_score_100' }));
              window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'gamer' }));
          }
      }

      setDraggedId(null);
      setReplacedId(null);
  };

  return (
    <div className="text-center animate-fade-in max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-4">{t('game_title') || "Vinted Crush"}</h2>

        <div className="flex justify-between px-8 mb-4 font-bold text-[var(--color-text-main)]">
            <div>Score: {score}</div>
            <div>Record: {highScore}</div>
        </div>

        <div className="grid grid-cols-8 gap-1 bg-[var(--color-bg)] p-2 rounded-[15px] mx-auto aspect-square w-full shadow-inner">
            {grid.map((candy, index) => (
                <div
                    key={index}
                    data-id={index}
                    draggable={true}
                    onDragStart={onDragStart}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={(e) => e.preventDefault()}
                    onDragLeave={(e) => e.preventDefault()}
                    onDrop={onDragDrop}
                    onDragEnd={onDragEnd}
                    className="bg-[var(--color-surface)] rounded-md flex items-center justify-center text-2xl cursor-pointer select-none shadow-sm hover:brightness-95 active:scale-90 transition-transform"
                >
                    {candy}
                </div>
            ))}
        </div>

        <button
            onClick={createBoard}
            className="mt-6 bg-[var(--color-secondary)] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
        >
            <RotateCcw size={20} /> {t('btn_new_game') || "Nouvelle Partie"}
        </button>
    </div>
  );
}
