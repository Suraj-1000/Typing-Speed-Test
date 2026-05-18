import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useScoreStore } from '../store/useScoreStore';
import { useTypingTest } from '../hooks/useTypingTest';
import TypingDisplay from '../components/TypingDisplay';
import StatsPanel from '../components/StatsPanel';
import ResultModal from '../components/ResultModal';
import HistoryPanel from '../components/HistoryPanel';
import { Keyboard, Flame } from 'lucide-react';

/**
 * Home Page Component
 * Main playground for the typing speed test.
 */
const Home = () => {
  const { user } = useAuthStore();
  const { saveScore } = useScoreStore();
  const [duration, setDuration] = useState(30);

  const {
    paragraph,
    typedText,
    timeRemaining,
    isActive,
    isFinished,
    errors,
    resetTest,
    handleKeyDown,
    getStats
  } = useTypingTest(duration);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Restart the test when duration changes
  useEffect(() => {
    resetTest();
  }, [duration, resetTest]);

  // When test finishes, automatically save score if user is logged in
  useEffect(() => {
    if (isFinished) {
      const stats = getStats();
      if (user) {
        setIsSaving(true);
        setSaveError(null);
        saveScore({
          mode: 'time',
          duration,
          rawWpm: stats.rawWpm,
          netWpm: stats.netWpm,
          accuracy: stats.accuracy,
          errors: stats.errors
        })
          .catch((err) => setSaveError(err))
          .finally(() => setIsSaving(false));
      }
    }
  }, [isFinished, user, getStats, duration, saveScore]);

  const liveStats = getStats();

  return (
    <div className="flex flex-col gap-8 py-6 max-w-4xl mx-auto w-full">
      {/* Title / Hero */}
      {!isActive && !isFinished && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center flex flex-col items-center gap-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20 mb-2">
            <Flame className="w-4 h-4 text-primary animate-bounce" /> Speed Test Playground
          </div>
          <h2 className="text-4xl md:text-5xl font-black gradient-text">
            Test Your Typing Velocity
          </h2>
          <p className="text-muted-foreground text-sm max-w-md">
            Unleash your full potential, track your performance over time, and climb the ranks of elite typists.
          </p>
        </motion.div>
      )}

      {/* Main Play Area */}
      {!isFinished ? (
        <div className="flex flex-col gap-6">
          {/* Duration Selector */}
          {!isActive && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center gap-3 items-center"
            >
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider font-mono">Time Limit:</span>
              {[15, 30, 60].map((time) => (
                <button
                  key={time}
                  onClick={() => setDuration(time)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                    duration === time
                      ? 'bg-primary/20 text-primary border-primary/50'
                      : 'bg-secondary/40 text-muted-foreground border-transparent hover:border-white/10'
                  }`}
                >
                  {time}s
                </button>
              ))}
            </motion.div>
          )}

          {/* Stats Bar */}
          <StatsPanel
            wpm={liveStats.netWpm}
            accuracy={liveStats.accuracy}
            timeRemaining={timeRemaining}
            errors={errors}
            isActive={isActive}
          />

          {/* Core Display Box */}
          <TypingDisplay
            paragraph={paragraph}
            typedText={typedText}
            isActive={isActive}
            isFinished={isFinished}
            onKeyDown={handleKeyDown}
          />
        </div>
      ) : (
        /* Result Screen */
        <div className="flex justify-center py-4">
          <ResultModal
            stats={liveStats}
            onRestart={resetTest}
            isSaving={isSaving}
            saveError={saveError}
            user={user}
          />
        </div>
      )}

      {/* Typing Instructions */}
      {!isActive && !isFinished && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-white/5 bg-white/[0.01] max-w-lg mx-auto"
        >
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-muted-foreground">
            <Keyboard className="w-4 h-4 text-primary" />
            <span>Click inside the typing box and start typing to begin the test automatically.</span>
          </div>
        </motion.div>
      )}

      {/* History and Stats for Authenticated Users */}
      {user && !isActive && !isFinished && (
        <HistoryPanel />
      )}
    </div>
  );
};

export default Home;
