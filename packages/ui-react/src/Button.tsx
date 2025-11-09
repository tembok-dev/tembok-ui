import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { variants, cx } from '../utils/variants';

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
  "inline-flex items-center gap-2 select-none cursor-pointer \
   rounded-lg px-3 py-1.5 text-sm font-medium \
   brightness-90 hover:brightness-100\
   transition-all duration-fast shadow-sm active:animate-press \
   border border-border \
   outline-none focus:outline-none \
   focus-visible:ring-2 focus-visible:ring-fg/30 \
   focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--bg))] \
   ring-transparent ring-offset-transparent",
  {
    intent: {
      primary:
        "bg-primary text-primary-fg border-transparent \
          active:brightness-95 \
         focus-visible:ring-primary/40",

      neutral:
        "bg-bg-light/90 text-fg border-border/60 \
          active:bg-bg/90  \
         focus-visible:ring-fg/30",

      ghost:
        "bg-transparent text-fg border-border \
          active:bg-bg-light/80  \
         focus-visible:ring-fg/25",

      success:
        "bg-success text-success-fg border-transparent \
          active:brightness-95 \
         focus-visible:ring-success/35",

      warning:
        "bg-warning text-warning-fg border-transparent \
          active:brightness-95 \
         focus-visible:ring-warning/35",

      info:
        "bg-info text-info-fg border-transparent \
         active:brightness-95 \
         focus-visible:ring-info/35",

      danger:
        "bg-danger text-danger-fg border-transparent \
          active:brightness-95 \
         focus-visible:ring-danger/40",
    },
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
  { intent: "primary", size: "sm", tone: "default", disabled: "false" }
);

/**
 * Button component - polymorphic button with intent, size, and tone variants
 * 
 * @example
 * ```tsx
 * <Button intent="primary" size="md">Click me</Button>
 * <Button as="a" href="/about" intent="neutral">Link Button</Button>
 * ```
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

  // Only add disabled prop for actual button elements
  const buttonProps = Component === 'button'
    ? { disabled, ...props }
    : props;

  return (
    <Component className={buttonClass} {...buttonProps}>
      {children}
    </Component>
  );
}
