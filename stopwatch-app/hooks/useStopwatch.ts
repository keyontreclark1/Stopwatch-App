import { useState, useEffect, useCallback, useRef } from 'react';

interface LapTime {
  id: number;
  time: number;
  lapNumber: number;
}

interface UseStopwatchReturn {
  elapsedTime: number;
  isRunning: boolean;
  laps: LapTime[];
  start: () => void;
  stop: () => void;
  reset: () => void;
  lap: () => void;
  formattedTime: {
    hours: string;
    minutes: string;
    seconds: string;
    milliseconds: string;
  };
}

export function useStopwatch(): UseStopwatchReturn {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<LapTime[]>([]);
  
  const startTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const lapCounterRef = useRef<number>(0);

  const formatTime = useCallback((time: number) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      milliseconds: milliseconds.toString().padStart(2, '0'),
    };
  }, []);

  const updateTime = useCallback(() => {
    if (isRunning && startTimeRef.current > 0) {
      const currentTime = Date.now();
      const newElapsedTime = elapsedTimeRef.current + (currentTime - startTimeRef.current);
      setElapsedTime(newElapsedTime);
      elapsedTimeRef.current = newElapsedTime;
      startTimeRef.current = currentTime;
      animationFrameRef.current = requestAnimationFrame(updateTime);
    }
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(updateTime);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, updateTime]);

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
    }
  }, [isRunning]);

  const stop = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsedTime(0);
    elapsedTimeRef.current = 0;
    startTimeRef.current = 0;
    lapCounterRef.current = 0;
    setLaps([]);
  }, []);

  const lap = useCallback(() => {
    if (isRunning) {
      lapCounterRef.current += 1;
      const newLap: LapTime = {
        id: Date.now(),
        time: elapsedTime,
        lapNumber: lapCounterRef.current,
      };
      setLaps((prevLaps) => [newLap, ...prevLaps]);
    }
  }, [isRunning, elapsedTime]);

  return {
    elapsedTime,
    isRunning,
    laps,
    start,
    stop,
    reset,
    lap,
    formattedTime: formatTime(elapsedTime),
  };
}

