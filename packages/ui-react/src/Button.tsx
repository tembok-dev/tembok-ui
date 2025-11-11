import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { variants, cx } from './utils/variants';

type Intent = 'primary' | 'neutral' | 'ghost' | 'success' | 'warning' | 'info' | 'danger';
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
  "tmbk-theme inline-flex items-center gap-2 select-none cursor-pointer rounded-lg " +
  "transition-all shadow-sm active:animate-press outline-none " +
  "focus-visible:ring-2 ring-offset-2 focus-visible:outline-none " +
  // ring/offset semánticos (nuestro shim provee fallback)
  "ring-primary ring-offset-bg border";

const cls = variants(base, {
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
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  },
  // Tones Tembok -> reasignan intent visual con clases semánticas
  tone: {
    default: "",
    ink: "bg-[color:var(--tmbk-brand-ink)]  text-[color:var(--tmbk-brand-ink-fg)]",
    red: "bg-[color:var(--tmbk-brand-red)]  text-[color:var(--tmbk-brand-red-fg)]",
    lime: "bg-[color:var(--tmbk-brand-lime)] text-[color:var(--tmbk-brand-lime-fg)]",
    cyan: "bg-[color:var(--tmbk-brand-cyan)] text-[color:var(--tmbk-brand-cyan-fg)]",
  },
  disabled: {
    true: "pointer-events-none opacity-60",
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
  const Component = as || 'button';
  const buttonClass = cx(
    cls({ intent, size, tone, disabled: String(disabled) }),
    className
  );
  const buttonProps = Component === 'button' ? { disabled, ...props } : props;

  return (
    <Component className={buttonClass} {...buttonProps}>
      {children}
    </Component>
  );
}
