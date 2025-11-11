// IconButton.tsx
import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { variants, cx } from "./utils/variants";

type Intent = "primary" | "neutral" | "ghost" | "success" | "warning" | "info" | "danger";
type Size = "sm" | "md" | "lg";
type Tone = "default" | "ink" | "red" | "lime" | "cyan";

type PolymorphicProps<E extends ElementType> = {
    as?: E;
    /** a11y label; required for icon-only buttons */
    label?: string;
    intent?: Intent;
    size?: Size;
    tone?: Tone;
    disabled?: boolean;
    pulse?: boolean;
    children?: ReactNode;
    className?: string;
} & ComponentPropsWithoutRef<E>;

export type IconButtonProps<E extends ElementType = "button"> = PolymorphicProps<E>;

/**
 * Superficie: igual que Button, pero icon-only.
 * Escala del ícono: determinada por font-size (según size).
 * El wrapper .tmbk-icon usa 1em; un CSS del paquete asegura svg = 1em.
 */
const base =
    "tmbk-theme inline-flex items-center justify-center select-none cursor-pointer " +
    "rounded-lg outline-none focus-visible:outline-none " +
    "transition-all shadow-sm active:animate-press " +
    "focus-visible:ring-2 ring-primary ring-offset-2 ring-offset-bg border " +
    // Altura visual consistente. El padding lo da el variant size.
    "align-middle";

const cls = variants(
    base,
    {
        intent: {
            primary: "bg-primary text-primary-fg border-transparent hover:brightness-105 active:brightness-95",
            neutral: "bg-bg-light text-fg border-border hover:brightness-105 active:brightness-95",
            ghost: "bg-transparent text-fg border-border hover:bg-bg-light/80",
            success: "bg-success text-success-fg border-transparent hover:brightness-105 active:brightness-95",
            warning: "bg-warning text-warning-fg border-transparent hover:brightness-105 active:brightness-95",
            info: "bg-info text-info-fg border-transparent hover:brightness-105 active:brightness-95",
            danger: "bg-danger text-danger-fg border-transparent hover:brightness-105 active:brightness-95",
        },
        size: {
            // Ajustamos padding y font-size. El ícono (svg) escalará a 1em.
            sm: "px-2.5 py-1.5 text-[0.875rem] leading-none", // 14px
            md: "px-3.5 py-2   text-[1rem]    leading-none", // 16px
            lg: "px-4.5 py-2.5 text-[1.125rem] leading-none", // 18px
        },
        tone: {
            default: "",
            // Tembok tones: usan tokens brand, sin sangrar al host.
            ink: "bg-[color:var(--tmbk-brand-ink)]  text-[color:var(--tmbk-brand-ink-fg)]",
            red: "bg-[color:var(--tmbk-brand-red)]  text-[color:var(--tmbk-brand-red-fg)]",
            lime: "bg-[color:var(--tmbk-brand-lime)] text-[color:var(--tmbk-brand-lime-fg)]",
            cyan: "bg-[color:var(--tmbk-brand-cyan)] text-[color:var(--tmbk-brand-cyan-fg)]",
        },
        disabled: {
            true: "pointer-events-none opacity-60",
            false: "",
        },
    },
    { intent: "primary", size: "sm", tone: "default", disabled: "false" }
);

export function IconButton<E extends ElementType = "button">({
    as,
    label = "Icon button",
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
        cls({ intent, size, tone, disabled: String(disabled) }),
        // icon-only: sin gap, centrado perfecto
        "gap-0",
        className
    );

    const buttonProps =
        Component === "button"
            ? { disabled, "aria-label": label, title: label, ...props }
            : { "aria-label": label, title: label, ...props };

    return (
        <Component className={classNames} {...buttonProps}>
            {pulse && (
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
                    <span className="size-4 rounded-full bg-[currentColor]/35 animate-ping" />
                </span>
            )}

            {/* Wrapper que fija el box a 1em y centra el contenido */}
            <span className="relative inline-grid place-items-center tmbk-icon leading-none">
                {/* 
          Cualquier children (svg, icono React, etc.) se normaliza a 1em por CSS.
          Si el usuario pasa un icono que ya usa currentColor, hereda color del botón.
        */}
                {children}
            </span>
        </Component>
    );
}
