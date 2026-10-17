import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from './utils/variants';

export interface MenuItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'prefix'> {
  icon?: ReactNode;
  trailing?: ReactNode;
  description?: ReactNode;
  danger?: boolean;
  selected?: boolean;
  /** Keep a menu open when activating this row. */
  keepOpen?: boolean;
}

/** A compact command row for Dropdown; unlike Popover it does not own floating behavior. */
export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(function MenuItem({
  icon, trailing, description, danger = false, selected = false,
  keepOpen = false, className, children, disabled, type = 'button', ...props
}, ref) {
  return <button
    {...props}
    ref={ref}
    type={type}
    role="menuitem"
    disabled={disabled}
    aria-disabled={disabled || undefined}
    data-danger={danger || undefined}
    data-selected={selected || undefined}
    data-close-popover={keepOpen ? 'false' : undefined}
    className={cx('tmbk-menu-item', className)}
  >
    {icon != null && <span className="tmbk-menu-item-icon" aria-hidden="true">{icon}</span>}
    <span className="tmbk-menu-item-main"><span className="tmbk-menu-item-label">{children}</span>
      {description != null && <span className="tmbk-menu-item-description">{description}</span>}
    </span>
    {trailing != null && <span className="tmbk-menu-item-trailing">{trailing}</span>}
  </button>;
});
