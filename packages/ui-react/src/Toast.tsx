// TdsToast.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2 } from "./icons/CheckCircle2";
import { AlertTriangle } from "./icons/AlertTrianglle";
import { Info } from "./icons/Info";
import { XCircle } from "./icons/XCircle";



/**
 * TDS Toasts — minimal usage guide
 *
 * 1) Wrap your app once:
 *    ---------------------------------------------------------
 *    import { ToastProvider } from "@/components/TdsToast";
 *
 *    export function App() {
 *      return (
 *        <ToastProvider>
 *          <Routes />
 *        </ToastProvider>
 *      );
 *    }
 *
 * 2) Fire a toast inside any React component:
 *    ---------------------------------------------------------
 *    import { useToast } from "@/components/TdsToast";
 *
 *    function SaveButton() {
 *      const { show } = useToast();
 *      return (
 *        <button
 *          onClick={() =>
 *            show({
 *              title: "Saved",
 *              description: "Your changes are safe.",
 *              intent: "success",           // "success" | "warning" | "danger" | "neutral"
 *              duration: 3000,              // ms; omit or ≤0 to keep it on screen
 *              canClose: true,              // show the X button
 *            })
 *          }
 *        >
 *          Save
 *        </button>
 *      );
 *    }
 *
 * 3) Or use the convenience helpers for intent-specific calls:
 *    ---------------------------------------------------------
 *    import { useToast, toast } from "@/components/TdsToast";
 *
 *    function Form() {
 *      const ctx = useToast();
 *      const handleError = () =>
 *        toast.danger(ctx, { title: "Failed", description: "Try again." });
 *      return <button onClick={handleError}>Submit</button>;
 *    }
 *
 * 4) Trigger a toast from non-React code (utilities, n8n handlers, etc.):
 *    ---------------------------------------------------------
 *    import { toastFromAnywhere } from "@/components/TdsToast";
 *
 *    // Works after <ToastProvider> mounts
 *    toastFromAnywhere({ title: "Synced", intent: "success", duration: 2000 });
 *
 * 5) Dismiss or clear:
 *    ---------------------------------------------------------
 *    const { dismiss, clear, show } = useToast();
 *    const id = show({ title: "Sticky", duration: 0, canClose: true });
 *    // later...
 *    dismiss(id);   // removes one
 *    clear();       // removes all
 *
 * A11y: role="status" for neutral/success/warning and role="alert" for danger.
 * Styling: Uses TDS tokens via Tailwind classes; appears bottom-right; pointer-events on.
 *
 * Gotchas:
 * - Ensure <ToastProvider> is mounted before calling toastFromAnywhere.
 * - If you need older browsers, polyfill crypto.randomUUID().
 * - Long text is truncated (title) and line-clamped (description).
 */


/* ========= Types ========= */
type Intent = "success" | "warning" | "danger" | "neutral";

type Toast = {
    id: string;
    title?: string;
    description?: string;
    intent?: Intent;
    duration?: number; // ms
    canClose?: boolean;
};

type ToastInput = Omit<Toast, "id">;

/* ========= Context ========= */
type ToastCtx = {
    show: (t: ToastInput) => string;
    dismiss: (id: string) => void;
    clear: () => void;
};
const ToastContext = createContext<ToastCtx | null>(null);

/* ========= Provider / Hook ========= */

//To use toast outside react components
let _externalShow: ((t: Omit<Toast, "id">) => string) | null = null;

/** Call this safely from anywhere (e.g. utilities, n8n actions) */
export function toastFromAnywhere(input: Omit<Toast, "id">) {
    if (_externalShow) return _externalShow(input);
    console.warn("ToastProvider not yet mounted, toast ignored:", input.title);
    return "";
}

export function ToastProvider({ children }: { children: React.ReactNode }) {


    const [toasts, setToasts] = useState<Toast[]>([]);

    const show = useCallback((t: ToastInput) => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, duration: 4000, intent: "neutral", canClose: true, ...t }]);
        return id;
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const clear = useCallback(() => setToasts([]), []);

    const value = useMemo(() => ({ show, dismiss, clear }), [show, dismiss, clear]);

    useEffect(() => {
        _externalShow = show;
        return () => {
            _externalShow = null;
        };
    }, [show]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Toaster toasts={toasts} onDismiss={dismiss} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
    return ctx;
}

/* ========= Presentation ========= */

