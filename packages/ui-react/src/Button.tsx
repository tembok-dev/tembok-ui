// Button.tsx
import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { variants, cx } from './utils/variants';

type Intent = 'primary' | 'secondary' | 'neutral' | 'ghost' | 'success' | 'warning' | 'info' | 'danger';
type Size = 'sm' | 'md' | 'lg';
type Tone = 'default' | 'ink' | 'red' | 'lime' | 'cyan';

type PolymorphicProps<E extends ElementType> = {
  as?: E;
  intent?: Intent;
  size?: Size;
  tone?: Tone;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<E>;

export type ButtonProps<E extends ElementType = 'button'> = PolymorphicProps<E>;

const base =
  // scope + hueso estilístico
  "tmbk-theme tmbk-btn";

const cls = variants(base, {
  intent: {
    // El estilo visual de intent lo maneja CSS vía [data-intent]
    primary: "",
    secondary:'',
    neutral: "",
    ghost: "",
    success: "",
    warning: "",
    info: "",
    danger: "",
  },
  size: {
    // Tamaños precompilados en CSS (sin Tailwind)
    sm: "tmbk-btn--sm",
    md: "tmbk-btn--md",
    lg: "tmbk-btn--lg",
  },
  // Tones Tembok -> reasignan intent visual con data attributes (CSS)
  tone: {
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
}, { intent: "primary", size: "sm", tone: "default", disabled: "false" });

export function Button<E extends ElementType = 'button'>({
  as,
  intent = 'primary',
  size = 'sm',
  tone = 'default',
  disabled = false,
  className,
  children,
  ...props
}: ButtonProps<E>) {
  const Component = (as || 'button') as ElementType;

  const buttonClass = cx(
    cls({ intent, size, tone, disabled: String(disabled) }),
    className
  );

  // Pasamos data-attrs para que CSS aplique intent/tone.
  const dataAttrs = { 'data-intent': intent, 'data-tone': tone };

  // --- Branch nativo: <button> ---
  if (Component === 'button') {
    return (
      <button
        className={buttonClass}
        {...dataAttrs}
        disabled={disabled}
        {...(props as ComponentPropsWithoutRef<'button'>)}
      >
        {children}
      </button>
    );
  }

  // --- Branch polimórfico: <a>, <div>, etc. ---
  return (
    <Component
      className={buttonClass}
      {...dataAttrs}
      aria-disabled={disabled || undefined} // Booleanish solo en no-button
      {...props}
    >
      {children}
    </Component>
  );
}
