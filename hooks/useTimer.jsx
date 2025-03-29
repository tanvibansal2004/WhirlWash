import { useState, useEffect } from 'react';

/**
 * Custom hook for creating a countdown timer
 * @param {number} initialSeconds - Initial seconds for countdown
 * @param {boolean} isActive - Whether the timer should be active
 * @returns {number} Current seconds remaining
 */
const useTimer = (initialSeconds, isActive) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    // Update when initial seconds change
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    let intervalId;

    if (isActive && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          // Decrement seconds and stop at 0
          return Math.max(0, prevSeconds - 1);
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, seconds]);

  return seconds;
};

export default useTimer;