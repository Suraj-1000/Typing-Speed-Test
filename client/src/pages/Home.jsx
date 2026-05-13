import React from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
          Master Your Keystrokes
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          The ultimate typing speed test with real-time multiplayer.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Start Typing
          </button>
          <button className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-colors">
            Multiplayer Race
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
