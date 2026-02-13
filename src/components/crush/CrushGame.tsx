'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const WIDTH = 8;
const CANDY_COLORS = ['👗', '👠', '👜', '📦', '⭐', '💖'];

export default function CrushGame() {
  const t = useTranslations('Crush');

  const [grid, setGrid] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize
  useEffect(() => {
    const saved = localStorage.getItem('crush_highscore');
    if (saved) setHighScore(parseInt(saved));
    createBoard();
  }, []);

  const createBoard = useCallback(() => {
    const newGrid = [];
    for (let i = 0; i < WIDTH * WIDTH; i++) {
        const randomColor = CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)];
        newGrid.push(randomColor);
    }
    setGrid(newGrid);
    setScore(0);
    setSelectedId(null);
    setIsProcessing(false);
  }, []);

  // Check for matches
  const checkForMatches = (currentGrid: string[]) => {
    const matches = new Set<number>();

    // Horizontal
    for (let i = 0; i < 64; i++) {
        const rowOfThree = [i, i + 1, i + 2];
        const decidedColor = currentGrid[i];
        const isBlank = currentGrid[i] === '';

        if (
            i % WIDTH < WIDTH - 2 && // Prevent wrap-around matches
            rowOfThree.every(index => currentGrid[index] === decidedColor && !isBlank)
        ) {
            rowOfThree.forEach(index => matches.add(index));
        }
    }

    // Vertical
    for (let i = 0; i <= 47; i++) { // 47 is max index for start of vertical match (64 - 2*8)
        const columnOfThree = [i, i + WIDTH, i + WIDTH * 2];
        const decidedColor = currentGrid[i];
        const isBlank = currentGrid[i] === '';

        if (columnOfThree.every(index => currentGrid[index] === decidedColor && !isBlank)) {
            columnOfThree.forEach(index => matches.add(index));
        }
    }

    return Array.from(matches);
  };

  const moveIntoSquareBelow = (currentGrid: string[]) => {
      const newGrid = [...currentGrid];
      let moved = false;

      // Work from bottom up
      for (let i = 55; i >= 0; i--) {
          const isFirstRow = i < WIDTH;

          if (newGrid[i + WIDTH] === '') {
              newGrid[i + WIDTH] = newGrid[i];
              newGrid[i] = '';
              moved = true;
          }

          if (isFirstRow && newGrid[i] === '') {
              newGrid[i] = CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)];
              moved = true;
          }
      }
      return { newGrid, moved };
  };

  // Game Loop
  useEffect(() => {
      if (!grid.length) return;

      const timer = setInterval(() => {
          const matches = checkForMatches(grid);

          if (matches.length > 0) {
              // Valid matches found
              const newGrid = [...grid];
              matches.forEach(id => newGrid[id] = '');
              setGrid(newGrid);

              // Score Update
              const points = matches.length * 10;
              setScore(prev => {
                  const newScore = prev + points;
                  if (newScore > highScore) {
                      setHighScore(newScore);
                      localStorage.setItem('crush_highscore', newScore.toString());
                  }

                  // Trophies check
                  if (typeof window !== 'undefined') {
                       if (newScore >= 100) window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'high_score_100' }));
                       if (newScore >= 500) window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'score_500' }));
                  }
                  return newScore;
              });

          } else {
              // No matches, check if we need to drop items
              const { newGrid, moved } = moveIntoSquareBelow(grid);
              if (moved) {
                  setGrid(newGrid);
              } else {
                  // Stable state
                  setIsProcessing(false);
              }
          }
      }, 150);

      return () => clearInterval(timer);
  }, [grid, highScore, score]);


  const handleInteraction = (index: number) => {
      if (isProcessing) return;

      if (selectedId === null) {
          setSelectedId(index);
      } else {
          // Check adjacency
          const validMoves = [
              selectedId - 1,
              selectedId + 1,
              selectedId - WIDTH,
              selectedId + WIDTH
          ];

          // Prevent wrapping left/right
          if (selectedId % WIDTH === 0 && index === selectedId - 1) return setSelectedId(index);
          if (selectedId % WIDTH === WIDTH - 1 && index === selectedId + 1) return setSelectedId(index);

          if (validMoves.includes(index)) {
              // Valid adjacent move -> Swap
              const newGrid = [...grid];
              const temp = newGrid[index];
              newGrid[index] = newGrid[selectedId];
              newGrid[selectedId] = temp;

              // Check if swap results in a match
              const matches = checkForMatches(newGrid);

              if (matches.length > 0) {
                  setGrid(newGrid);
                  setSelectedId(null);
                  setIsProcessing(true);
                  // Trophy for playing
                  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'gamer' }));
              } else {
                  // No match, swap back animation logic or just reject
                  // For simplicity, we just select the new one if invalid swap (standard mobile game behavior sometimes)
                  // Or better: swap, wait, swap back.
                  setGrid(newGrid);
                  setTimeout(() => {
                      const revertGrid = [...newGrid];
                      revertGrid[selectedId] = newGrid[index];
                      revertGrid[index] = newGrid[selectedId];
                      setGrid(revertGrid);
                      setSelectedId(null);
                  }, 300);
              }
          } else {
              setSelectedId(index);
          }
      }
  };

  return (
    <div className="text-center animate-fade-in max-w-md mx-auto select-none">
        <h2 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-4 drop-shadow-sm font-comic">
            {t('game_title')}
        </h2>

        <div className="flex justify-between px-6 mb-4 font-bold text-[var(--color-text-main)] bg-[var(--color-bg)] py-3 rounded-xl shadow-inner">
            <div className="flex flex-col items-center">
                <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">{t('score')}</span>
                <span className="text-xl text-[var(--color-secondary)]">{score}</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">{t('high_score')}</span>
                <span className="text-xl text-[var(--color-primary-dark)]">{highScore}</span>
            </div>
        </div>

        <div
            className="grid grid-cols-8 gap-1 bg-[var(--color-surface)] p-3 rounded-[20px] mx-auto aspect-square w-full shadow-[var(--shadow-soft)] border-4 border-[var(--color-bg)]"
        >
            <AnimatePresence>
                {grid.map((candy, index) => (
                    <motion.div
                        key={index}
                        layout
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        onClick={() => handleInteraction(index)}
                        className={clsx(
                            "rounded-lg flex items-center justify-center text-2xl cursor-pointer transition-all duration-200",
                            selectedId === index
                                ? "bg-[var(--color-accent)] scale-110 shadow-lg ring-2 ring-[var(--color-primary-dark)] z-10"
                                : "bg-[var(--color-bg)] hover:brightness-95 active:scale-95",
                            candy === '' && "invisible"
                        )}
                    >
                        <span className="filter drop-shadow-sm">{candy}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>

        <button
            onClick={createBoard}
            className="mt-8 bg-[var(--color-secondary)] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto"
        >
            <RotateCcw size={20} /> {t('btn_new_game')}
        </button>
    </div>
  );
}
