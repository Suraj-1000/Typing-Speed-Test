import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook to generate synthesized typing sound effects using the Web Audio API.
 * Eliminates dependencies on external static MP3 files.
 */
export const useSoundEffects = () => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('typo-sound-enabled') !== 'false';
  });

  const audioCtxRef = useRef(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume context if suspended (browser security autoplays rules)
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playClick = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Rapid decay to simulate a sharp mechanical key click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.04);

      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.warn("Audio Context blocked or unsupported:", e);
    }
  }, [soundEnabled]);

  const playError = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Low pitch grating saw/triangle buzz
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, ctx.currentTime);

      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.16);
    } catch (e) {
      console.warn("Audio Context blocked or unsupported:", e);
    }
  }, [soundEnabled]);

  const playSuccess = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      const playNote = (freq, delay, duration, vol = 0.1) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + delay);
        
        gainNode.gain.setValueAtTime(vol, now + delay);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
        
        osc.start(now + delay);
        osc.stop(now + delay + duration + 0.01);
      };

      // Play a happy arpeggio: C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz)
      playNote(523.25, 0, 0.15);
      playNote(659.25, 0.1, 0.15);
      playNote(783.99, 0.2, 0.3, 0.12);
    } catch (e) {
      console.warn("Audio Context blocked or unsupported:", e);
    }
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('typo-sound-enabled', String(next));
      return next;
    });
  }, []);

  return { soundEnabled, playClick, playError, playSuccess, toggleSound };
};
