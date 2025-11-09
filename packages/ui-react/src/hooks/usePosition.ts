// usePosition.ts
// Reusable Hook
import { useEffect, RefObject } from 'react';

export type Side = 'auto' | 'down' | 'up';
export type Align = 'start' | 'center' | 'end';

interface PositionConfig<T extends HTMLElement = HTMLElement, P extends HTMLElement = HTMLElement, A extends HTMLElement = HTMLElement> {
  triggerRef: RefObject<T>;
  panelRef: RefObject<P>;
  arrowRef?: RefObject<A>;
  side?: Side;
  align?: Align;
  offset?: number;
  edgePad?: number;
  isOpen: boolean;
}

/**
 * Custom hook to calculate and update popover positioning
 * Handles viewport edge detection, auto-flipping, and arrow positioning
 * Used by Popover component for intelligent positioning
 */
export function usePosition<T extends HTMLElement = HTMLElement, P extends HTMLElement = HTMLElement, A extends HTMLElement = HTMLElement>({
  triggerRef,
  panelRef,
  arrowRef,
  side = 'auto',
  align = 'center',
  offset = 10,
  edgePad = 16,
  isOpen,
}: PositionConfig<T, P, A>) {
  useEffect(() => {
    if (!isOpen || !triggerRef.current || !panelRef.current) return;

    const position = () => {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      const arrow = arrowRef?.current;

      if (!trigger || !panel) return;

      const tr = trigger.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = panel.offsetWidth;
      const contentH = panel.scrollHeight;

      // Determine vertical side
      const spaceBelow = vh - tr.bottom - edgePad;
      const spaceAbove = tr.top - edgePad;

      let finalSide: 'down' | 'up' = 'down';
      if (side === 'up') finalSide = 'up';
      else if (side === 'down') finalSide = 'down';
      else finalSide = spaceBelow < contentH && spaceAbove > spaceBelow ? 'up' : 'down';

      const allowed = finalSide === 'down'
        ? Math.max(0, vh - edgePad - (tr.bottom + offset))
        : Math.max(0, (tr.top - offset) - edgePad);

      const finalH = Math.min(contentH, allowed);
      panel.style.maxHeight = finalH < contentH ? `${Math.floor(finalH)}px` : '';
      panel.style.overflowY = finalH < contentH ? 'auto' : '';

      // Calculate position based on trigger position (fixed positioning uses viewport coords)
      let top = finalSide === 'down' 
        ? tr.bottom + offset 
        : tr.top - offset - finalH;
      
      let leftCenter = tr.left + tr.width / 2;

      let left = align === 'start' ? tr.left
               : align === 'end' ? tr.right - w
               : leftCenter - w / 2;

      // Clamp to viewport edges
      left = Math.max(edgePad, Math.min(left, vw - edgePad - w));
      top = Math.max(edgePad, Math.min(top, vh - edgePad - finalH));

      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
      panel.setAttribute('data-side', finalSide);

      // Position arrow if provided
      if (arrow) {
        const arrowSize = 12;
        const midX = tr.left + tr.width / 2;
        const arrowX = Math.max(8, Math.min(w - 8 - arrowSize, midX - left - arrowSize / 2));
        arrow.style.left = `${arrowX}px`;

        if (finalSide === 'down') {
          arrow.style.top = `-${arrowSize / 2}px`;
          arrow.style.bottom = '';
          arrow.style.transform = 'rotate(45deg)';
        } else {
          arrow.style.bottom = `-${arrowSize / 2}px`;
          arrow.style.top = '';
          arrow.style.transform = 'rotate(225deg)';
        }
      }
    };

    // Position on open - use RAF to ensure layout is complete
    let rafId: number;
    rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(position);
    });

    window.addEventListener('resize', position, { passive: true });
    window.addEventListener('scroll', position, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', position);
      window.removeEventListener('scroll', position);
    };
  }, [triggerRef, panelRef, arrowRef, side, align, offset, edgePad, isOpen]);
}
