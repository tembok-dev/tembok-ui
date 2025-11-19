// tembok/components/src/react/Popover.tsx (headless)
import {
  ReactNode,
  useRef,
  useState,
  useCallback,
  cloneElement,
  ReactElement,
  RefObject,
  useEffect,
} from "react";
import { cx } from "./utils/variants";
import { usePosition, Side, Align } from "./hooks/usePosition";
import { useEscapeKey } from "./hooks/useEscapeKey";
import { createPortal } from "react-dom";

type OpenMode = "click" | "hover";

/**
 * Headless Popover — attach a floating panel to any trigger element.
 *
 * • Works with click or hover (`openOn="click" | "hover"`).  
 * • Auto-positions with arrow + collision handling.  
 * • Closes on outside click, Escape, or selecting an item (unless `data-close-popover="false"`).  
 * • You control all styling via `panelClassName` + your CSS.
 *
 * Example:
 * ```tsx
 * <Popover
 *   trigger={<button>Options</button>}
 *   side="bottom"
 *   align="start"
 *   panelClassName="rounded-md border bg-bg p-2"
 * >
 *   <button className="block px-2 py-1">Edit</button>
 *   <button className="block px-2 py-1">Delete</button>
 * </Popover>
 * ```
 */

export interface PopoverProps {
  trigger: ReactElement;
  children: ReactNode;
  openOn?: OpenMode;
  side?: Side;
  align?: Align;
  offset?: number;
  edgePad?: number;
  /** Extra class for the panel (keep it headless) */
  panelClassName?: string;
  closeOnSelect?: boolean;
  role?: "dialog" | "menu" | "listbox" | "tree" | "grid";

  /** Optional theme overrides (wired to CSS variables) */
  bgColor?: string;     // maps to --tmbk-bg
  textColor?: string;   // maps to --tmbk-fg
  borderColor?: string; // maps to --tmbk-border

  /** Optional: add/remove the theme scope class here if you prefer local scoping */
  themeScoped?: boolean; // default true: adds "tmbk-theme" on the panel

  /** Optional: override z-index for this popover panel */
  zIndex?: number;
}

export function Popover({
  trigger,
  children,
  openOn = "click",
  side = "auto",
  align = "center",
  offset = 10,
  edgePad = 16,
  panelClassName,
  closeOnSelect = true,
  role = "dialog",
  bgColor,
  textColor,
  borderColor,
  themeScoped = true,
  zIndex,
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null!);
  const panelRef = useRef<HTMLDivElement>(null!);
  const arrowRef = useRef<HTMLDivElement>(null!);
  const hoverTimeoutRef = useRef<{
    enter?: ReturnType<typeof setTimeout>;
    leave?: ReturnType<typeof setTimeout>;
  }>({});

  const handleClose = useCallback(() => setIsOpen(false), []);

  // Positioning engine (kept as-is)
  usePosition({ triggerRef, panelRef, arrowRef, side, align, offset, edgePad, isOpen });

  // Local click-outside (click-mode only)
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
        const clickedInIgnored = extraIgnoreRefs.some(
          (r) => r.current && r.current.contains(target)
        );
        if (!clickedInPanel && !clickedInIgnored) handler();
      };

      document.addEventListener("pointerdown", onPointerDown, { capture: true });
      return () => document.removeEventListener("pointerdown", onPointerDown, { capture: true });
    }, [ref, handler, active, extraIgnoreRefs]);
  }

  useEscapeKey(handleClose, isOpen);
  useClickOutside(panelRef, handleClose, isOpen && openOn === "click", [triggerRef]);

  // Trigger handlers
  const handleTriggerClick = (e: React.MouseEvent) => {
    if (openOn !== "click") return;
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleMouseEnter = () => {
    if (openOn === "hover") {
      clearTimeout(hoverTimeoutRef.current.leave);
      hoverTimeoutRef.current.enter = setTimeout(() => setIsOpen(true), 80);
    }
  };

  const handleMouseLeave = () => {
    if (openOn === "hover") {
      clearTimeout(hoverTimeoutRef.current.enter);
      hoverTimeoutRef.current.leave = setTimeout(() => setIsOpen(false), 120);
    }
  };

  const handlePanelClick = (e: React.MouseEvent) => {
    if (!closeOnSelect) return;
    const target = e.target as HTMLElement;
    const clickable = target.closest('a, button, [role="menuitem"]');
    if (clickable) {
      const dataAttr = clickable.getAttribute("data-close-popover");
      if (dataAttr !== "false") setIsOpen(false);
    }
  };

  // Clone trigger with events and ARIA
  const triggerId = useRef(`tmbk-popover-trigger-${Math.random().toString(36).slice(2)}`).current;
  const panelId = useRef(`tmbk-popover-panel-${Math.random().toString(36).slice(2)}`).current;

  const triggerElement = cloneElement(trigger, {
    onClick: handleTriggerClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    "aria-haspopup": role,
    "aria-expanded": isOpen,
    "aria-controls": panelId,
    id: triggerId,
  } as any);

  // CSS variable overrides to avoid style bleeding
  const variableOverrides: React.CSSProperties = {
    ...(bgColor ? { ["--tmbk-bg" as any]: bgColor } : null),
    ...(textColor ? { ["--tmbk-fg" as any]: textColor } : null),
    ...(borderColor ? { ["--tmbk-border" as any]: borderColor } : null),
    ...(zIndex != null ? { zIndex } : null),
  };

  const panel = (
    <div
      ref={panelRef}
      id={panelId}
      role={role}
      aria-labelledby={triggerId}
      className={cx(
        "tmbk-popover",
        themeScoped && "tmbk-theme",
        panelClassName
      )}
      data-open={isOpen ? "true" : "false"}
      data-side={side}
      data-align={align}
      // Keep it headless: style only sets CSS vars when provided
      style={variableOverrides}
      onClick={handlePanelClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={arrowRef} className="tmbk-popover-arrow" />
      {children}
    </div>
  );

  return (
    <div className="tmbk-popover-root">
      <span ref={triggerRef} className="tmbk-popover-trigger">
        {triggerElement}
      </span>
      {typeof window !== "undefined" ? createPortal(panel, document.body) : null}
    </div>
  );
}