function Toaster({
    toasts,
    onDismiss,
}: {
    toasts: Toast[];
    onDismiss: (id: string) => void;
}) {
    return (
        <div
            className="
        pointer-events-none fixed right-4 bottom-4 z-[9999]
        flex w-[min(420px,calc(100vw-1.5rem))] flex-col gap-2
      "
            aria-live="polite"
            aria-atomic="false"
        >
            {toasts.map((t) => (
                <ToastCard key={t.id} toast={t} onDismiss={onDismiss} />
            ))}
        </div>
    );
}

function ToastCard({
    toast,
    onDismiss,
}: {
    toast: Toast;
    onDismiss: (id: string) => void;
}) {
    const { id, title, description, intent = "neutral", duration = 4000, canClose = true } = toast;
    const timerRef = useRef<number | null>(null);
    const [hover, setHover] = useState(false);
    const [mount, setMount] = useState(false);

    // Auto-close (pauses on hover)
    useEffect(() => {
        setMount(true);
        if (duration <= 0) return;
        if (hover) return;
        timerRef.current = window.setTimeout(() => onDismiss(id), duration);
        return () => {
            if (timerRef.current) window.clearTimeout(timerRef.current);
        };
    }, [id, duration, hover, onDismiss]);

    const styles = intentStyles[intent];

    return (
        <div
            role={intent === "danger" ? "alert" : "status"}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={[
                "pointer-events-auto rounded-2xl border ",
                "bg-bg/85 border-border/40 backdrop-blur-md shadow-elevation-high",
                "text-sm text-fg/90",
                "transition-all duration-200 ease-out",
                mount ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                "[&>div]:min-w-0", // fix text overflow
            ].join(" ")}
        >
            <div className="grid grid-cols-[auto_1fr_auto] items-start gap-3 p-3">
                {/* Intent icon */}
                <span
                    className={[
                        "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-1",
                        styles.iconWrap,
                    ].join(" ")}
                    aria-hidden
                >
                    {intentIcon[intent]}
                </span>

                {/* Text */}
                <div className="min-w-0">
                    {title && <p className="truncate text-[0.95rem] font-semibold">{title}</p>}
                    {description && <p className="mt-0.5 line-clamp-3 text-fg/70">{description}</p>}
                </div>

                {/* Close */}
                {canClose && (
                    <button
                        onClick={() => onDismiss(id)}
                        className="ml-1 rounded-lg p-1 text-fg/60 hover:bg-fg/5 hover:text-fg/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/40"
                        aria-label="Close notification"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M6 6l12 12m0-12L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Subtle intent bar */}
            <div className={["h-1 w-full rounded-b-2xl", styles.bar].join(" ")} />
        </div>
    );
}

/* ========= Styling helpers (TDS-ish tokens) ========= */

const intentStyles: Record<
    Intent,
    { iconWrap: string; bar: string }
> = {
    success: {
        iconWrap: "bg-success/10 text-success ring-success/20",
        bar: "bg-success/40",
    },
    warning: {
        iconWrap: "bg-warning/10 text-warning ring-warning/20",
        bar: "bg-warning/40",
    },
    danger: {
        iconWrap: "bg-danger/10 text-danger ring-danger/20",
        bar: "bg-danger/40",
    },
    neutral: {
        iconWrap: "bg-fg/10 text-fg/70 ring-border/40",
        bar: "bg-border/60",
    },
};

const intentIcon: Record<Intent, React.ReactNode> = {
    success: <CheckCircle2 className="h-4 w-4" aria-hidden />,
    warning: <AlertTriangle className="h-4 w-4" aria-hidden />,
    danger: <XCircle className="h-4 w-4" aria-hidden />,
    neutral: <Info className="h-4 w-4" aria-hidden />,
};

/* ========= Convenience helpers ========= */
// Optional: tiny helpers to keep call-sites clean
export const toast = {
    success: (ctx: ToastCtx, opts: Omit<ToastInput, "intent">) => ctx.show({ intent: "success", ...opts }),
    warning: (ctx: ToastCtx, opts: Omit<ToastInput, "intent">) => ctx.show({ intent: "warning", ...opts }),
    danger: (ctx: ToastCtx, opts: Omit<ToastInput, "intent">) => ctx.show({ intent: "danger", ...opts }),
    info: (ctx: ToastCtx, opts: Omit<ToastInput, "intent">) => ctx.show({ intent: "neutral", ...opts }),
};
