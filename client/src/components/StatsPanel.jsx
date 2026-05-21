import React from 'react';
import { Timer, Zap, Target, AlertCircle } from 'lucide-react';

/**
 * StatsPanel Component
 * Displays live typing metrics in a beautiful glassmorphic layout.
 * Displays time count down or count up depending on the test mode.
 */
const StatsPanel = ({ wpm, accuracy, timeRemaining, errors, isActive, mode = 'time' }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full select-none">
      {/* WPM Stat */}
      <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center gap-4 transition-all duration-300 hover:bg-white/5 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
        <div className="p-3 rounded-xl bg-primary/10 text-primary shadow-[0_0_15px_rgba(167,139,250,0.15)]">
          <Zap className={`w-5 h-5 ${isActive ? 'animate-bounce' : ''}`} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">Speed</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-black font-mono text-foreground">{wpm}</span>
            <span className="text-[10px] text-muted-foreground font-bold font-mono">WPM</span>
          </div>
        </div>
      </div>

      {/* Accuracy Stat */}
      <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center gap-4 transition-all duration-300 hover:bg-white/5 hover:-translate-y-1 hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5">
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">Accuracy</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-black font-mono text-foreground">{accuracy}</span>
            <span className="text-[10px] text-muted-foreground font-bold font-mono">%</span>
          </div>
        </div>
      </div>

      {/* Time Stat */}
      <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center gap-4 transition-all duration-300 hover:bg-white/5 hover:-translate-y-1 hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/5">
        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          <Timer className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
            {mode === 'time' ? 'Time Left' : 'Elapsed'}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-black font-mono text-foreground">{timeRemaining}</span>
            <span className="text-[10px] text-muted-foreground font-bold font-mono">sec</span>
          </div>
        </div>
      </div>

      {/* Errors Stat */}
      <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center gap-4 transition-all duration-300 hover:bg-white/5 hover:-translate-y-1 hover:border-red-500/20 hover:shadow-lg hover:shadow-red-500/5">
        <div className="p-3 rounded-xl bg-red-500/10 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">Errors</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-black font-mono text-foreground">{errors}</span>
            <span className="text-[10px] text-muted-foreground font-bold font-mono">errors</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
