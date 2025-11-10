// tembok/components/src/react/Dropdown.tsx
import { ReactElement, ReactNode } from "react";
import { Popover } from "./Popover";
import { Side, Align } from "./hooks/usePosition";
import { cx } from "./utils/variants";

export type DropdownProps = {
    trigger: ReactElement;
    children: ReactNode;              // buttons/anchors OR <ul><li>…</li></ul>
    side?: Side;
    align?: Align;
    className?: string;               // extra panel classes
    maxHeight?: number;               // scroll clamp inside panel
};

export function Dropdown({
    trigger,
    children,
    side = "down",
    align = "start",
    className,
    maxHeight = 320,
}: DropdownProps) {
    return (
        <Popover
            trigger={trigger}
            side={side}
            align={align}
            closeOnSelect
            panelClassName={cx(
                // ⬇️ Scope de tema local + chrome del panel
                "tmbk-theme min-w-44 p-1 rounded-xl border",
                "border-[color:var(--tmbk-border)]",            // border tmbk
                "bg-[color:var(--tmbk-bg)]/95",                  // fondo tmbk con opacidad
                "backdrop-blur-md",                              // (se mantiene)
                "shadow-elevation-high",

                // --- WRAPPER-AWARE SELECTORS (panel > wrapper > item) ---
                // Generic items (button|a|div)
                "[&>*>*]:block [&>*>*]:w-full [&>*>*]:rounded-lg [&>*>*]:px-3 [&>*>*]:py-2 [&>*>*]:text-left [&>*>*]:text-sm",
                "[&>*>*]:outline-none [&>*>*]:ring-0",
                "[&>*>*:hover]:bg-[color:var(--tmbk-bg-light)]/70 [&>*>*:hover]:tmbk-text",
                "[&>*>*:disabled]:opacity-50",

                // UL mode: panel > wrapper > ul > li > (a|button|div)
                "[&>*>ul]:m-0 [&>*>ul]:p-0 [&>*>ul]:list-none",
                "[&>*>ul>li>*]:block [&>*>ul>li>*]:w-full [&>*>ul>li>*]:rounded-lg [&>*>ul>li>*]:px-3 [&>*>ul>li>*]:py-2 [&>*>ul>li>*]:text-left [&>*>ul>li>*]:text-sm",
                "[&>*>ul>li>*:hover]:bg-[color:var(--tmbk-bg-light)]/70 [&>*>ul>li>*:hover]:tmbk-text",

                // Separators
                "[&>*>hr]:my-1 [&>*>hr]:border-t [&>*>hr]:border-[color:var(--tmbk-border)]/60 [&>*>hr:hover]:bg-transparent",
                className
            )}
        >
            {/* wrapper (kept to avoid touching Popover) */}
            <div className="overflow-auto" style={{ maxHeight }}>
                {children}
            </div>
        </Popover>
    );
}
