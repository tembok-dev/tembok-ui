import { useEffect } from 'react';

let locks = 0;
let previousOverflow = '';

/** Coordinate body scroll locking across simultaneously mounted overlays. */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    if (locks === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    locks += 1;
    return () => {
      locks -= 1;
      if (locks === 0) {
        document.body.style.overflow = previousOverflow;
        previousOverflow = '';
      }
    };
  }, [active]);
}
