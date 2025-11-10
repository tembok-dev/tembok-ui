import { ReactNode, useRef, useCallback, useEffect } from 'react';
import { Portal } from './utils/Portal';
import { cx } from './utils/variants';
import { useFocusTrap } from './hooks/useFocusTrap';
import { useEscapeKey } from './hooks/useEscapeKey';
import { useClickOutside } from './hooks/useClickOutside';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  overlayClassName?: string;
  id?: string;
}

/**
 * Modal component - Accessible modal dialog with backdrop and focus trap
 * 
 * @example
 * ```tsx
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
 * ```
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
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <Portal>
      <div
        id={id}
        className="tmbk-theme fixed inset-0 grid place-items-center z-[2147483646] pointer-events-auto"
        
      >
        {/* Backdrop */}
      <div
        className={cx(
          // estaba z-0 → súbelo
          'fixed inset-0 z-[2147483645] tmbk-modal-overlay',
          overlayClassName
        )}
      />

        {/* Panel */}
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          className={cx(
            'relative z-10',
            'w-[min(92vw,560px)] rounded-md tmbk-bg tmbk-text shadow-soft border tmbk-border p-6',
            'opacity-100 translate-y-0 transition-[opacity,transform] duration-200',
            className
          )}
        >
          {header && <header className="mb-3">{header}</header>}
          <div>{children}</div>
          {footer && (
            <footer className="mt-6 flex justify-end gap-2">{footer}</footer>
          )}
        </div>
      </div>
    </Portal>
  );
}