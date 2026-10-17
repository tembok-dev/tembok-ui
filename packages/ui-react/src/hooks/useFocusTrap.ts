import { useEffect, RefObject } from 'react';

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Trap keyboard navigation and restore focus to the opening control. */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  containerRef: RefObject<T>, isActive: boolean, ownsKeyboard?: () => boolean
) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    const container = containerRef.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusables = () => Array.from(container.querySelectorAll<HTMLElement>(focusableSelector))
      .filter(el => !el.hidden && !el.closest('[hidden], [inert], [aria-hidden="true"]') &&
        el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden');
    const initial = container.querySelector<HTMLElement>('[autofocus]') ??
      focusables()[0] ?? container;
    initial.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || event.defaultPrevented || (ownsKeyboard && !ownsKeyboard())) return;
      const items = focusables();
      const active = document.activeElement;
      if (!items.length) {
        event.preventDefault();
        container.focus();
        return;
      }
      const first = items[0], last = items[items.length - 1];
      if (!container.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && (active === first || active === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || active === container)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      if (previous?.isConnected) previous.focus();
    };
  }, [containerRef, isActive, ownsKeyboard]);
}
