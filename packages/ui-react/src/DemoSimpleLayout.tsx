import * as React from "react";

type DemoSimpleLayoutProps = {
  /** App name or demo title, e.g., "GPS Converter" */
  title: string;
  /** Optional short description under the title */
  subtitle?: string;
  /** Right-side header actions (buttons, links, etc.) */
  actions?: React.ReactNode;

  /** Main content area (forms, results, cards) */
  children: React.ReactNode;

  /**
   * Secondary panel (usually a Map).
   * On wide viewports it's on the right; on narrow it stacks below.
   */
  side?: React.ReactNode;

  /** Optional footer content (e.g., limit banner, legal) */
  footer?: React.ReactNode;

  /**
   * Layout density:
   * - "embedded": compact paddings, tighter radii (for iframes/cards)
   * - "expanded": roomier paddings (tablet/desktop)
   */
  variant?: "embedded" | "expanded";

  /**
   * Controls the split width. "balanced" -> 45/55, "left" -> 55/45 (content heavy),
   * "right" -> 35/65 (map heavy).
   */
  emphasis?: "balanced" | "left" | "right";

  /**
   * Optional max width clamp for the whole container (useful in pages).
   * Defaults to 1200px.
   */
  maxWidthClass?: string;

  /**
   * When true, places a subtle grid + glass effect behind content for a cockpit vibe.
   * Keep tasteful.
   */
  withGlass?: boolean;
};

const PAD = {
  embedded: "p-3 sm:p-4",
  expanded: "p-4 sm:p-6",
} as const;

const GAP = {
  embedded: "gap-3 sm:gap-4",
  expanded: "gap-4 sm:gap-6",
} as const;

const RADIUS = {
  embedded: "rounded-xl",
  expanded: "rounded-2xl",
} as const;

const EMPHASIS_GRID = {
  balanced:
    // min 320px left; grows to ~45%, right takes the rest
    "grid-cols-1 lg:[grid-template-columns:minmax(320px,0.45fr)_1fr]",
  left:
    // left heavier (~55%)
    "grid-cols-1 lg:[grid-template-columns:minmax(360px,0.55fr)_1fr]",
  right:
    // right heavier (~65%) – great for map-first
    "grid-cols-1 lg:[grid-template-columns:minmax(300px,0.35fr)_1fr]",
} as const;

/** A slim section title + subtitle block used in the header. */
function TitleBlock({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="min-w-0">
      <h1 className="text-base sm:text-lg font-semibold tracking-tight text-fg">
        {title}
      </h1>
      {subtitle ? (
        <p className="text-xs sm:text-sm text-fg/70">{subtitle}</p>
      ) : null}
    </div>
  );
}

/**
 * DemoSimpleLayout
 * - Dark-first, CarPlay-like, instrument-panel feel.
 * - Zero external style deps beyond Tailwind + your TDS tokens.
 */
export function DemoSimpleLayout({
  title,
  subtitle,
  actions,
  children,
  side,
  footer,
  variant = "embedded",
  emphasis = "right",
  maxWidthClass = "max-w-[1200px]",
  withGlass = true,
}: DemoSimpleLayoutProps) {
  const pad = PAD[variant];
  const gap = GAP[variant];
  const radius = RADIUS[variant];
  const grid = EMPHASIS_GRID[emphasis];

  return (
    <section
      className={[
        // outer clamp + breathing room
        "mx-auto w-full", maxWidthClass, pad, gap,
        // gentle card shell
        "bg-bg/60 dark:bg-bg-dark/60 backdrop-blur-sm",
        "border border-fg/10 shadow-elevation-medium", radius,
      ].join(" ")}
      role="region"
      aria-label={title}
    >
      {/* Optional cockpit texture */}
      {withGlass && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 ${radius} overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-[0.035] [background:radial-gradient(circle_at_50%_50%,transparent_0,transparent_2px,hsl(var(--brand-ink)/0.2)_2px)] [background-size:8px_8px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 dark:to-white/5" />
        </div>
      )}

      {/* Header */}
      <header
        className={[
          "relative z-10 flex items-center justify-between",
          pad, "pt-0", // avoid double top padding; outer section has base padding
        ].join(" ")}
      >
        <TitleBlock title={title} subtitle={subtitle} />
        {actions ? (
          <div className="flex items-center gap-2">{actions}</div>
        ) : null}
      </header>

      {/* Body grid */}
      <div
        className={[
          "relative z-10 grid", grid, gap,
          "px-2 sm:px-4 pb-2 sm:pb-4",
        ].join(" ")}
      >
        {/* LEFT: main content */}
        <div
          className={[
            "min-h-[220px]",
            "bg-bg-light/60 dark:bg-bg-dark/60",
            "border border-fg/10", "shadow-elevation-low", radius,
            "p-3 sm:p-4",
          ].join(" ")}
        >
          {children}
        </div>

        {/* RIGHT: side/map */}
        {side ? (
          <div
            className={[
              "min-h-[260px]",
              "bg-bg-light/60 dark:bg-bg-dark/60",
              "border border-fg/10", "shadow-elevation-low", radius,
              "overflow-hidden p-0", // map wants edge-to-edge
            ].join(" ")}
          >
            {side}
          </div>
        ) : null}
      </div>

      {/* Footer (limit banners, tiny text, etc.) */}
      {footer ? (
        <footer className={["relative z-10 px-3 sm:px-4 pb-3 sm:pb-4"].join(" ")}>
          <div
            className={[
              "flex items-center justify-between",
              "text-xs sm:text-sm text-fg/70",
            ].join(" ")}
          >
            {footer}
          </div>
        </footer>
      ) : null}
    </section>
  );
}

export default DemoSimpleLayout;
