import * as React from "react";
import type { DemoManifest, DisplayMode } from "./types";

interface GridOverlayProps {
  manifest: DemoManifest;
  currentMode: DisplayMode;
}

/**
 * GridOverlay - Dev-only visual guide for the active display mode.
 * Activated via hotkey in DemoWrapper (Alt + Shift + G).
 * No buttons or interactive controls here (pure overlay).
 */
export function GridOverlay({ manifest, currentMode }: GridOverlayProps) {
  const display = manifest.display ?? {};

  // Derive sizes per mode with safe fallbacks
  // CARD
  const cardCfg = display.card as any;
  const cardW = Number(cardCfg?.width) || 800;
  const cardH = Number(cardCfg?.height) || Math.round(cardW / (2 / 2.5)); // default aspect 2/2.5
  const cardZoom = Number(cardCfg?.zoom) || 1;

  // EMBED
  const embedCfg = display.embed as any;
  const embedW = Number(embedCfg?.maxWidth) || 1200;
  const embedH = Number(embedCfg?.minHeight) || 600;
  const embedZoom = Number(embedCfg?.zoom) || 1;
  const embedScroll = !!embedCfg?.allowScroll;
  const embedView = (embedCfg?.defaultView as string) || "fit";

  // FULL (often the container/viewport itself; if disabled we won't render it)
  const fullCfg = display.full as any;
  const fullEnabled = fullCfg?.enabled !== false; // default true if unspecified
  const fullMinW = Number(fullCfg?.minWidth) || 0;
  const fullMinH = Number(fullCfg?.minHeight) || 0;

  // Select the active frame based on currentMode
  const isCard = currentMode === "card";
  const isEmbed = currentMode === "embed";
  const isFull = currentMode === "full";

  // Visual tokens per mode
  const palette = isCard
    ? { border: "border-blue-500/60", fill: "bg-blue-500/5", tag: "text-blue-400", label: "Card View" }
    : isEmbed
      ? { border: "border-green-500/60", fill: "bg-green-500/5", tag: "text-green-400", label: "Embed View" }
      : { border: "border-purple-500/60", fill: "bg-purple-500/5", tag: "text-purple-400", label: "Full View" };

  // Frame style per mode
  const frameStyle: React.CSSProperties = isCard
    ? {
      width: "min(90vw, 400px)", // mirrors typical card preview bound
      height: `${Math.min(cardH * cardZoom, 300)}px`, // keep reasonable height on small screens
    }
    : isEmbed
      ? {
        width: `min(${embedW}px, 90vw)`,
        height: `min(${embedH}px, 80vh)`,
      }
      : {
        // full mode: illustrate minimums (if any) but generally show a large viewport box
        width: fullMinW ? `min(${fullMinW}px, 95vw)` : "95vw",
        height: fullMinH ? `min(${fullMinH}px, 85vh)` : "85vh",
      };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]" aria-hidden="true">
      {/* soft backdrop */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />

      {/* info panel */}
      <div className="absolute top-4 right-4 bg-bg-dark/95 border border-border text-fg rounded-lg p-3 text-xs font-mono shadow-lg max-w-xs">
        <div className="font-bold text-brand-cyan mb-2 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-brand-cyan rounded-full animate-pulse" />
          Grid Overlay Active
        </div>

        <div className="space-y-1 text-fg/80">
          <div><span className="text-fg/60">Mode:</span> {currentMode}</div>
          <div><span className="text-fg/60">Kind:</span> {manifest.kind || "experiment"}</div>

          {isCard && (
            <div className="border-t border-border/30 my-2 pt-2">
              <div className={`${palette.tag} font-semibold mb-1`}>{palette.label}</div>
              <div><span className="text-fg/60">Base W×H:</span> {cardW}×{cardH}px</div>
              <div><span className="text-fg/60">Zoom:</span> {cardZoom}x</div>
              <div><span className="text-fg/60">Aspect (fallback):</span> 2 / 2.5</div>
            </div>
          )}

          {isEmbed && (
            <div className="border-t border-border/30 my-2 pt-2">
              <div className={`${palette.tag} font-semibold mb-1`}>{palette.label}</div>
              <div><span className="text-fg/60">Max W:</span> {embedW}px</div>
              <div><span className="text-fg/60">Min H:</span> {embedH}px</div>
              <div><span className="text-fg/60">Zoom:</span> {embedZoom}x</div>
              <div><span className="text-fg/60">Scroll:</span> {embedScroll ? "yes" : "no"}</div>
              <div><span className="text-fg/60">View:</span> {embedView}</div>
            </div>
          )}

          {isFull && (
            <div className="border-t border-border/30 my-2 pt-2">
              <div className={`${palette.tag} font-semibold mb-1`}>{palette.label}</div>
              <div><span className="text-fg/60">Enabled:</span> {fullEnabled ? "yes" : "no"}</div>
              <div><span className="text-fg/60">Min W×H:</span> {fullMinW}×{fullMinH}px</div>
            </div>
          )}
        </div>

        <div className="mt-3 pt-2 border-t border-border/30 text-fg/60 text-[10px]">
          Press <kbd className="px-1 py-0.5 bg-bg rounded border border-border">Alt+Shift+G</kbd> to hide
        </div>
      </div>

      {/* active frame */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          style={frameStyle}
          className={`relative ${palette.fill} border-2 ${palette.border}`}
        >
          {/* label */}
          <div className={`absolute -top-6 left-0 text-xs font-mono ${palette.tag} bg-bg-dark/90 px-2 py-1 rounded border border-border/40`}>
            {isCard && `Card Zone (${cardW}×${cardH}px @ ${cardZoom}x)`}
            {isEmbed && `Embed Zone (${embedW}×${embedH}px @ ${embedZoom}x)`}
            {isFull && `Full Zone (min ${fullMinW}×${fullMinH}px)`}
          </div>

          {/* thirds guides */}
          <div className="absolute inset-0">
            {/* vertical thirds */}
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-current/20" />
            <div className="absolute top-0 bottom-0 left-2/3 w-px bg-current/20" />
            {/* horizontal thirds */}
            <div className="absolute left-0 right-0 top-1/3 h-px bg-current/20" />
            <div className="absolute left-0 right-0 top-2/3 h-px bg-current/20" />
          </div>

          {/* center crosshair */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-current/40 rounded-full" />
            <div className="absolute w-12 h-0.5 bg-current/40" />
            <div className="absolute w-0.5 h-12 bg-current/40" />
          </div>

          {/* corner markers */}
          {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-4 h-4 border-2 border-current/60`} />
          ))}
        </div>
      </div>

      {/* global grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          color: "var(--color-brand-cyan)",
        }}
      />
    </div>
  );
}
