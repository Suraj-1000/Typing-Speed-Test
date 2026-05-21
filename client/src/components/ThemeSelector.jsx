import React, { useState, useEffect } from 'react';
import { Paintbrush } from 'lucide-react';

const THEMES = [
  { id: 'theme-dark', name: 'Dark Default', color: 'bg-zinc-800 border-zinc-600' },
  { id: 'theme-nord', name: 'Nord Arctic', color: 'bg-[#88c0d0] border-[#5e81ac]' },
  { id: 'theme-cyberpunk', name: 'Cyberpunk', color: 'bg-[#ff007f] border-[#ffff55]' },
  { id: 'theme-dracula', name: 'Dracula', color: 'bg-[#bd93f9] border-[#50fa7b]' },
  { id: 'theme-rosepine', name: 'Rose Pine', color: 'bg-[#ebbcba] border-[#f6c177]' },
];

/**
 * ThemeSelector Component
 * Allows users to choose their preferred color scheme.
 * Persists user preference via localStorage and applies to HTML element.
 */
const ThemeSelector = () => {
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('typo-theme') || 'theme-dark';
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    // Remove other theme classes
    THEMES.forEach((t) => root.classList.remove(t.id));
    // Add current theme class
    root.classList.add(activeTheme);
    localStorage.setItem('typo-theme', activeTheme);
  }, [activeTheme]);

  return (
    <div className="relative z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-lg border border-border bg-white/[0.02] hover:bg-white/[0.06] transition-all flex items-center gap-2 text-sm font-semibold select-none cursor-pointer"
        aria-label="Select Theme"
        id="theme-select-btn"
      >
        <Paintbrush className="w-4 h-4 text-primary" />
        <span className="hidden sm:inline text-xs font-mono">Theme</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop Clicker */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#16161b] p-2 shadow-2xl z-50 flex flex-col gap-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2.5 py-1.5 font-mono">Select Color Scheme</p>
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setActiveTheme(theme.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                  activeTheme === theme.id 
                    ? 'bg-primary/10 text-primary font-bold' 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                }`}
              >
                <span>{theme.name}</span>
                <span className={`w-3 h-3 rounded-full border ${theme.color}`} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
