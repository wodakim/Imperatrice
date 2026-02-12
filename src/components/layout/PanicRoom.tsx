'use client';

import { useState, useEffect } from 'react';

export default function PanicRoom() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handlePanic = () => setIsVisible(true);
    window.addEventListener('triggerPanic', handlePanic);
    return () => window.removeEventListener('triggerPanic', handlePanic);
  }, []);

  const close = () => setIsVisible(false);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center text-center p-5 bg-gradient-to-br from-[#a8c0ff] to-[#3f2b96] text-white overflow-y-auto animate-fade-in">
        <h2 className="text-4xl font-bold mb-2">Tu es en sécurité.</h2>
        <p className="text-xl max-w-xl mb-8 leading-relaxed">
            Respire. Tu es aimée. Tu es capable. <br />
            Cette anxiété n'est qu'un nuage qui passe, tu es le ciel. <br />
            Prends tout le temps qu'il te faut. 💖
        </p>

        <div className="bg-white/20 p-6 rounded-2xl mb-8 backdrop-blur-md text-left w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 border-b border-white/30 pb-2">Technique d'Ancrage 5-4-3-2-1</h3>
            <ul className="space-y-3">
                <li>👀 <b>5</b> choses que tu vois</li>
                <li>✋ <b>4</b> choses que tu peux toucher</li>
                <li>👂 <b>3</b> choses que tu entends</li>
                <li>👃 <b>2</b> choses que tu peux sentir</li>
                <li>👅 <b>1</b> chose que tu peux goûter</li>
            </ul>
        </div>

        <button
            onClick={close}
            className="bg-white text-[#3f2b96] px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:scale-105 transition-transform"
        >
            Je me sens mieux 🌿
        </button>
    </div>
  );
}
