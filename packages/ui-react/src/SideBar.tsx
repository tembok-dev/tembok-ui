import { ReactNode, useState, useEffect } from 'react';
import { cx } from './utils/variants';
import { useEscapeKey } from './hooks/useEscapeKey';

type SidePosition = 'left' | 'right';

interface SideBarProps {
  id?: string;
  side?: SidePosition;
  widthClass?: string;
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
}

/**
 * SideBar component - Collapsible sidebar with overlay and smooth transitions
 * 
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 * 
 * <SideBar 
 *   open={open} 
 *   onOpenChange={setOpen}
 *   side="right"
 *   header={<h2>Menu</h2>}
 * >
 *   <nav>
 *     <a href="/about">About</a>
 *     <a href="/contact">Contact</a>
 *   </nav>
 * </SideBar>
 * 
 * <button onClick={() => setOpen(true)}>Open Menu</button>
 * ```
 */
export function SideBar({
  id = 'sidebar',
  side = 'right',
  widthClass = 'w-[86vw] max-w-[360px]',
  panelClassName = 'px-6 pt-10 pb-10',
  overlayClassName = '',
  showClose = true,
  closeAriaLabel = 'Close menu',
  defaultOpen = false,
  closeOnLinkClick = false,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  children,
  header,
}: SideBarProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleClose = () => {
    setIsOpen(false);
  };

  // Escape key to close
  useEscapeKey(handleClose, isOpen && closeOnEscape);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Expose toggle function globally for external triggers
  useEffect(() => {
    const handleGlobalToggle = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const opener = target.closest(
        '[data-sidebar-open],[data-sidebar-close],[data-sidebar-toggle]'
      );
      if (!opener) return;

      const openId = opener.getAttribute('data-sidebar-open');
      const closeId = opener.getAttribute('data-sidebar-close');
      const toggleId = opener.getAttribute('data-sidebar-toggle');
      const tgt = openId || closeId || toggleId;
      if (tgt !== id) return;

      if (openId) setIsOpen(true);
      if (closeId) setIsOpen(false);
      if (toggleId) setIsOpen((prev) => !prev);

      // Prevent accidental navigation
      if (opener.tagName === 'A' && opener.getAttribute('href') === '#') {
        e.preventDefault();
      }
    };

    document.addEventListener('click', handleGlobalToggle, { capture: true });
    return () => {
      document.removeEventListener('click', handleGlobalToggle, { capture: true });
    };
  }, [id]);

  const handlePanelClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const closeElement = target.closest('[data-close-menu]');
    
    if (closeElement) {
      setIsOpen(false);
      return;
    }

    if (closeOnLinkClick) {
      const link = target.closest('a');
      if (link) {
        setIsOpen(false);
      }
    }
  };

  const sideTranslate =
    side === 'left'
      ? isOpen ? 'translate-x-0' : 'translate-x-[-100%]'
      : isOpen ? 'translate-x-0' : 'translate-x-full';

  const headerAlign = side === 'left' ? 'justify-start' : 'justify-end';

  return (
    <div style={{ isolation: 'isolate' }}>
      {/* Overlay */}
      {closeOnOverlayClick ? (
        <div
          onClick={handleClose}
          className={cx(
            'fixed inset-0 z-[2147483646] bg-bg/60 backdrop-blur-sm transition-opacity duration-300',
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
            overlayClassName
          )}
          aria-hidden="true"
        />
      ) : (
        <div
          className={cx(
            'fixed inset-0 z-[2147483646] bg-bg/60 backdrop-blur-sm transition-opacity duration-300',
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
            overlayClassName
          )}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <aside
        className={cx(
          'fixed top-0 bottom-0 z-[2147483647]',
          widthClass,
          sideTranslate,
          side === 'left' ? 'left-0 border-r' : 'right-0 border-l',
          'transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] bg-bg/90 backdrop-blur-xl border-border shadow-2xl will-change-transform',
          panelClassName
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Sticky header */}
          <div className="sticky top-0 z-10 w-full bg-bg/80 backdrop-blur-xl border-b border-border">
            <div className={`flex ${headerAlign} items-center gap-2 px-6 py-4`}>
              {header ? (
                header
              ) : (
                showClose && (
                  <button
                    onClick={handleClose}
                    aria-label={closeAriaLabel}
                    className="inline-grid place-items-center rounded-md p-2 bg-bg-light/90 text-fg hover:bg-bg-light active:bg-bg/90 transition-all duration-200 cursor-pointer ring-1 ring-border"
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

          {/* Content area */}
          <div className="flex-1 flex flex-col gap-8" onClick={handlePanelClick}>
            {children}
          </div>
        </div>
      </aside>
    </div>
  );
}
