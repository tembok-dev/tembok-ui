// tembok/components/src/react/Dropdown.tsx
import { ReactElement, ReactNode } from "react";
import { Popover, PopoverChangeReason } from "./Popover";
import { Side, Align, VirtualAnchor } from "./hooks/usePosition";
import { cx } from "./utils/variants";

/** Menu-like floating panel; supports controlled state or a trigger-owned default. */
export type DropdownProps = {
  /** Trigger element; optional when using a virtual anchor. */
  trigger?: ReactElement;
  /** Controlled visibility; omit for internal state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, reason: PopoverChangeReason) => void;
  anchorRect?: VirtualAnchor | DOMRect | null;
  anchorElement?: HTMLElement | null;
  ariaLabel?: string;
  children: ReactNode;     // direct items OR <ul><li>…</li></ul>
  /** Preferred placement: auto/down/up. @defaultValue auto */
  side?: Side;
  /** Alignment to the anchor. @defaultValue start */
  align?: Align;
  className?: string;      // extra panel classes
  /** Maximum internal scroll height in CSS pixels. @defaultValue 320 */
  maxHeight?: number;
  /** Optional per-instance variable overrides */
  bgColor?: string;        // -> --tmbk-bg
  textColor?: string;      // -> --tmbk-fg
  borderColor?: string;    // -> --tmbk-border
  /** If no theme wrapper present, keep true to scope on the panel */
  themeScoped?: boolean;   // default true
  /** Dismiss on selecting an item unless that item opts out. @defaultValue true */
  closeOnSelect?: boolean;
  /** Bubble z-index down to the underlying Popover */
  zIndex?: number;
};

/**
 * Token-styled floating menu, composed from Popover.
 * @example
 * <Dropdown trigger={<Button>Options</Button>}>
 *   <MenuItem onClick={edit}>Edit</MenuItem>
 * </Dropdown>
 */
export function Dropdown({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  anchorRect,
  anchorElement,
  ariaLabel,
  children,
  side = "auto",
  align = "start",
  className,
  maxHeight = 320,
  bgColor,
  textColor,
  borderColor,
  themeScoped = true,
  closeOnSelect = true,
  zIndex,
}: DropdownProps) {
  // Panel classes: headless + optional local theme scope
  const panelClassName = cx(
    "tmbk-dropdown",
    themeScoped && "tmbk-theme",
    className
  );

  // CSS variables: per-instance overrides + max height for wrapper
  const style: React.CSSProperties = {
    ...(bgColor ? { ["--tmbk-bg" as any]: bgColor } : null),
    ...(textColor ? { ["--tmbk-fg" as any]: textColor } : null),
    ...(borderColor ? { ["--tmbk-border" as any]: borderColor } : null),

  };

  return (
    <Popover
      trigger={trigger}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      anchorRect={anchorRect}
      anchorElement={anchorElement}
      ariaLabel={ariaLabel}
      side={side}
      align={align}
      role="menu"
      closeOnSelect={closeOnSelect}
      panelClassName={panelClassName}
      // Pass-through variable overrides to the panel node
      bgColor={bgColor}
      textColor={textColor}
      borderColor={borderColor}
      zIndex={zIndex}
      scrollMaxHeight={maxHeight}
    // keep Popover headless; the classes above drive CSS below
    >
      {/* wrapper keeps scroll and structural selectors stable */}
      <div className="tmbk-dropdown-wrap" role="none" style={style}>
        {children}
      </div>
    </Popover>
  );
}
