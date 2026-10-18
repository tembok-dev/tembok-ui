// tembok/components/src/react/SideBar.tsx
import { ReactNode, useState, useEffect, useCallback, useRef } from "react";
import { Portal } from "./utils/Portal";
import { cx } from "./utils/variants";
import { useEscapeKey } from "./hooks/useEscapeKey";
import { usePortalTheme } from "./hooks/usePortalTheme";
import { useBodyScrollLock } from "./hooks/useBodyScrollLock";

type SidePosition = "left" | "right";


export interface SideBarProps {
  id?: string;
  /** Panel edge. @defaultValue 'right' */
  side?: SidePosition;
  /** Width controls via CSS vars (fallbacks in CSS) */
  width?: string;      // -> --tmbk-sidebar-w   e.g. "86vw"
  maxWidth?: string;   // -> --tmbk-sidebar-maxw e.g. "360px"

  panelClassName?: string;
  overlayClassName?: string;
  /** Display built-in Close button. */
  showClose?: boolean;
  closeAriaLabel?: string;

  /** Controlled visibility. Omit to use defaultOpen and data-sidebar-* triggers. */
  open?: boolean;
  /** Requests controlled state changes (e.g. close button/backdrop). */
  onOpenChange?: (open: boolean) => void;
  /** Initial visibility in uncontrolled mode. */
  defaultOpen?: boolean;
  closeOnLinkClick?: boolean;
  /** Whether Escape requests dismissal. */
  closeOnEscape?: boolean;
  /** Whether clicking the backdrop requests dismissal. */
  closeOnOverlayClick?: boolean;

  children?: ReactNode;
  header?: ReactNode;

  /** Per-instance theme overrides */
  bgColor?: string;     // -> --tmbk-bg
  textColor?: string;   // -> --tmbk-fg
  borderColor?: string; // -> --tmbk-border
  backdrop?: string;    // -> --tmbk-backdrop (overlay background)

  /** Add .tmbk-theme to overlay/panel if no themed ancestor exists */
  themeScoped?: boolean; // default true
}

/**
 * =========================================================
 * @example — Using <SideBar /> headless
 * =========================================================
 *
 * // Import CSS once in your app entry:
 *
 * function Example() {
 *   const [open, setOpen] = useState(false);
 *
 *   return (
 *     <>
 *       <button data-sidebar-open="mainMenu">Open Menu</button>
 *       <button data-sidebar-toggle="mainMenu">Toggle Menu</button>
 *
 *       <SideBar
 *         id="mainMenu"
 *         side="left"
 *         header={<h2>Navigation</h2>}
 *         closeOnOverlayClick
 *         closeOnEscape
 *         showClose
 *       >
 *         <nav>
 *           <a href="#home">Home</a>
 *           <a href="#projects">Projects</a>
 *           <a href="#contact">Contact</a>
 *           <hr />
 *           <button data-close-menu>Close</button>
 *         </nav>
 *       </SideBar>
 *     </>
 *   );
 * }
 *
 * // You can also control it manually:
 * <button onClick={() => setOpen(true)}>Open Menu</button>
 * <SideBar open={open} onOpenChange={setOpen} />
 *
 * // Global triggers (no React state needed):
 * <a href="#" data-sidebar-open="mainMenu">Open</a>
 * <a href="#" data-sidebar-close="mainMenu">Close</a>
 * <a href="#" data-sidebar-toggle="mainMenu">Toggle</a>
 *
 * =========================================================
 */

