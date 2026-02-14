'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { RotateCcw, Trophy, Zap } from 'lucide-react';
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
  const [combo, setCombo] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    setCombo(1);
    setSelectedId(null);
    setIsProcessing(false);
  }, []);

  const checkForMatches = (currentGrid: string[]) => {
    const matches = new Set<number>();

    // Horizontal
    for (let i = 0; i < 64; i++) {
        const rowOfThree = [i, i + 1, i + 2];
        const decidedColor = currentGrid[i];
        const isBlank = currentGrid[i] === '';

        if (
            i % WIDTH < WIDTH - 2 &&
            rowOfThree.every(index => currentGrid[index] === decidedColor && !isBlank)
        ) {
            rowOfThree.forEach(index => matches.add(index));
        }
    }

    // Vertical
    for (let i = 0; i <= 47; i++) {
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

              // Score Update with Combo
              const points = matches.length * 10 * combo;
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

              // Increase combo
              setCombo(c => Math.min(c + 1, 5));

              if(matches.length > 4 && typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'combo_master' }));
              }

          } else {
              // No matches, check if we need to drop items
              const { newGrid, moved } = moveIntoSquareBelow(grid);
              if (moved) {
                  setGrid(newGrid);
              } else {
                  // Stable state
                  setIsProcessing(false);
                  if (combo > 1) {
                      // Reset combo after chain reaction ends
                      setTimeout(() => setCombo(1), 500);
                  }
              }
          }
      }, 150);

      return () => clearInterval(timer);
  }, [grid, highScore, score, combo]);


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
                  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'gamer' }));
              } else {
                  // No match, swap visually then revert logic (or just revert immediately)
                  // We'll set it, wait a bit, then revert to show "invalid move"
                  setGrid(newGrid);
                  setIsProcessing(true);
                  setTimeout(() => {
                      const revertGrid = [...newGrid];
                      revertGrid[selectedId] = newGrid[index];
                      revertGrid[index] = newGrid[selectedId];
                      setGrid(revertGrid);
                      setSelectedId(null);
                      setIsProcessing(false);
                  }, 400);
              }
          } else {
              setSelectedId(index);
          }
      }
  };

  return (
    <div className="text-center animate-fade-in max-w-md mx-auto select-none p-4 bg-[var(--color-surface)] rounded-[30px] shadow-[var(--shadow-soft)] border-4 border-[var(--color-bg)]">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
             <div className="bg-[var(--color-bg)] px-4 py-2 rounded-full border border-[var(--color-accent)]">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] block">{t('score')}</span>
                <span className="text-xl font-black text-[var(--color-secondary)]">{score}</span>
             </div>

             <div className="text-center">
                 <h2 className="text-xl font-bold text-[var(--color-primary-dark)] drop-shadow-sm font-comic leading-none">
                    {t('game_title')}
                </h2>
                {combo > 1 && (
                    <span className="text-xs font-bold text-orange-500 animate-pulse">COMBO x{combo}!</span>
                )}
             </div>

             <div className="bg-[var(--color-bg)] px-4 py-2 rounded-full border border-[var(--color-accent)]">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] block">{t('high_score')}</span>
                <span className="text-xl font-black text-[var(--color-primary-dark)]">{highScore}</span>
             </div>
        </div>

        {/* Board */}
        <div
            className="grid grid-cols-8 gap-1 bg-[var(--color-bg)] p-2 rounded-[20px] mx-auto aspect-square w-full shadow-inner border-2 border-[var(--color-accent)]"
        >
            <AnimatePresence mode='popLayout'>
                {grid.map((candy, index) => (
                    <motion.div
                        key={`${index}-${candy}`} // Key change triggers animation
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => handleInteraction(index)}
                        className={clsx(
                            "rounded-lg flex items-center justify-center text-2xl md:text-3xl cursor-pointer transition-all relative",
                            selectedId === index
                                ? "bg-[var(--color-accent)] ring-2 ring-[var(--color-primary)] z-10 shadow-lg"
                                : "hover:bg-white/10 active:scale-95",
                            candy === '' && "invisible"
                        )}
                    >
                        <span className="filter drop-shadow-md select-none">{candy}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-6 flex justify-center gap-4">
            <button
                onClick={createBoard}
                className="bg-[var(--color-primary-dark)] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 border-b-4 border-black/20"
            >
                <RotateCcw size={20} /> {t('btn_new_game')}
            </button>
        </div>

        <p className="mt-4 text-xs text-[var(--color-text-muted)] italic">
            Astuce: Alignez 3 symboles identiques !
        </p>
    </div>
  );
}
