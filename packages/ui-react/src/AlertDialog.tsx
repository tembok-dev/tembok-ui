import type { ReactNode } from 'react';
import { Modal, type ModalProps } from './Modal';

/**
 * Decision dialog built on Modal. Consumers own both button elements and
 * their handlers, including async work and when the dialog closes.
 */
export interface AlertDialogProps {
  /** Controlled visibility. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Required accessible title. */
  title: ReactNode;
  /** Explanation, warning, or other decision context. */
  children: ReactNode;
  /** Consumer-provided buttons; neither label nor style is prescribed. */
  cancelAction?: ReactNode;
  /** Consumer-owned confirmation element; no action or dismissal occurs automatically. */
  confirmAction: ReactNode;
  /** Optional panel sizing; defaults to a compact surface. */
  size?: ModalProps['size'];
  width?: ModalProps['width'];
  className?: string;
  id?: string;
}

/**
 * Compact confirmation dialog using Modal. Cancel receives initial focus when supplied;
 * outside clicks do not dismiss, but Escape does. Actions control their own behavior.
 * @example
 * <AlertDialog open={open} onOpenChange={setOpen} title="Delete draft?"
 *   cancelAction={<Button onClick={() => setOpen(false)}>Cancel</Button>}
 *   confirmAction={<Button intent="danger" onClick={remove}>Delete</Button>}>
 *   This cannot be undone.
 * </AlertDialog>
 */
export function AlertDialog({
  open, onOpenChange, title, children, cancelAction, confirmAction,
  size = 'sm', width, className, id,
}: AlertDialogProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size={size}
      width={width}
      id={id}
      role="alertdialog"
      dismissOnOutsideClick={false}
      initialFocusSelector={cancelAction ? '[data-tmbk-alert-cancel] button:not([disabled]), [data-tmbk-alert-cancel] a[href], [data-tmbk-alert-cancel] [tabindex]:not([tabindex="-1"])' : undefined}
      className={className}
      header={<h2>{title}</h2>}
      footer={<>
        {cancelAction != null && <span data-tmbk-alert-cancel className="tmbk-alert-action">{cancelAction}</span>}
        <span data-tmbk-alert-confirm className="tmbk-alert-action">{confirmAction}</span>
      </>}
    >
      {children}
    </Modal>
  );
}
