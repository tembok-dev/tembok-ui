import * as React from "react";
import { TembokLogo } from "../TembokLogo";

export interface ToolLayoutProps {
  /** App/tool title */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Optional icon/logo component */
  icon?: React.ReactNode;
  /** Header actions (buttons, switches) */
  actions?: React.ReactNode;
  /** Main content area */
  children: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Display mode affects styling */
  mode?: "embed" | "full";
  /** Custom app URL */
  appUrl?: string;
}

/**
 * ToolLayout - Reusable layout for tool-type demos
 * Provides CarPlay-like aesthetic with header, footer, and glassmorphic design
 * Based on the GPS converter's SimpleLayout but generalized
 */
export function ToolLayout({
  title,
  subtitle,
  icon,
  actions,
  children,
  footer,
  mode = "embed",
  appUrl = "https://play.tembok.app",
}: ToolLayoutProps) {
  const isEmbed = mode === "embed";
  const isFull = mode === "full";

  return (
    <section
      className={[
        "mx-auto w-full max-w-[1100px]",
        "p-4 sm:p-6",
        "rounded-2xl border border-border/40",
        "bg-bg-dark backdrop-blur-sm shadow-elevation-medium",
        "relative",
      ].join(" ")}
    >
      {/* Header - hidden in embed mode if desired */}
      {(isFull || !isEmbed) && (
        <header className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            {/* Icon/Logo */}
            {icon && (
              <div
                aria-hidden
                className="grid place-items-center size-9 rounded-xl bg-brand-cyan/15 ring-1 ring-brand-cyan/25"
              >
                {icon}
              </div>
            )}

            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-fg">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-fg/70">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {actions}
            {isFull && (
              <a
                href={appUrl}
                className="hidden sm:inline-flex items-center gap-1 rounded-lg px-3 py-1.5
                       bg-bg/60 border border-border/50 text-sm text-fg/80
                       hover:text-fg hover:border-border transition ease-hover"
                title="Visit playground"
              >
                Playground →
              </a>
            )}
          </div>
        </header>
      )}

      {/* Body */}
      <div className={isEmbed ? "mt-0" : "mt-4 sm:mt-6"}>{children}</div>

      {/* Footer - hidden in embed mode */}
      {(isFull || !isEmbed) && (
        <footer className="mt-6 sm:mt-8 pt-3 border-t border-border/40 text-xs text-fg/70 flex items-center justify-between">
          {footer ? (
            footer
          ) : (
            <>
              <span className="flex items-center gap-1">
                <span>Built by</span>
                <a
                  title="Tembok Dev Playground"
                  href="https://play.tembok.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="translate-y-0.5"
                >
                  <TembokLogo size="sm" />
                </a>
              </span>
              <a
                className="underline hover:text-fg"
                href="https://tembok.app"
                target="_blank"
                rel="noreferrer"
              >
                tembok.app
              </a>
            </>
          )}
        </footer>
      )}
    </section>
  );
}

export default ToolLayout;
