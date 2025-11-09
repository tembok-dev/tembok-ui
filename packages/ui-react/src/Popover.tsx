// tembok/components/src/react/Popover.tsx

import { ReactNode, useRef, useState, useCallback, cloneElement, ReactElement, RefObject, useEffect } from 'react';
import { cx } from './utils/variants';
import { usePosition, Side, Align } from './hooks/usePosition';
import { useEscapeKey } from './hooks/useEscapeKey';
import { createPortal } from 'react-dom';

type OpenMode = 'click' | 'hover';

interface PopoverProps {
  trigger: ReactElement;
  children: ReactNode;
  openOn?: OpenMode;
  side?: Side;
  align?: Align;
  offset?: number;
  edgePad?: number;
  panelClassName?: string;
  closeOnSelect?: boolean;
  role?: 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid';

  /** Optional theme overrides (inline styles beat Tailwind defaults) */
  bgColor?: string;     // e.g. "white" or "#0f172aE6"
  textColor?: string;   // e.g. "#0a0a0a"
  borderColor?: string; // e.g. "#e5e7eb"
}

export function Popover({
  trigger,
  children,
  openOn = 'click',
  side = 'auto',
  align = 'center',
  offset = 10,
  edgePad = 16,
  panelClassName,
  closeOnSelect = true,
  role = 'dialog',
  bgColor,
  textColor,
  borderColor,
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null!);
  const panelRef = useRef<HTMLDivElement>(null!);
  const arrowRef = useRef<HTMLDivElement>(null!);
  const hoverTimeoutRef = useRef<{ enter?: ReturnType<typeof setTimeout>; leave?: ReturnType<typeof setTimeout> }>({});

  const handleClose = useCallback(() => setIsOpen(false), []);

  // Position calculation
  usePosition({ triggerRef, panelRef, arrowRef, side, align, offset, edgePad, isOpen });

  // Local click outside (click-mode only)
  function useClickOutside(
    ref: RefObject<HTMLElement>,
    handler: () => void,
    active = true,
    extraIgnoreRefs: RefObject<HTMLElement>[] = []
  ) {
    useEffect(() => {
      if (!active) return;

      const onPointerDown = (event: PointerEvent) => {
        const panel = ref.current;
        if (!panel) return;

        const target = event.target as Node | null;
        const clickedInPanel = panel.contains(target);
        const clickedInIgnored = extraIgnoreRefs.some((r) => r.current && r.current.contains(target));
        if (!clickedInPanel && !clickedInIgnored) handler();
      };

      document.addEventListener('pointerdown', onPointerDown, { capture: true });
      return () => document.removeEventListener('pointerdown', onPointerDown, { capture: true });
    }, [ref, handler, active, extraIgnoreRefs]);
  }

  useEscapeKey(handleClose, isOpen);
  useClickOutside(panelRef, handleClose, isOpen && openOn === 'click', [triggerRef]);

  // Trigger handlers
  const handleTriggerClick = (e: React.MouseEvent) => {
    if (openOn !== 'click') return;
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleMouseEnter = () => {
    if (openOn === 'hover') {
      clearTimeout(hoverTimeoutRef.current.leave);
      hoverTimeoutRef.current.enter = setTimeout(() => setIsOpen(true), 80);
    }
  };

  const handleMouseLeave = () => {
    if (openOn === 'hover') {
      clearTimeout(hoverTimeoutRef.current.enter);
      hoverTimeoutRef.current.leave = setTimeout(() => setIsOpen(false), 120);
    }
  };

  const handlePanelClick = (e: React.MouseEvent) => {
    if (!closeOnSelect) return;
    const target = e.target as HTMLElement;
    const clickable = target.closest('a, button, [role="menuitem"]');
    if (clickable) {
      const dataAttr = clickable.getAttribute('data-close-popover');
      if (dataAttr !== 'false') setIsOpen(false);
    }
  };

  // Clone trigger with events
  const triggerElement = cloneElement(trigger, {
    onClick: handleTriggerClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': isOpen,
  } as any);

  // Inline styles only when dev passes an override; undefined = keep current dark defaults
  const panelInlineStyle: React.CSSProperties = {
    ...(bgColor ? { backgroundColor: bgColor } : null),
    ...(textColor ? { color: textColor } : null),
    ...(borderColor ? { borderColor } : null),
    transformOrigin: side === 'up' ? 'bottom center' : 'top center',
  };

  const arrowInlineStyle: React.CSSProperties = {
    ...(bgColor ? { backgroundColor: bgColor } : null),
    ...(borderColor ? { borderColor } : null),
    transform: 'rotate(45deg)',
  };

  const panel = (
    <div
      ref={panelRef}
      role={role}
      className={cx(
        'fixed z-[2147483600] select-none',
        // Defaults (dark) remain; inline styles override when provided:
        'rounded-lg border border-border bg-bg/80 backdrop-blur-md',
        'shadow-elevation-high p-4',
        'w-max max-w-[min(90vw,42rem)]',
        'origin-top transition-[opacity,transform] duration-150',
        'overscroll-contain',
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
        panelClassName
      )}
      style={panelInlineStyle}
      onClick={handlePanelClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Arrow inherits same bg/border overrides */}
      <div
        ref={arrowRef}
        className="absolute h-3 w-3 bg-bg border border-border border-b-0 border-r-0"
        style={arrowInlineStyle}
      />
      {children}
    </div>
  );

  return (
    <div className="relative inline-block">
      <span ref={triggerRef} className="inline-flex">
        {triggerElement}
      </span>
      {typeof window !== 'undefined' ? createPortal(panel, document.body) : null}
    </div>
  );
}
