import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, ShieldAlert, Star, Award } from 'lucide-react';

/**
 * LevelUpModal Component
 * Prominent animated modal overlay that celebrates when the user levels up.
 */
const LevelUpModal = ({ isOpen, oldLevel, newLevel, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/85 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="w-full max-w-md p-8 rounded-3xl bg-card border border-primary/20 relative overflow-hidden flex flex-col items-center text-center shadow-2xl shadow-primary/10 select-none z-10"
          >
            {/* Glowing lights behind */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none" />

            {/* Sparkles / Confetti particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-yellow-400"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0, 1.2, 0],
                    opacity: [0, 0.8, 0],
                    y: [0, -30 - Math.random() * 40],
                  }}
                  transition={{
                    duration: 1.5 + Math.random() * 1.5,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Giant Scaling Star */}
            <motion.div
              initial={{ scale: 0.5, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.1, damping: 10 }}
              className="p-5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.2)] mb-6 relative"
            >
              <Star className="w-16 h-16 fill-current animate-pulse" />
              <motion.div
                className="absolute inset-0 rounded-full border border-yellow-400/40"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Title / Congrats */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" /> Progression Milestone
            </div>
            
            <h2 className="text-3xl font-black gradient-text tracking-tight mb-2">
              LEVEL UP!
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              Incredible pace! Your keyboard velocity is paying off.
            </p>

            {/* Level Comparison */}
            <div className="flex items-center justify-center gap-6 w-full mb-8 bg-white/[0.01] border border-white/5 py-4 px-6 rounded-2xl">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono tracking-wider">Level</span>
                <span className="text-3xl font-bold font-mono text-muted-foreground">{oldLevel}</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono tracking-wider">New Level</span>
                <span className="text-4xl font-black font-mono text-yellow-400 flex items-center gap-1">
                  {newLevel} <Award className="w-6 h-6 fill-current animate-bounce" />
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-extrabold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:opacity-95 active:scale-[0.98] cursor-pointer"
            >
              Awesome, Keep Typing!
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpModal;
