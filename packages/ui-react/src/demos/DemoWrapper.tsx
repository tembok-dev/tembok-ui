import * as React from "react";
import { GridOverlay } from "./GridOverlay";
import type { DemoWrapperProps } from "./types";
import { ToastProvider } from "../Toast";

export function DemoWrapper({
  Component,
  mode,
  manifest,
  className = "",
  isDev = false,
  componentProps = {},
}: DemoWrapperProps) {
  const [showGrid, setShowGrid] = React.useState(false);

  // 🔁 Use ref to avoid stale closures in hot reload
  const toggleRef = React.useRef<() => void>(() => { });
  toggleRef.current = () => setShowGrid((s) => !s);

  // 🎹 Alt + Shift + G to toggle grid overlay
  React.useEffect(() => {
    if (!isDev) return;

    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore AltGraph (common on intl layouts)
      if (e.getModifierState?.("AltGraph")) return;

      const modOK = e.altKey && e.shiftKey; // 👈 changed to Alt + Shift
      const isG = e.code === "KeyG"; // layout-independent

      if (modOK && isG) {
        e.preventDefault();
        toggleRef.current();
      }
    };

    document.addEventListener("keydown", onKeyDown, { capture: true });
    return () => document.removeEventListener("keydown", onKeyDown, { capture: true } as any);
  }, [isDev]);

  // 🧭 Dev-only fallback button (handy when focus traps keys)
  const DevToggle =
    isDev && (
      <button
        type="button"
        onClick={() => setShowGrid((s) => !s)}
        title="Toggle grid (Alt + Shift + G)"
        className="pointer-events-auto fixed bottom-4 right-4 z-[9999] rounded-full border border-border/50 bg-bg/80 px-3 py-1.5 text-xs text-fg/80 backdrop-blur hover:bg-bg/95"
      >
        Grid: {showGrid ? "ON" : "OFF"}
      </button>
    );

  // 🧩 Pass layout props to the demo
  const derivedProps = React.useMemo(() => {
    const props: Record<string, any> = { ...componentProps };
    if (mode === "card") {
      props.embedded = true;
      props.compact = true;
    } else if (mode === "embed") {
      props.embedded = true;
      props.compact = false;
    } else {
      props.embedded = false;
      props.compact = false;
    }
    return props;
  }, [mode, componentProps]);

  return (
    <ToastProvider>
      <div className={`demo-wrapper relative w-full h-full ${className}`}>
        <Component {...derivedProps} />
        {isDev && DevToggle}
        {showGrid && <GridOverlay manifest={manifest} currentMode={mode} />}
      </div>
    </ToastProvider>
  );
}

export default DemoWrapper;
