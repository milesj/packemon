import { useCallback, useEffect, useReducer, useRef } from 'react';

export default function useRenderLoop(): () => void {
  const [, forceUpdate] = useReducer((count) => count + 1, 0);
  const timer = useRef<NodeJS.Timeout>();

  const clear = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  }, []);

  // Continuously render at 30 FPS
  useEffect(() => {
    timer.current = setInterval(forceUpdate, 1000 / 30);

    return clear;
  }, [clear]);

  return clear;
}
