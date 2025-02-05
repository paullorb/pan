// useSwipeNavigation.ts
import { useRef } from 'react';

interface UseSwipeReturn {
  onWheel: (e: React.WheelEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

/**
 * A custom hook to handle swipe navigation.
 *
 * @param threshold - The scroll/touch threshold to trigger navigation.
 * @param currentAccum - The current accumulated value.
 * @param setAccum - Function to update the accumulation.
 * @param onPrev - Function to call when navigating to the previous item.
 * @param onNext - Function to call when navigating to the next item.
 * @returns An object containing onWheel, onTouchStart, onTouchMove, and onTouchEnd handlers.
 */
export const useSwipeNavigation = (
  threshold: number,
  currentAccum: number,
  setAccum: (accum: number) => void,
  onPrev: () => void,
  onNext: () => void
): UseSwipeReturn => {
  const touchStartRef = useRef<number | null>(null);

  const onWheel = (e: React.WheelEvent) => {
    const newAccum = currentAccum + e.deltaX;
    if (newAccum > threshold) {
      onNext();
      setAccum(newAccum - threshold);
    } else if (newAccum < -threshold) {
      onPrev();
      setAccum(newAccum + threshold);
    } else {
      setAccum(newAccum);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartRef.current !== null) {
      const delta = touchStartRef.current - e.touches[0].clientX;
      const newAccum = currentAccum + delta;
      if (newAccum > threshold) {
        onNext();
        setAccum(newAccum - threshold);
        touchStartRef.current = e.touches[0].clientX;
      } else if (newAccum < -threshold) {
        onPrev();
        setAccum(newAccum + threshold);
        touchStartRef.current = e.touches[0].clientX;
      } else {
        setAccum(newAccum);
        touchStartRef.current = e.touches[0].clientX;
      }
    }
  };

  const onTouchEnd = () => {
    touchStartRef.current = null;
    setAccum(0);
  };

  return { onWheel, onTouchStart, onTouchMove, onTouchEnd };
};
