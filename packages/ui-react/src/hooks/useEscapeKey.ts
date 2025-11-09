import { useEffect } from 'react';

/**
 * Custom hook to handle Escape key press
 * Used by Modal, Popover, and SideBar for keyboard accessibility
 */
export function useEscapeKey(
  handler: (event: KeyboardEvent) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handler(event);
      }
    };

    document.addEventListener('keydown', listener, true);

    return () => {
      document.removeEventListener('keydown', listener, true);
    };
  }, [handler, enabled]);
}
