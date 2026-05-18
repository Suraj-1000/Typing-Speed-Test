import React from 'react';
import { Timer, Zap, Compass, AlertCircle } from 'lucide-react';

/**
 * StatsPanel Component
 * Displays live typing metrics in a beautiful glassmorphic layout.
 */
const StatsPanel = ({ wpm, accuracy, timeRemaining, errors, isActive }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full select-none">
      {/* WPM Stat */}
      <div className="p-4 rounded-xl glass-panel flex items-center gap-4 transition-all duration-300 hover:bg-white/5 hover:translate-y-[-2px]">
        <div className="p-3 rounded-lg bg-primary/20 text-primary">
          <Zap className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Speed</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-bold font-mono text-foreground">{wpm}</span>
            <span className="text-xs text-muted-foreground font-medium font-mono">WPM</span>
          </div>
        </div>
      </div>

      {/* Accuracy Stat */}
      <div className="p-4 rounded-xl glass-panel flex items-center gap-4 transition-all duration-300 hover:bg-white/5 hover:translate-y-[-2px]">
        <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400">
          <Compass className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Accuracy</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-bold font-mono text-foreground">{accuracy}</span>
            <span className="text-xs text-muted-foreground font-medium font-mono">%</span>
          </div>
        </div>
      </div>

      {/* Time Stat */}
      <div className="p-4 rounded-xl glass-panel flex items-center gap-4 transition-all duration-300 hover:bg-white/5 hover:translate-y-[-2px]">
        <div className="p-3 rounded-lg bg-amber-500/20 text-amber-400">
          <Timer className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-bold font-mono text-foreground">{timeRemaining}</span>
            <span className="text-xs text-muted-foreground font-medium font-mono">sec</span>
          </div>
        </div>
      </div>

      {/* Errors Stat */}
      <div className="p-4 rounded-xl glass-panel flex items-center gap-4 transition-all duration-300 hover:bg-white/5 hover:translate-y-[-2px]">
        <div className="p-3 rounded-lg bg-red-500/20 text-red-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Errors</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-bold font-mono text-foreground">{errors}</span>
            <span className="text-xs text-muted-foreground font-medium font-mono">errors</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
