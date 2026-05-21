import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw, Star, ShieldAlert, Zap, Target, AlertCircle, Timer, Award } from 'lucide-react';
import { useScoreStore } from '../store/useScoreStore';

/**
 * Confetti explosion component for celebrations.
 */
const Confetti = () => {
  const colors = ['#a78bfa', '#34d399', '#f59e0b', '#f87171', '#60a5fa', '#f472b6'];
  const particles = Array.from({ length: 80 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 250 + 100;
        const x = Math.cos(angle) * velocity;
        const y = Math.sin(angle) * velocity - 50;
        const size = Math.random() * 8 + 4;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: x,
              y: y,
              opacity: 0,
              scale: 0,
              rotate: Math.random() * 360
            }}
            transition={{
              duration: Math.random() * 2 + 1.2,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * ResultModal Component
 * Shows a beautiful summarized report of the typing test results.
 */
const ResultModal = ({ stats, onRestart, isSaving, saveError, user }) => {
  const { netWpm, rawWpm, accuracy, errors, elapsedSeconds } = stats;
  const { history, getHistory } = useScoreStore();

  // Load history to determine if it is a personal best
  useEffect(() => {
    if (user && history.length === 0) {
      getHistory();
    }
  }, [user, history.length, getHistory]);

  const isNewPersonalBest = user && history.length > 0 && netWpm > Math.max(...history.map(h => h.netWpm), 0);
  const shouldCelebrate = netWpm >= 75 || isNewPersonalBest;

  // Determine encouragement message based on netWpm
  let title = "Speedy Keystrokes!";
  let subtitle = "Great effort! Keep practicing to push your limits further.";
  let tierBadge = "Adept";
  let tierColor = "text-sky-400 bg-sky-950/40 border border-sky-500/20";

  if (netWpm >= 80) {
    title = "Mythical Typist!";
    subtitle = "Incredible speed! You are typing at an elite professional level!";
    tierBadge = "Legendary";
    tierColor = "text-purple-400 bg-purple-950/40 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]";
  } else if (netWpm >= 55) {
    title = "Fluid Velocity!";
    subtitle = "Excellent work! Your fingers are flying across the keyboard.";
    tierBadge = "Professional";
    tierColor = "text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]";
  } else if (netWpm >= 35) {
    title = "Steady Flow!";
    subtitle = "Nice typing speed! Consistency is the key to mastering accuracy.";
    tierBadge = "Intermediate";
    tierColor = "text-amber-400 bg-amber-950/40 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]";
  } else {
    tierBadge = "Novice";
    tierColor = "text-slate-400 bg-slate-950/40 border border-slate-500/20";
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
      {shouldCelebrate && <Confetti />}

      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-primary via-blue-500 to-emerald-500" />

      {isNewPersonalBest && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="absolute top-6 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-500/30 flex items-center gap-1"
        >
          <Award className="w-3.5 h-3.5 fill-current" /> New PB
        </motion.div>
      )}

      <div className="p-4 bg-primary/10 rounded-full text-primary mb-6 shadow-[0_0_20px_rgba(167,139,250,0.2)]">
        <Trophy className="w-12 h-12" />
      </div>

      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-3xl font-black gradient-text">{title}</h2>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${tierColor}`}>
          {tierBadge}
        </span>
      </div>
      <p className="text-muted-foreground text-sm max-w-md mb-8">{subtitle}</p>

      {/* Grid of Results */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mb-8">
        {/* Speed */}
        <div className="p-4 bg-white/[0.01] rounded-2xl border border-white/5 flex flex-col items-center transition-all duration-300 hover:bg-white/5 hover:border-primary/20">
          <div className="p-2 rounded-xl bg-primary/10 text-primary mb-2">
            <Zap className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono mb-1">Net WPM</p>
          <span className="text-3xl font-black text-foreground font-mono">{netWpm}</span>
        </div>

        {/* Accuracy */}
        <div className="p-4 bg-white/[0.01] rounded-2xl border border-white/5 flex flex-col items-center transition-all duration-300 hover:bg-white/5 hover:border-emerald-500/20">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mb-2">
            <Target className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono mb-1">Accuracy</p>
          <span className="text-3xl font-black text-emerald-400 font-mono">{accuracy}%</span>
        </div>

        {/* Errors */}
        <div className="p-4 bg-white/[0.01] rounded-2xl border border-white/5 flex flex-col items-center transition-all duration-300 hover:bg-white/5 hover:border-red-500/20">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-400 mb-2">
            <AlertCircle className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono mb-1">Errors</p>
          <span className="text-3xl font-black text-red-400 font-mono">{errors}</span>
        </div>

        {/* Time */}
        <div className="p-4 bg-white/[0.01] rounded-2xl border border-white/5 flex flex-col items-center transition-all duration-300 hover:bg-white/5 hover:border-amber-500/20">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 mb-2">
            <Timer className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono mb-1">Time</p>
          <span className="text-3xl font-black text-amber-400 font-mono">{elapsedSeconds}s</span>
        </div>
      </div>

      {/* Database Saving / XP Feedback */}
      {user ? (
        <div className="w-full p-6 mb-8 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm font-mono tracking-wide">LEVEL {user.level}</h4>
                <p className="text-xs text-muted-foreground">
                  You gained <span className="text-yellow-400 font-bold font-mono">+{xpGained} XP</span> this round!
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-muted-foreground">
                {user.xp % 1000} / 1000 XP
              </span>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="w-full h-3 bg-secondary/40 rounded-full overflow-hidden p-[2px] border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(user.xp % 1000) / 10}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)]"
            />
          </div>
          
          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
            <span>{1000 - (user.xp % 1000)} XP to level {user.level + 1}</span>
            {isSaving && (
              <span className="text-primary font-bold animate-pulse">Syncing...</span>
            )}
            {saveError && (
              <div className="flex items-center gap-1 text-red-400 font-bold">
                <ShieldAlert className="w-3.5 h-3.5" /> Save failed: {saveError}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full p-5 mb-8 rounded-2xl bg-primary/5 border border-primary/10 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Want to save your typing progress, view interactive analytics, and earn XP?{' '}
            <span className="text-primary font-bold hover:underline cursor-pointer">Login to your account</span> to track your speed.
          </p>
        </div>
      )}

      {/* Restart Button */}
      <button
        onClick={onRestart}
        className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 hover:shadow-primary/30 cursor-pointer"
      >
        <RefreshCw className="w-5 h-5" /> Restart Typing Test
      </button>
    </motion.div>
  );
};

export default ResultModal;
