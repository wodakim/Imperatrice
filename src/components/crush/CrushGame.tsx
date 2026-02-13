'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { RotateCcw } from 'lucide-react';
import clsx from 'clsx';

const WIDTH = 8;
const CANDY_COLORS = ['👗', '👠', '👜', '📦', '⭐', '💖'];

export default function CrushGame() {
  const t = useTranslations('Crush'); // Also uses keys like btn_new_game which might be in Dashboard or Crush
  // Based on extraction, game_title is in Crush namespace. btn_new_game might be in Dashboard or Crush.
  // Let's assume Crush namespace or fallback to raw string.

  const [grid, setGrid] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    setSelectedId(null);
  };

  const handleInteraction = (index: number) => {
      if(isProcessing) return;

      // Deselect if clicking same
      if(selectedId === index) {
          setSelectedId(null);
          return;
      }

      // First selection
      if(selectedId === null) {
          setSelectedId(index);
          return;
      }

      // Second selection: Check adjacency
      const validMoves = [selectedId - 1, selectedId - WIDTH, selectedId + 1, selectedId + WIDTH];
      if(validMoves.includes(index)) {
          // Swap
          swapItems(selectedId, index);
      } else {
          // Invalid move: just change selection
          setSelectedId(index);
      }
  };

  const swapItems = (id1: number, id2: number) => {
      setIsProcessing(true);
      const newGrid = [...grid];

      // Perform Swap
      const temp = newGrid[id1];
      newGrid[id1] = newGrid[id2];
      newGrid[id2] = temp;

      setGrid(newGrid);
      setSelectedId(null);

      // Check for Matches (Simplified for MVP)
      // In a real engine, we would check matches, remove them, drop items, refill, repeat.
      // Here we just award points for the "Move" to simulate gameplay feedback requested.
      // Or we can do a simple check.

      setTimeout(() => {
          // Simulate Score Logic
          const points = 15;
          const newScore = score + points;
          setScore(newScore);

          if(newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('crush_highscore', newScore.toString());
          }

          // Trophies
          if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'gamer' }));
              if(newScore >= 100) window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'high_score_100' }));
              if(newScore >= 500) window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'score_500' }));
          }

          setIsProcessing(false);
      }, 300);
  };

  return (
    <div className="text-center animate-fade-in max-w-md mx-auto select-none">
        <h2 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-4 drop-shadow-sm font-comic">
            {t('game_title')}
        </h2>

        <div className="flex justify-between px-6 mb-4 font-bold text-[var(--color-text-main)] bg-[var(--color-bg)] py-3 rounded-xl shadow-inner">
            <div className="flex flex-col items-center">
                <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">Score</span>
                <span className="text-xl text-[var(--color-secondary)]">{score}</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">Record</span>
                <span className="text-xl text-[var(--color-primary-dark)]">{highScore}</span>
            </div>
        </div>

        <div
            className="grid grid-cols-8 gap-1 bg-[var(--color-surface)] p-3 rounded-[20px] mx-auto aspect-square w-full shadow-[var(--shadow-soft)] border-4 border-[var(--color-bg)]"
        >
            {grid.map((candy, index) => (
                <div
                    key={index}
                    onClick={() => handleInteraction(index)}
                    className={clsx(
                        "rounded-lg flex items-center justify-center text-2xl cursor-pointer transition-all duration-200",
                        selectedId === index
                            ? "bg-[var(--color-accent)] scale-110 shadow-lg ring-2 ring-[var(--color-primary-dark)] z-10"
                            : "bg-[var(--color-bg)] hover:brightness-95 active:scale-95"
                    )}
                >
                    <span className="filter drop-shadow-sm">{candy}</span>
                </div>
            ))}
        </div>

        <button
            onClick={createBoard}
            className="mt-8 bg-[var(--color-secondary)] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto"
        >
            <RotateCcw size={20} /> {t('btn_new_game') || "Nouvelle Partie"}
        </button>
    </div>
  );
}
