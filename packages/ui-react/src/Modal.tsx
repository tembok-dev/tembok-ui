// Modal.tsx
// Headless styling

import { ReactNode, useRef, useCallback, useId } from 'react';
import { Portal } from './utils/Portal';
import { cx } from './utils/variants';
import { useFocusTrap } from './hooks/useFocusTrap';
import { useEscapeKey } from './hooks/useEscapeKey';
import { useClickOutside } from './hooks/useClickOutside';
import { usePortalTheme } from './hooks/usePortalTheme';
import { useBodyScrollLock } from './hooks/useBodyScrollLock';


export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  /** Preset panel width. Defaults to md, preserving the existing 560px width. */
  size?: ModalSize;
  /** Optional width override; any valid CSS width value. */
  width?: string;
  /** Controlled visibility; content is portaled only while open. */
  open: boolean;
  /** Called when Escape, outside click or a consumer action requests a state change. */
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  /** Optional header, typically a semantic heading used as accessible name. */
  header?: ReactNode;
  /** Optional persistent footer for action buttons. */
  footer?: ReactNode;
  className?: string;        // extra classes for panel
  overlayClassName?: string; // extra classes for overlay
  id?: string;
  /** Semantic alert for high-impact decisions. */
  role?: 'dialog' | 'alertdialog';
  /** Disable backdrop dismissal for decisions requiring an explicit action. */
  /** Outside-pointer dismissal. @defaultValue true */
  dismissOnOutsideClick?: boolean;
  /** CSS selector for preferred initial focus (e.g. cancel action). */
  initialFocusSelector?: string;
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
function ModalContent({
  open,
  onOpenChange,
  children,
  header,
  footer,
  className,
  overlayClassName,
  id = 'tembok-modal',
  size = 'md',
  width,
  role = 'dialog',
  dismissOnOutsideClick = true,
  initialFocusSelector,
  themeSourceRef,
}: ModalProps & { themeSourceRef: React.RefObject<HTMLSpanElement> }) {
  const panelRef = useRef<HTMLDivElement>(null!);
  const headerId = useId();
  const bodyId = useId();
  const modalRootRef = useRef<HTMLDivElement>(null!);
  usePortalTheme(modalRootRef, () => themeSourceRef.current, open);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  // Focus trap when open
  // Escape key to close; also determines ownership of Tab navigation.
  const isTopLayer = useEscapeKey(handleClose, open);
  useFocusTrap(panelRef, open, isTopLayer, initialFocusSelector);

  // Click outside to close
  useClickOutside(panelRef, () => { if (isTopLayer()) handleClose(); }, open && dismissOnOutsideClick);

  useBodyScrollLock(open);

  return (
      <div
        id={id}
        ref={modalRootRef}
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
          role={role}
          aria-modal="true"
          {...(header ? { 'aria-labelledby': headerId } : {})}
          {...(children ? { 'aria-describedby': bodyId } : {})}
          tabIndex={-1}
          data-size={size}
          style={width ? { ['--tmbk-modal-width' as string]: width } : undefined}
          className={cx('tmbk-modal-panel', className)}
        >
          {header && <header id={headerId} className="tmbk-modal-header">{header}</header>}
          <div id={bodyId} className="tmbk-modal-body">{children}</div>
          {footer && <footer className="tmbk-modal-footer">{footer}</footer>}
        </div>
      </div>
  );
}


/** Mount focus handling with the portaled panel, not before the portal exists. */
/** Responsive, portaled dialog with focus trap, viewport-safe scrolling and opener focus restoration. */
export function Modal(props: ModalProps) {
  return <ModalPortalBridge {...props} />;
}

function ModalPortalBridge(props: ModalProps) {
  const themeSourceRef = useRef<HTMLSpanElement>(null!);
  if (!props.open) return null;
  return <>
    <span ref={themeSourceRef} hidden aria-hidden="true" />
    <Portal><ModalContent {...props} themeSourceRef={themeSourceRef} /></Portal>
  </>;
}
