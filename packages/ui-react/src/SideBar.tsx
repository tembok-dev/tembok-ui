// tembok/components/src/react/SideBar.tsx
import { ReactNode, useState, useEffect, useRef } from "react";
import { Portal } from "./utils/Portal";
import { cx } from "./utils/variants";
import { useEscapeKey } from "./hooks/useEscapeKey";

type SidePosition = "left" | "right";


export interface SideBarProps {
  id?: string;
  side?: SidePosition;
  /** Width controls via CSS vars (fallbacks in CSS) */
  width?: string;      // -> --tmbk-sidebar-w   e.g. "86vw"
  maxWidth?: string;   // -> --tmbk-sidebar-maxw e.g. "360px"

  panelClassName?: string;
  overlayClassName?: string;
  showClose?: boolean;
  closeAriaLabel?: string;

  defaultOpen?: boolean;
  closeOnLinkClick?: boolean;
  closeOnEscape?: boolean;
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
 * <SideBar defaultOpen={open} />
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
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleClose = () => setIsOpen(false);

  // Escape
  useEscapeKey(handleClose, isOpen && closeOnEscape);

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Global toggles via data-* attributes
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const opener = t.closest("[data-sidebar-open],[data-sidebar-close],[data-sidebar-toggle]");
      if (!opener) return;

      const openId = opener.getAttribute("data-sidebar-open");
      const closeId = opener.getAttribute("data-sidebar-close");
      const toggleId = opener.getAttribute("data-sidebar-toggle");
      const tgt = openId || closeId || toggleId;
      if (tgt !== id) return;

      if (openId) setIsOpen(true);
      if (closeId) setIsOpen(false);
      if (toggleId) setIsOpen((p) => !p);

      const isHashLink = opener.tagName === "A" && opener.getAttribute("href") === "#";
      if (isHashLink) e.preventDefault();
    };

    document.addEventListener("click", onDocClick, { capture: true });
    return () => document.removeEventListener("click", onDocClick, { capture: true });
  }, [id]);

  // Close on link click
  const handlePanelClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const wantsClose = target.closest("[data-close-menu]");
    if (wantsClose) return void setIsOpen(false);
    if (closeOnLinkClick && target.closest("a")) setIsOpen(false);
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
    <Portal>
      {/* Overlay */}
      <div
        className={cx(
          "tmbk-sidebar-overlay",
          themeScoped && "tmbk-theme",
          overlayClassName
        )}
        data-open={isOpen ? "true" : "false"}
        aria-hidden="true"
        onClick={closeOnOverlayClick ? handleClose : undefined}
        style={vars}
      />

      {/* Panel */}
      <aside
        className={cx("tmbk-sidebar", themeScoped && "tmbk-theme", panelClassName)}
        data-open={isOpen ? "true" : "false"}
        data-side={side}
        role="dialog"
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
  );
}
