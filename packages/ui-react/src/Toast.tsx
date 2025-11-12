// TdsToast.tsx — headless + token-styled
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CheckCircle2 } from "./icons/CheckCircle2";
import { AlertTriangle } from "./icons/AlertTrianglle";
import { Info } from "./icons/Info";
import { XCircle } from "./icons/XCircle";

/**
 * @example Minimal wiring
 *
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 *
 * const { show, dismiss, clear } = useToast();
 * show({ title: "Saved", description: "All set", intent: "success", duration: 3000 });
 *
 * Or from anywhere (after provider mounts):
 * toastFromAnywhere({ title: "Synced", intent: "success", duration: 2000 });
 */

type Intent = "success" | "warning" | "danger" | "neutral";

type Toast = {
  id: string;
  title?: string;
  description?: string;
  intent?: Intent;
  duration?: number; // ms; <=0 means sticky
  canClose?: boolean;
  className?: string; // optional extra class on the card
};

type ToastInput = Omit<Toast, "id"> & { className?: string };

type ToastCtx = {
  show: (t: ToastInput) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

const ToastContext = createContext<ToastCtx | null>(null);

// External (non-React) trigger
let _externalShow: ((t: Omit<Toast, "id">) => string) | null = null;
export function toastFromAnywhere(input: Omit<Toast, "id">) {
  if (_externalShow) return _externalShow(input);
  console.warn("ToastProvider not yet mounted, toast ignored:", input.title);
  return "";
}

export function ToastProvider({
  children,
  position = "br", // 'br' | 'bl' | 'tr' | 'tl'
}: {
  children: React.ReactNode;
  position?: "br" | "bl" | "tr" | "tl";
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((t: ToastInput) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [
      ...prev,
      { id, duration: 4000, intent: "neutral", canClose: true, ...t },
    ]);
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
      <Toaster toasts={toasts} onDismiss={dismiss} position={position} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

/* ========= Presenter ========= */

function Toaster({
  toasts,
  onDismiss,
  position,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
  position: "br" | "bl" | "tr" | "tl";
}) {
  return (
    <div
      className="tmbk-theme tmbk-toaster"
      data-position={position}
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
  const {
    id,
    title,
    description,
    intent = "neutral",
    duration = 4000,
    canClose = true,
    className,
  } = toast;
  const timerRef = useRef<number | null>(null);
  const [hover, setHover] = useState(false);
  const [mounted, setMounted] = useState(false);

  // auto-close with hover pause
  useEffect(() => {
    setMounted(true);
    if (duration <= 0) return;
    if (hover) return;
    timerRef.current = window.setTimeout(() => onDismiss(id), duration);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [id, duration, hover, onDismiss]);

  const role = intent === "danger" ? "alert" : "status";

  return (
    <div
      role={role}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={["tmbk-toast", className].filter(Boolean).join(" ")}
      data-intent={intent}
      data-state={mounted ? "open" : "closed"}
    >
      <div className="tmbk-toast-row">
        <span className="tmbk-toast-icon" aria-hidden>
          {intentIcon[intent]}
        </span>

        <div className="tmbk-toast-content">
          {title && <p className="tmbk-toast-title">{title}</p>}
          {description && <p className="tmbk-toast-desc">{description}</p>}
        </div>

        {canClose && (
          <button
            onClick={() => onDismiss(id)}
            className="tmbk-toast-close"
            aria-label="Close notification"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12m0-12L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="tmbk-toast-bar" />
    </div>
  );
}

/* ========= Icons by intent ========= */

const intentIcon: Record<Intent, React.ReactNode> = {
  success: <CheckCircle2 aria-hidden className="tmbk-toast-icon-svg" />,
  warning: <AlertTriangle aria-hidden className="tmbk-toast-icon-svg" />,
  danger: <XCircle aria-hidden className="tmbk-toast-icon-svg" />,
  neutral: <Info aria-hidden className="tmbk-toast-icon-svg" />,
};

/* ========= Convenience helpers ========= */

export const toast = {
  success: (ctx: ToastCtx, opts: Omit<ToastInput, "intent">) =>
    ctx.show({ intent: "success", ...opts }),
  warning: (ctx: ToastCtx, opts: Omit<ToastInput, "intent">) =>
    ctx.show({ intent: "warning", ...opts }),
  danger: (ctx: ToastCtx, opts: Omit<ToastInput, "intent">) =>
    ctx.show({ intent: "danger", ...opts }),
  info: (ctx: ToastCtx, opts: Omit<ToastInput, "intent">) =>
    ctx.show({ intent: "neutral", ...opts }),
};
