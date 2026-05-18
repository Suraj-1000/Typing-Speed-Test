import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw, Star, ShieldAlert } from 'lucide-react';

/**
 * ResultModal Component
 * Shows a beautiful summarized report of the typing test results.
 */
const ResultModal = ({ stats, onRestart, isSaving, saveError, user }) => {
  const { netWpm, rawWpm, accuracy, errors, elapsedSeconds } = stats;

  // Determine encouragement message based on netWpm
  let title = "Speedy Keystrokes!";
  let subtitle = "Great effort! Keep practicing to push your limits further.";
  let rankColor = "text-sky-400 bg-sky-950/40";

  if (netWpm >= 80) {
    title = "Mythical Typist!";
    subtitle = "Incredible speed! You are typing at an elite professional level!";
    rankColor = "text-purple-400 bg-purple-950/40 border border-purple-500/30";
  } else if (netWpm >= 55) {
    title = "Fluid Velocity!";
    subtitle = "Excellent work! Your fingers are flying across the keyboard.";
    rankColor = "text-emerald-400 bg-emerald-950/40 border border-emerald-500/30";
  } else if (netWpm >= 35) {
    title = "Steady Flow!";
    subtitle = "Nice typing speed! Consistency is the key to mastering accuracy.";
    rankColor = "text-amber-400 bg-amber-950/40 border border-amber-500/30";
  }

  // Calculate XP gained
  const xpGained = Math.round(netWpm * (accuracy / 100));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", duration: 0.5 }}
      className="w-full max-w-2xl p-8 rounded-2xl glass-panel relative overflow-hidden flex flex-col items-center text-center shadow-2xl border border-white/10"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-primary to-blue-500" />

      <div className="p-4 bg-primary/10 rounded-full text-primary mb-6">
        <Trophy className="w-12 h-12" />
      </div>

      <h2 className="text-3xl font-extrabold mb-2 gradient-text">{title}</h2>
      <p className="text-muted-foreground text-sm max-w-md mb-8">{subtitle}</p>

      {/* Grid of Results */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mb-8">
        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Net WPM</p>
          <span className="text-3xl font-extrabold text-foreground font-mono">{netWpm}</span>
        </div>
        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Accuracy</p>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono">{accuracy}%</span>
        </div>
        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Errors</p>
          <span className="text-3xl font-extrabold text-red-400 font-mono">{errors}</span>
        </div>
        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Time</p>
          <span className="text-3xl font-extrabold text-amber-400 font-mono">{elapsedSeconds}s</span>
        </div>
      </div>

      {/* Database Saving / XP Feedback */}
      {user ? (
        <div className="w-full p-4 mb-8 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Score Saved & XP Awarded!</p>
              <p className="text-xs text-muted-foreground">You gained <span className="text-yellow-400 font-bold font-mono">+{xpGained} XP</span>. Keep racing to level up!</p>
            </div>
          </div>
          {isSaving && (
            <span className="text-xs text-primary font-medium animate-pulse font-mono">Syncing scores...</span>
          )}
          {saveError && (
            <div className="flex items-center gap-1 text-red-400 text-xs font-medium font-mono">
              <ShieldAlert className="w-4 h-4" /> Save failed: {saveError}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full p-4 mb-8 rounded-xl bg-primary/5 border border-primary/20 text-center">
          <p className="text-sm text-muted-foreground">
            Want to save your typing progress, view analytics, and earn XP?{' '}
            <span className="text-primary font-semibold">Login to your account</span> to track your speed.
          </p>
        </div>
      )}

      {/* Restart Button */}
      <button
        onClick={onRestart}
        className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 hover:shadow-primary/30"
      >
        <RefreshCw className="w-5 h-5" /> Restart Typing Test
      </button>
    </motion.div>
  );
};

export default ResultModal;
