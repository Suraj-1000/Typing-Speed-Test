import React, { useEffect, useState } from 'react';

/**
 * KeyboardVisualizer Component
 * A gamified glassmorphic QWERTY keyboard visualizer that highlights keys
 * in real-time as they are pressed on the physical keyboard.
 */
const KeyboardVisualizer = () => {
  const [activeKeys, setActiveKeys] = useState(new Set());

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.add(key);
        return next;
      });
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-5 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col gap-2 select-none">
      {rows.map((row, rIdx) => (
        <div key={rIdx} className="flex justify-center gap-1.5 w-full">
          {/* Offset left for lower rows to mimic typewriter stagger */}
          {rIdx === 1 && <div className="w-3" />}
          {rIdx === 2 && <div className="w-6" />}
          
          {row.map((key) => {
            const isActive = activeKeys.has(key);
            return (
              <div
                key={key}
                className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-mono font-bold uppercase transition-all duration-75 text-xs sm:text-sm border ${
                  isActive 
                    ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_12px_rgba(167,139,250,0.4)] translate-y-[2px]' 
                    : 'bg-white/[0.01] border-white/5 text-muted-foreground hover:border-white/15'
                }`}
              >
                {key}
              </div>
            );
          })}
        </div>
      ))}
      
      {/* Spacebar Row */}
      <div className="flex justify-center gap-1.5 w-full mt-1">
        <div
          className={`w-40 sm:w-56 h-8 sm:h-11 rounded-xl flex items-center justify-center font-mono font-bold uppercase transition-all duration-75 text-xs sm:text-sm border ${
            activeKeys.has(' ') 
              ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_12px_rgba(167,139,250,0.4)] translate-y-[2px]' 
              : 'bg-white/[0.01] border-white/5 text-muted-foreground hover:border-white/15'
          }`}
        >
          Space
        </div>
      </div>
    </div>
  );
};

export default KeyboardVisualizer;
