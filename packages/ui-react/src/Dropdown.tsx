// tembok/components/src/react/Dropdown.tsx
import { ReactElement, ReactNode } from "react";
import { Popover } from "./Popover";
import { Side, Align } from "./hooks/usePosition";
import { cx } from "./utils/variants";

export type DropdownProps = {
  trigger: ReactElement;
  children: ReactNode;     // direct items OR <ul><li>…</li></ul>
  side?: Side;
  align?: Align;
  className?: string;      // extra panel classes
  maxHeight?: number;      // scroll clamp
  /** Optional per-instance variable overrides */
  bgColor?: string;        // -> --tmbk-bg
  textColor?: string;      // -> --tmbk-fg
  borderColor?: string;    // -> --tmbk-border
  /** If no theme wrapper present, keep true to scope on the panel */
  themeScoped?: boolean;   // default true
};

export function Dropdown({
  trigger,
  children,
  side = "down",
  align = "start",
  className,
  maxHeight = 320,
  bgColor,
  textColor,
  borderColor,
  themeScoped = true,
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
    ["--tmbk-dropdown-maxh" as any]: `${maxHeight}px`,
  };

  return (
    <Popover
      trigger={trigger}
      side={side}
      align={align}
      role="menu"
      closeOnSelect
      panelClassName={panelClassName}
      // Pass-through variable overrides to the panel node
      bgColor={bgColor}
      textColor={textColor}
      borderColor={borderColor}
      // keep Popover headless; the classes above drive CSS below
    >
      {/* wrapper keeps scroll and structural selectors stable */}
      <div className="tmbk-dropdown-wrap" role="none">
        {children}
      </div>
    </Popover>
  );
}
