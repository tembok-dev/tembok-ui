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

/** Position a portaled surface against the visible viewport.
 * Explicit sides are preferences: flip when the opposite side fits better.
 */
export function usePosition<T extends HTMLElement = HTMLElement, P extends HTMLElement = HTMLElement, A extends HTMLElement = HTMLElement>({
  triggerRef, panelRef, arrowRef, side = 'auto', align = 'center',
  offset = 10, edgePad = 16, isOpen,
}: PositionConfig<T, P, A>) {
  useEffect(() => {
    if (!isOpen) return;

    const position = () => {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      const arrow = arrowRef?.current;
      if (!trigger || !panel) return;

      const tr = trigger.getBoundingClientRect();
      const viewport = window.visualViewport;
      const vx = viewport?.offsetLeft ?? 0;
      const vy = viewport?.offsetTop ?? 0;
      const vw = viewport?.width ?? window.innerWidth;
      const vh = viewport?.height ?? window.innerHeight;
      const right = vx + vw;
      const bottom = vy + vh;
      const width = panel.offsetWidth;
      // Reset old clamps before measuring, so a previous short viewport cannot
      // permanently force the surface to remain short.
      panel.style.maxHeight = '';
      panel.style.overflowY = '';
      const height = panel.scrollHeight;
      const below = Math.max(0, bottom - edgePad - tr.bottom - offset);
      const above = Math.max(0, tr.top - offset - vy - edgePad);
      const preferred = side === 'auto' ? 'down' : side;
      const preferredRoom = preferred === 'down' ? below : above;
      const oppositeRoom = preferred === 'down' ? above : below;
      const resolved: 'down' | 'up' =
        preferredRoom < height && oppositeRoom > preferredRoom
          ? (preferred === 'down' ? 'up' : 'down')
          : preferred;
      const available = resolved === 'down' ? below : above;
      const panelHeight = Math.min(height, available);
      if (panelHeight < height) {
        panel.style.maxHeight = `${Math.floor(panelHeight)}px`;
        panel.style.overflowY = 'auto';
      }

      const centered = tr.left + tr.width / 2;
      const proposedLeft = align === 'start' ? tr.left
        : align === 'end' ? tr.right - width
        : centered - width / 2;
      const left = Math.max(vx + edgePad, Math.min(proposedLeft, right - edgePad - width));
      const proposedTop = resolved === 'down' ? tr.bottom + offset : tr.top - offset - panelHeight;
      const top = Math.max(vy + edgePad, Math.min(proposedTop, bottom - edgePad - panelHeight));
      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
      panel.setAttribute('data-side', resolved);

      if (arrow) {
        const size = 12;
        const arrowX = Math.max(8, Math.min(width - size - 8, centered - left - size / 2));
        arrow.style.left = `${arrowX}px`;
        if (resolved === 'down') {
          arrow.style.top = `-${size / 2}px`;
          arrow.style.bottom = '';
          arrow.style.transform = 'rotate(45deg)';
        } else {
          arrow.style.bottom = `-${size / 2}px`;
          arrow.style.top = '';
          arrow.style.transform = 'rotate(225deg)';
        }
      }
    };
    let rafId = requestAnimationFrame(() => { rafId = requestAnimationFrame(position); });
    window.addEventListener('resize', position, { passive: true });
    // Capture also receives scroll events from nested scroll containers.
    document.addEventListener('scroll', position, true);
    window.visualViewport?.addEventListener('resize', position);
    window.visualViewport?.addEventListener('scroll', position);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', position);
      document.removeEventListener('scroll', position, true);
      window.visualViewport?.removeEventListener('resize', position);
      window.visualViewport?.removeEventListener('scroll', position);
    };
  }, [triggerRef, panelRef, arrowRef, side, align, offset, edgePad, isOpen]);
}
