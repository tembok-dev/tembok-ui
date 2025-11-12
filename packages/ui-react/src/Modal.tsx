// Modal.tsx
// Headless styling

import { ReactNode, useRef, useCallback, useEffect, useId } from 'react';
import { Portal } from './utils/Portal';
import { cx } from './utils/variants';
import { useFocusTrap } from './hooks/useFocusTrap';
import { useEscapeKey } from './hooks/useEscapeKey';
import { useClickOutside } from './hooks/useClickOutside';


/**
 * Headless Modal wiring (example)
 *
 * const [open, setOpen] = useState(false);
 *
 * <div className="tmbk-theme">
 *   <div
 *     className="tmbk-modal-overlay"
 *     data-open={open}
 *     onClick={() => setOpen(false)}
 *   />
 *   <div
 *     className="tmbk-modal"
 *     data-open={open}            // or data-state="open" | "closed"
 *     aria-hidden={!open}
 *   >
 *     <section className="tmbk-modal-panel" data-size="md">
 *       <header className="tmbk-modal-header">
 *         <button className="tmbk-modal-close" onClick={() => setOpen(false)}>✕</button>
 *       </header>
 *       <div className="tmbk-modal-body">…content…</div>
 *       <footer className="tmbk-modal-footer">…actions…</footer>
 *     </section>
 *   </div>
 * </div>
 */

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;        // extra classes for panel
  overlayClassName?: string; // extra classes for overlay
  id?: string;
}

/**
 * Modal component - Accessible modal dialog with backdrop and focus trap
 *
 * @example
 * const [open, setOpen] = useState(false);
 *
 * <Modal
 *   open={open}
 *   onOpenChange={setOpen}
 *   header={<h2>Modal Title</h2>}
 *   footer={<Button onClick={() => setOpen(false)}>Close</Button>}
 * >
 *   <p>Modal content here</p>
 * </Modal>
 */
export function Modal({
  open,
  onOpenChange,
  children,
  header,
  footer,
  className,
  overlayClassName,
  id = 'tembok-modal',
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null!);
  const headerId = useId();
  const bodyId = useId();

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  // Focus trap when open
  useFocusTrap(panelRef, open);

  // Escape key to close
  useEscapeKey(handleClose, open);

  // Click outside to close
  useClickOutside(panelRef, handleClose, open);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = originalStyle; };
    }
  }, [open]);

  if (!open) return null;

  return (
    <Portal>
      <div
        id={id}
        // Scope + layout shell (no Tailwind)
        className="tmbk-theme tmbk-modal"
      >
        {/* Backdrop */}
        <div
          className={cx('tmbk-overlay', overlayClassName)}
          aria-hidden="true"
        />

        {/* Panel */}
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          {...(header ? { 'aria-labelledby': headerId } : {})}
          {...(children ? { 'aria-describedby': bodyId } : {})}
          tabIndex={-1}
          className={cx('tmbk-modal-panel', className)}
        >
          {header && <header id={headerId} className="tmbk-modal-header">{header}</header>}
          <div id={bodyId} className="tmbk-modal-body">{children}</div>
          {footer && <footer className="tmbk-modal-footer">{footer}</footer>}
        </div>
      </div>
    </Portal>
  );
}
