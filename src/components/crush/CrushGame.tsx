'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { RotateCcw } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const WIDTH = 8;
const CANDY_TYPES = ['👗', '👠', '👜', '📦', '⭐', '💖'];

type Candy = {
    id: number;
    type: string;
};

export default function CrushGame() {
  const t = useTranslations('Crush');
  const [grid, setGrid] = useState<Candy[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [combo, setCombo] = useState(1);
  const [mounted, setMounted] = useState(false);

  // Unique ID generator for stable keys
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('crush_highscore');
    if (saved) setHighScore(parseInt(saved));
    initGame();
  }, []);

  const generateCandy = (idCounter: number): { candy: Candy, nextId: number } => {
      const type = CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)];
      return { candy: { id: idCounter, type }, nextId: idCounter + 1 };
  };

  const initGame = () => {
    let currentId = nextId;
    // Ensure the initial board has no matches?
    // For simplicity, we just generate random and let the loop clean it up or accept it.
    const newGrid: Candy[] = [];
    for (let i = 0; i < WIDTH * WIDTH; i++) {
        const { candy, nextId: n } = generateCandy(currentId);
        currentId = n;
        newGrid.push(candy);
    }
    setNextId(currentId);
    setGrid(newGrid);
    setScore(0);
    setCombo(1);
    setIsProcessing(false);
    setSelected(null);

    // Initial cleanup (optional, but good for UX)
    // setTimeout(() => processBoard(newGrid, currentId, 0), 500);
  };

  const checkMatches = (currentGrid: Candy[]) => {
      const matches = new Set<number>();

      // Horizontal
      for (let i = 0; i < WIDTH * WIDTH; i++) {
          if (i % WIDTH > WIDTH - 3) continue;
          const r = [i, i + 1, i + 2];
          const type = currentGrid[i]?.type;
          if (!type) continue;
          if (r.every(idx => currentGrid[idx]?.type === type)) {
              r.forEach(idx => matches.add(idx));
          }
      }

      // Vertical
      for (let i = 0; i < WIDTH * (WIDTH - 2); i++) {
          const c = [i, i + WIDTH, i + WIDTH * 2];
          const type = currentGrid[i]?.type;
          if (!type) continue;
          if (c.every(idx => currentGrid[idx]?.type === type)) {
              c.forEach(idx => matches.add(idx));
          }
      }

      return Array.from(matches);
  };

  const processBoard = useCallback((currentGrid: Candy[], currentIdCounter: number, currentCombo: number) => {
      setIsProcessing(true);

      // 1. Check Matches
      const matches = checkMatches(currentGrid);

      if (matches.length === 0) {
          setIsProcessing(false);
          setCombo(1);
          return;
      }

      // 2. Remove Matches & Score
      const points = matches.length * 10 * currentCombo;
      setScore(prev => {
          const newS = prev + points;
          if (newS > highScore) {
              setHighScore(newS);
              localStorage.setItem('crush_highscore', newS.toString());
          }
          // Trophies
          if (typeof window !== 'undefined') {
              if (newS >= 100) window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'high_score_100' }));
              if (newS >= 500) window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'score_500' }));
          }
          return newS;
      });

      if (matches.length >= 4 && typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'combo_master' }));
      }

      // Create a temporary grid with nulls for matched items
      const tempGrid = [...currentGrid];
      matches.forEach(idx => {
          // @ts-ignore
          tempGrid[idx] = null;
      });

      // 3. Gravity (Move items down)
      const finalGrid = new Array(WIDTH * WIDTH).fill(null);
      let nextId = currentIdCounter;

      for (let col = 0; col < WIDTH; col++) {
          let writeIdx = WIDTH * (WIDTH - 1) + col; // Start from bottom
          for (let row = WIDTH - 1; row >= 0; row--) {
              const readIdx = row * WIDTH + col;
              if (tempGrid[readIdx] !== null) {
                  finalGrid[writeIdx] = tempGrid[readIdx];
                  writeIdx -= WIDTH;
              }
          }
          // Fill remaining top spaces with new candies
          while (writeIdx >= 0) {
              const { candy, nextId: n } = generateCandy(nextId);
              nextId = n;
              finalGrid[writeIdx] = candy;
              writeIdx -= WIDTH;
          }
      }

      setNextId(nextId);
      setGrid(finalGrid as Candy[]);
      setCombo(currentCombo + 1);

      // 4. Recursion (Check again after delay)
      setTimeout(() => {
          processBoard(finalGrid as Candy[], nextId, currentCombo + 1);
      }, 600);
  }, [highScore]);

  const handleInteraction = (index: number) => {
      if (isProcessing) return;

      if (selected === null) {
          setSelected(index);
      } else {
          // Check if adjacent
          const diff = Math.abs(selected - index);
          const isAdjacent = (diff === 1 && Math.floor(selected / WIDTH) === Math.floor(index / WIDTH)) || diff === WIDTH;

          if (isAdjacent) {
              // Swap
              const newGrid = [...grid];
              const temp = newGrid[selected];
              newGrid[selected] = newGrid[index];
              newGrid[index] = temp;

              // Check if valid move
              const matches = checkMatches(newGrid);

              if (matches.length > 0) {
                  // Valid
                  setGrid(newGrid);
                  setSelected(null);
                  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'gamer' }));
                  setTimeout(() => processBoard(newGrid, nextId, 1), 300);
              } else {
                  // Invalid - Animate swap back?
                  // For now, just reset selection
                  setSelected(index); // Just select the new one instead? Or feedback?
                  // Let's select the new one to allow "oops I clicked wrong one, I meant this one"
                  // But if they clicked adjacent, they probably meant to swap.
                  // Visual feedback for invalid swap would be nice.
                  // Simplified: Just update selection.
                  setSelected(index);
              }
          } else {
              setSelected(index);
          }
      }
  };

  if(!mounted) return <div className="h-[400px] animate-pulse bg-[var(--color-bg)] rounded-[30px]" />;

  return (
    <div className="text-center animate-fade-in max-w-md mx-auto select-none p-4 bg-[var(--color-surface)] rounded-[30px] shadow-[var(--shadow-soft)] border-4 border-[var(--color-bg)]">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
             <div className="bg-[var(--color-bg)] px-4 py-2 rounded-full border border-[var(--color-accent)] min-w-[80px]">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] block">{t('score')}</span>
                <span className="text-xl font-black text-[var(--color-secondary)]">{score}</span>
             </div>

             <div className="text-center">
                 <h2 className="text-xl font-bold text-[var(--color-primary-dark)] drop-shadow-sm font-comic leading-none">
                    {t('game_title')}
                </h2>
                {combo > 1 && (
                    <span className="text-xs font-bold text-orange-500 animate-pulse block mt-1">COMBO x{combo}!</span>
                )}
             </div>

             <div className="bg-[var(--color-bg)] px-4 py-2 rounded-full border border-[var(--color-accent)] min-w-[80px]">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] block">{t('high_score')}</span>
                <span className="text-xl font-black text-[var(--color-primary-dark)]">{highScore}</span>
             </div>
        </div>

        {/* Board */}
        <div
            className="grid grid-cols-8 gap-1 bg-[var(--color-bg)] p-2 rounded-[20px] mx-auto aspect-square w-full shadow-inner border-2 border-[var(--color-accent)]"
        >
            <AnimatePresence mode='popLayout'>
                {grid.map((item, index) => (
                    <motion.div
                        key={item.id} // Stable ID for layout animation
                        layout
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        onClick={() => handleInteraction(index)}
                        className={clsx(
                            "rounded-lg flex items-center justify-center text-2xl md:text-3xl cursor-pointer transition-all relative",
                            selected === index
                                ? "bg-[var(--color-accent)] ring-2 ring-[var(--color-primary)] z-10 shadow-lg scale-110"
                                : "hover:bg-white/10 active:scale-95",
                            !item && "invisible"
                        )}
                    >
                        <span className="filter drop-shadow-md select-none pointer-events-none">{item?.type}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-6 flex justify-center gap-4">
            <button
                onClick={initGame}
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
