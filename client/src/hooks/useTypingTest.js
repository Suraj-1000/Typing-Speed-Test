import { useState, useEffect, useCallback, useRef } from 'react';

const PARAGRAPHS = [
  "The quick brown fox jumps over the lazy dog. A typing speed test is a great way to measure how fast and accurately you can type. Practice regularly to improve your writing and productivity.",
  "Programming is the art of telling another human what one wants the computer to do. Code should be clean, readable, and well-tested. A great developer writes code for humans first.",
  "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.",
  "Version control with Git allows teams to collaborate seamlessly. By using branches, developers can work on features independently, review changes via pull requests, and keep a clean history.",
  "JavaScript is a high-level, single-threaded, garbage-collected, interpreted or just-in-time compiled language with first-class functions. It is the language of the web and beyond.",
  "Modern web applications require premium designs and smooth micro-animations. Vibrant colors, clean typography, and responsive layouts combine to create unforgettable digital experiences."
];

export const useTypingTest = (durationLimit = 30, { onKeypress, onError, onSuccess } = {}) => {
  const callbacksRef = useRef({ onKeypress, onError, onSuccess });
  useEffect(() => {
    callbacksRef.current = { onKeypress, onError, onSuccess };
  }, [onKeypress, onError, onSuccess]);

  const [paragraph, setParagraph] = useState('');
  const [typedText, setTypedText] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(durationLimit);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [errors, setErrors] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);

  const timerRef = useRef(null);

  // Initialize/Reset test
  const resetTest = useCallback(() => {
    const randomIdx = Math.floor(Math.random() * PARAGRAPHS.length);
    setParagraph(PARAGRAPHS[randomIdx]);
    setTypedText('');
    setTimeRemaining(durationLimit);
    setIsActive(false);
    setIsFinished(false);
    setErrors(0);
    setTotalTyped(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [durationLimit]);

  useEffect(() => {
    resetTest();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTest]);

  // Timer logic
  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsFinished(true);
            if (timerRef.current) clearInterval(timerRef.current);
            if (callbacksRef.current.onSuccess) callbacksRef.current.onSuccess();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeRemaining]);

  // Calculate live stats
  const getStats = useCallback(() => {
    const elapsedSeconds = durationLimit - timeRemaining;
    const elapsedTimeMin = elapsedSeconds > 0 ? elapsedSeconds / 60 : 0.01;

    let correctChars = 0;
    const typedArr = typedText.split('');

    typedArr.forEach((char, idx) => {
      if (char === paragraph[idx]) {
        correctChars++;
      }
    });

    const rawWpm = Math.round((totalTyped / 5) / elapsedTimeMin);
    const netWpm = Math.round((correctChars / 5) / elapsedTimeMin);
    const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;

    return {
      rawWpm: Math.max(0, rawWpm),
      netWpm: Math.max(0, netWpm),
      accuracy,
      errors,
      elapsedSeconds
    };
  }, [typedText, paragraph, totalTyped, errors, durationLimit, timeRemaining]);

  // Key press handler
  const handleKeyDown = useCallback((e) => {
    if (isFinished) return;

    // Start on first key press
    if (!isActive && !isFinished && e.key.length === 1) {
      setIsActive(true);
    }

    if (e.key === 'Backspace') {
      setTypedText((prev) => prev.slice(0, -1));
      if (callbacksRef.current.onKeypress) callbacksRef.current.onKeypress();
    } else if (e.key.length === 1 && typedText.length < paragraph.length) {
      const nextChar = e.key;
      const expectedChar = paragraph[typedText.length];

      setTypedText((prev) => prev + nextChar);
      setTotalTyped((prev) => prev + 1);

      if (nextChar !== expectedChar) {
        setErrors((prev) => prev + 1);
        if (callbacksRef.current.onError) callbacksRef.current.onError();
      } else {
        if (callbacksRef.current.onKeypress) callbacksRef.current.onKeypress();
      }

      // Finish test if full paragraph is typed
      if (typedText.length + 1 === paragraph.length) {
        setIsActive(false);
        setIsFinished(true);
        if (callbacksRef.current.onSuccess) callbacksRef.current.onSuccess();
      }
    }
  }, [isActive, isFinished, typedText, paragraph]);

  return {
    paragraph,
    typedText,
    timeRemaining,
    isActive,
    isFinished,
    errors,
    resetTest,
    handleKeyDown,
    getStats
  };
};
