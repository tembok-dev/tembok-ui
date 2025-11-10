import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { variants, cx } from './utils/variants';

// Variant types matching Astro version
type Intent = 'primary' | 'neutral' | 'ghost' | 'success' | 'warning' | 'info' | 'danger';
type Size = 'sm' | 'md' | 'lg';
type Tone = 'default' | 'ink' | 'red' | 'lime' | 'cyan';

// Polymorphic component types
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

const cls = variants(
  // 👇 Añadimos el scope de tema local al root del botón
  "tmbk-theme inline-flex items-center gap-2 select-none cursor-pointer \
   rounded-lg px-3 py-1.5 text-sm font-medium \
   brightness-90 hover:brightness-100 \
   transition-all duration-fast shadow-sm active:animate-press \
   border tmbk-border \
   outline-none focus:outline-none \
   focus-visible:ring-2 \
   focus-visible:ring-[color:var(--tmbk-fg)]/30 \
   focus-visible:ring-offset-2 \
   focus-visible:ring-offset-[color:var(--tmbk-bg)] \
   ring-transparent ring-offset-transparent",
  {
    intent: {
      primary:
        "tmbk-bg-primary tmbk-text-primary-fg border-transparent \
         active:brightness-95 \
         focus-visible:ring-[color:var(--tmbk-primary)]/40",

      neutral:
        "tmbk-bg-light tmbk-text tmbk-border \
         active:brightness-95 \
         focus-visible:ring-[color:var(--tmbk-fg)]/30",

      ghost:
        "bg-transparent tmbk-text tmbk-border \
         active:bg-[color:var(--tmbk-bg-light)]/80 \
         focus-visible:ring-[color:var(--tmbk-fg)]/25",

      success:
        "tmbk-bg-success tmbk-text-success-fg border-transparent \
         active:brightness-95 \
         focus-visible:ring-[color:var(--tmbk-success)]/35",

      warning:
        "tmbk-bg-warning tmbk-text-warning-fg border-transparent \
         active:brightness-95 \
         focus-visible:ring-[color:var(--tmbk-warning)]/35",

      info:
        "tmbk-bg-info tmbk-text-info-fg border-transparent \
         active:brightness-95 \
         focus-visible:ring-[color:var(--tmbk-info)]/35",

      danger:
        "tmbk-bg-danger tmbk-text-danger-fg border-transparent \
         active:brightness-95 \
         focus-visible:ring-[color:var(--tmbk-danger)]/40",
    },
    size: {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-5 py-2.5 text-base",
    },
    tone: {
      default: "",
      ink: "!tmbk-bg-brand-ink/90  !tmbk-text-brand-ink-fg   hover:!tmbk-bg-brand-ink  focus-visible:!ring-[color:var(--tmbk-brand-ink)]/40",
      red: "!tmbk-bg-brand-red/90  !tmbk-text-brand-red-fg   hover:!tmbk-bg-brand-red  focus-visible:!ring-[color:var(--tmbk-brand-red)]/40",
      lime: "!tmbk-bg-brand-lime/90 !tmbk-text-brand-lime-fg  hover:!tmbk-bg-brand-lime focus-visible:!ring-[color:var(--tmbk-brand-lime)]/40",
      cyan: "!tmbk-bg-brand-cyan/90 !tmbk-text-brand-cyan-fg  hover:!tmbk-bg-brand-cyan focus-visible:!ring-[color:var(--tmbk-brand-cyan)]/40",
    },
    disabled: {
      true: "disabled:brightness-25 disabled:tmbk-bg disabled:tmbk-text pointer-events-none",
      false: "",
    },
  },
  { intent: "primary", size: "sm", tone: "default", disabled: "false" }
);

/**
 * Button component - polymorphic button with intent, size, and tone variants
 */
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
  const Component = as || 'button';

  const buttonClass = cx(
    cls({
      intent,
      size,
      tone,
      disabled: String(disabled),
    }),
    className
  );

  const buttonProps = Component === 'button'
    ? { disabled, ...props }
    : props;

  return (
    <Component className={buttonClass} {...buttonProps}>
      {children}
    </Component>
  );
}
