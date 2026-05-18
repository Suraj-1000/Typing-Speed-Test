import React, { useRef, useEffect } from 'react';

/**
 * TypingDisplay Component
 * Renders the paragraph with rich coloring and a blinking cursor/caret.
 * Manages focusing the hidden typing input.
 */
const TypingDisplay = ({ paragraph, typedText, isActive, isFinished, onKeyDown }) => {
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Focus the input on mount or click
  const focusInput = () => {
    if (inputRef.current && !isFinished) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusInput();
  }, [isFinished]);

  const typedChars = typedText.split('');

  return (
    <div 
      className="relative w-full p-8 rounded-2xl glass-panel cursor-text select-none min-h-[160px] flex items-center justify-center transition-all duration-300 hover:border-primary/30"
      onClick={focusInput}
      ref={containerRef}
    >
      {/* Hidden input to catch keyboard input */}
      <input
        ref={inputRef}
        type="text"
        className="absolute inset-0 w-full h-full opacity-0 cursor-text outline-none"
        onKeyDown={onKeyDown}
        value=""
        onChange={() => {}}
        disabled={isFinished}
        autoFocus
      />

      <div className="text-xl md:text-2xl leading-relaxed tracking-wide font-medium font-mono text-muted-foreground transition-all duration-300">
        {paragraph.split('').map((char, index) => {
          let charClass = "transition-all duration-150 ";
          const isTyped = index < typedText.length;
          const isActiveChar = index === typedText.length;

          if (isTyped) {
            const isCorrect = typedChars[index] === char;
            charClass += isCorrect 
              ? "text-emerald-400 font-semibold drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]" 
              : "text-red-400 bg-red-950/30 rounded border-b-2 border-red-500 font-semibold";
          } else if (isActiveChar && !isFinished) {
            charClass += "text-primary relative";
          } else {
            charClass += "opacity-60";
          }

          return (
            <span key={index} className={`${charClass} relative`}>
              {isActiveChar && !isFinished && (
                <span className="absolute -left-[2px] top-0 bottom-0 w-[3px] bg-primary rounded-full caret-animated" />
              )}
              {char}
            </span>
          );
        })}
        {/* Cursor at the end of the text if fully typed */}
        {typedText.length === paragraph.length && !isFinished && (
          <span className="relative">
            <span className="absolute -left-[2px] top-0 bottom-0 w-[3px] bg-primary rounded-full caret-animated" />
          </span>
        )}
      </div>

      {/* Focus Prompt overlay if not active */}
      {!isActive && !isFinished && typedText.length === 0 && (
        <div className="absolute top-2 right-4 text-xs font-mono text-primary animate-pulse uppercase tracking-wider">
          Click or Type to Start
        </div>
      )}
    </div>
  );
};

export default TypingDisplay;
