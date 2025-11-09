// IconButton.tsx
import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { variants, cx } from "../utils/variants";

// Match Button's variant shape
type Intent =
    | "primary"
    | "neutral"
    | "ghost"
    | "success"
    | "warning"
    | "info"
    | "danger";
type Size = "sm" | "md" | "lg";
type Tone = "default" | "ink" | "red" | "lime" | "cyan";

type PolymorphicProps<E extends ElementType> = {
    as?: E;
    /** a11y label; required for icon-only buttons */
    label?: string;
    /** optional inner icon size hint (doesn't affect chrome) */
    iconSize?: number;
    intent?: Intent;
    size?: Size;
    tone?: Tone;
    disabled?: boolean;
    pulse?: boolean;
    children?: ReactNode;
    className?: string;
} & ComponentPropsWithoutRef<E>;

export type IconButtonProps<E extends ElementType = "button"> =
    PolymorphicProps<E>;

// Base & variants mirror Button.tsx surface exactly.
const cls = variants(
    // === Base matches Button ===
    "inline-flex items-center justify-center select-none cursor-pointer \
   rounded-lg text-sm font-medium \
   brightness-90 hover:brightness-100 \
   transition-all duration-fast shadow-sm active:animate-press \
   border border-border \
   outline-none focus:outline-none \
   focus-visible:ring-2 focus-visible:ring-fg/30 \
   focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--bg))] \
   ring-transparent ring-offset-transparent",
    {
        intent: {
            primary:
                "bg-primary text-primary-fg border-transparent active:brightness-95 focus-visible:ring-primary/40",
            neutral:
                "bg-bg-light/90 text-fg border-border/60 active:bg-bg/90 focus-visible:ring-fg/30",
            ghost:
                "bg-transparent text-fg border-border active:bg-bg-light/80 focus-visible:ring-fg/25",
            success:
                "bg-success text-success-fg border-transparent active:brightness-95 focus-visible:ring-success/35",
            warning:
                "bg-warning text-warning-fg border-transparent active:brightness-95 focus-visible:ring-warning/35",
            info:
                "bg-info text-info-fg border-transparent active:brightness-95 focus-visible:ring-info/35",
            danger:
                "bg-danger text-danger-fg border-transparent active:brightness-95 focus-visible:ring-danger/40",
        },
        // Use SAME size paddings as Button so heights/rounding/offsets align in rows.
        size: {
            sm: "px-3 py-1.5 text-xs",
            md: "px-4 py-2 text-sm",
            lg: "px-5 py-2.5 text-base",
        },
        tone: {
            default: "",
            ink: "!bg-brand-ink/90  !text-brand-ink-fg   hover:!bg-brand-ink  focus-visible:!ring-brand-ink/40",
            red: "!bg-brand-red/90  !text-brand-red-fg   hover:!bg-brand-red  focus-visible:!ring-brand-red/40",
            lime: "!bg-brand-lime/90 !text-brand-lime-fg  hover:!bg-brand-lime focus-visible:!ring-brand-lime/40",
            cyan: "!bg-brand-cyan/90 !text-brand-cyan-fg  hover:!bg-brand-cyan focus-visible:!ring-brand-cyan/40",
        },
        disabled: {
            true: "disabled:brightness-25 disabled:bg-fg disabled:text-bg-dark pointer-events-none",
            false: "",
        },
    },
    // Match Button defaults exactly
    { intent: "primary", size: "sm", tone: "default", disabled: "false" }
);

export function IconButton<E extends ElementType = "button">({
    as,
    label = "Icon button",
    iconSize, // optional; children can still control their own size
    intent = "primary",
    size = "sm",
    tone = "default",
    disabled = false,
    pulse = false,
    className,
    children,
    ...props
}: IconButtonProps<E>) {
    const Component = as || "button";

    const classNames = cx(
        cls({
            intent,
            size,
            tone,
            disabled: String(disabled),
        }),
        // keep icon-only spacing tidy
        "gap-0",
        className
    );

    // Only set disabled on real <button>
    const buttonProps =
        Component === "button"
            ? { disabled, "aria-label": label, title: label, ...props }
            : { "aria-label": label, title: label, ...props };

    return (
        <Component className={classNames} {...buttonProps}>
            {pulse && (
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 grid place-items-center"
                >
                    <span className="size-4 rounded-full bg-[currentColor]/35 animate-ping" />
                </span>
            )}
            <span
                className={cx(
                    "relative inline-grid place-items-center",
                    // nudge the icon so it feels visually centered like Button text
                    size === "sm" ? "h-4 w-4" : size === "md" ? "h-5 w-5" : "h-5.5 w-5.5"
                )}
                style={iconSize ? ({ fontSize: iconSize } as React.CSSProperties) : undefined}
            >
                {children}
            </span>
        </Component>
    );
}
