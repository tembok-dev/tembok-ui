// IconButton.tsx
import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { variants, cx } from "./utils/variants";

type Intent = "primary" | 'secondary' | "neutral" | "ghost" | "success" | "warning" | "info" | "danger";
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
  // base CSS-only (mismo hueso que Button)
  "tmbk-theme tmbk-btn tmbk-btn--icon";

const cls = variants(
  base,
  {
    intent: {
      // El estilo visual de intent lo maneja CSS vía [data-intent]
      primary: "",
      secondary: "",
      neutral: "",
      ghost: "",
      success: "",
      warning: "",
      info: "",
      danger: "",
    },
    size: {
      // Ajustamos padding y font-size vía clases propias (sin Tailwind)
      sm: "tmbk-btn--sm",
      md: "tmbk-btn--md",
      lg: "tmbk-btn--lg",
    },
    tone: {
      // Tembok tones: reasignan tokens vía [data-tone] en CSS
      default: "",
      ink: "",
      red: "",
      lime: "",
      cyan: "",
    },
    disabled: {
      // Disabled lo resuelven [:disabled] y [aria-disabled] en CSS
      true: "",
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
  const Component = (as || "button") as ElementType;

  const classNames = cx(
    cls({ intent, size, tone, disabled: String(disabled) }),
    // icon-only: sin gap, centrado perfecto (lo hace el CSS de .tmbk-btn--icon)
    className
  );

  // data-attrs para que CSS aplique intent/tone
  const dataAttrs = { "data-intent": intent, "data-tone": tone };

  // a11y label/title siempre presentes (icon-only)
  const labelled = { "aria-label": label, title: label };

  // --- Branch nativo: <button> ---
  if (Component === "button") {
    return (
      <button
        className={classNames}
        {...dataAttrs}
        {...labelled}
        disabled={disabled}
        {...(props as ComponentPropsWithoutRef<"button">)}
      >
        {pulse && (
          // Usa clases propias para el efecto (definidas en CSS: .tmbk-btn__pulse / .tmbk-btn__pulse-dot)
          <span aria-hidden="true" className="tmbk-btn__pulse">
            <span className="tmbk-btn__pulse-dot" />
          </span>
        )}
        {/* Wrapper que fija el box a 1em y centra el contenido */}
        <span className="tmbk-icon">
          {/*
            Cualquier children (svg, icono React, etc.) se normaliza a 1em por CSS.
            Si el usuario pasa un icono que ya usa currentColor, hereda color del botón.
          */}
          {children}
        </span>
      </button>
    );
  }

  // --- Branch polimórfico: <a>, <div>, etc. ---
  return (
    <Component
      className={classNames}
      {...dataAttrs}
      {...labelled}
      aria-disabled={disabled || undefined} // Booleanish, solo cuando no es <button>
      {...props}
    >
      {pulse && (
        <span aria-hidden="true" className="tmbk-btn__pulse">
          <span className="tmbk-btn__pulse-dot" />
        </span>
      )}
      <span className="tmbk-icon">{children}</span>
    </Component>
  );
}