export function SideBar({
  id = "sidebar",
  side = "right",
  width,
  maxWidth,
  panelClassName,
  overlayClassName,
  showClose = true,
  closeAriaLabel = "Close menu",
  open,
  onOpenChange,
  defaultOpen = false,
  closeOnLinkClick = false,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  children,
  header,

  bgColor,
  textColor,
  borderColor,
  backdrop,
  themeScoped = true,
}: SideBarProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;
  const openerRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const changeOpen = useCallback((next: boolean, opener?: HTMLElement | null) => {
    if (next && !isOpen) openerRef.current = opener ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    if (open === undefined) setInternalOpen(next);
    if (next !== isOpen) onOpenChange?.(next);
  }, [open, isOpen, onOpenChange]);
  const handleClose = () => changeOpen(false);

  // Escape
  const isTopLayer = useEscapeKey(() => { if (closeOnEscape) handleClose(); }, isOpen);

  useBodyScrollLock(isOpen);
  const themeSourceRef = useRef<HTMLSpanElement>(null!);
  const sidebarRef = useRef<HTMLElement>(null!);
  const backdropRef = useRef<HTMLDivElement>(null!);
  // The Portal mounts after the parent's effects. Attach inert as soon as
  // the actual panel DOM node commits, and update it when open state changes.
  // Native attribute avoids a dependency on newer React JSX typings.
  const setSidebarPanelRef = useCallback((node: HTMLElement | null) => {
    sidebarRef.current = node!;
    if (!node) return;
    // Return focus *before* making the closed panel inert: focus cannot
    // reliably move out of an already-inert subtree in every browser.
    if (!isOpen && wasOpenRef.current) {
      const opener = openerRef.current;
      if (opener?.isConnected) opener.focus();
    }
    node.toggleAttribute('inert', !isOpen);
    if (isOpen && !wasOpenRef.current) {
      // Controlled consumers can change 'open' directly, bypassing changeOpen.
      // Capture the currently focused external element before moving focus in.
      const active = document.activeElement;
      if (active instanceof HTMLElement && !node.contains(active)) {
        openerRef.current = active;
      }
      const first = node.querySelector<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])');
      (first ?? node).focus();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);
  usePortalTheme(backdropRef, () => themeSourceRef.current, isOpen,
    [backdrop ? '--tmbk-backdrop' : ''].filter(Boolean));
  usePortalTheme(sidebarRef, () => themeSourceRef.current, isOpen,
    [bgColor ? '--tmbk-bg' : '', textColor ? '--tmbk-fg' : '', borderColor ? '--tmbk-border' : ''].filter(Boolean));

  // Global toggles via data-* attributes
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const opener = t.closest("[data-sidebar-open],[data-sidebar-close],[data-sidebar-toggle]");
      if (!(opener instanceof HTMLElement)) return;

      const openId = opener.getAttribute("data-sidebar-open");
      const closeId = opener.getAttribute("data-sidebar-close");
      const toggleId = opener.getAttribute("data-sidebar-toggle");
      const tgt = openId || closeId || toggleId;
      if (tgt !== id) return;

      if (openId) changeOpen(true, opener);
      if (closeId) changeOpen(false);
      if (toggleId) changeOpen(!isOpen, opener);

      const isHashLink = opener.tagName === "A" && opener.getAttribute("href") === "#";
      if (isHashLink) e.preventDefault();
    };

    document.addEventListener("click", onDocClick, { capture: true });
    return () => document.removeEventListener("click", onDocClick, { capture: true });
  }, [id, changeOpen, isOpen]);

  // Close on link click
  const handlePanelClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const wantsClose = target.closest("[data-close-menu]");
    if (wantsClose) return void changeOpen(false);
    if (closeOnLinkClick && target.closest("a")) changeOpen(false);
  };

  // CSS variables (per-instance)
  const vars: React.CSSProperties = {
    ...(bgColor ? { ["--tmbk-bg" as any]: bgColor } : null),
    ...(textColor ? { ["--tmbk-fg" as any]: textColor } : null),
    ...(borderColor ? { ["--tmbk-border" as any]: borderColor } : null),
    ...(backdrop ? { ["--tmbk-backdrop" as any]: backdrop } : null),
    ...(width ? { ["--tmbk-sidebar-w" as any]: width } : null),
    ...(maxWidth ? { ["--tmbk-sidebar-maxw" as any]: maxWidth } : null),
  };

  return (
    <>
    <span ref={themeSourceRef} hidden aria-hidden="true" />
    <Portal>
      {/* Overlay */}
      <div
        ref={backdropRef}
        className={cx(
          "tmbk-sidebar-overlay",
          themeScoped && "tmbk-theme",
          overlayClassName
        )}
        data-open={isOpen ? "true" : "false"}
        aria-hidden="true"
        onClick={closeOnOverlayClick ? () => { if (isTopLayer()) handleClose(); } : undefined}
        style={vars}
      />

      {/* Panel */}
      <aside
        ref={setSidebarPanelRef}
        className={cx("tmbk-sidebar", themeScoped && "tmbk-theme", panelClassName)}
        data-open={isOpen ? "true" : "false"}
        data-side={side}
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        aria-hidden={!isOpen}
        style={vars}
      >
        <div className="tmbk-sidebar-shell">
          {/* Sticky header */}
          <div className="tmbk-sidebar-header" data-side={side}>
            <div className="tmbk-sidebar-header-row">
              {header ? (
                header
              ) : (
                showClose && (
                  <button
                    onClick={handleClose}
                    aria-label={closeAriaLabel}
                    className="tmbk-sidebar-close"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Content */}
          <div className="tmbk-sidebar-content" onClick={handlePanelClick}>
            {children}
          </div>
        </div>
      </aside>
    </Portal>
    </>
  );
}
