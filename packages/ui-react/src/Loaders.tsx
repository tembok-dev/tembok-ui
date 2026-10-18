// src/Loaders.tsx
// Reusable loaders without Tailwind dependency

import "./styles/components/loaders.css";

export type LoaderKind = "energyspin" | "spintrail";
export type LoaderSize = "sm" | "md" | "lg";

/** Props for a decorative or labeled loading animation. */
export interface LoadersProps {
    /** Animation style. @defaultValue 'energyspin' */
    type?: LoaderKind;
    /** Size preset. @defaultValue 'md' */
    size?: LoaderSize;
    /** CSS color; defaults to the inherited --tmbk-primary theme token. */
    color?: string;
    /** Accessible loading status; omit when another nearby element already announces loading. */
    label?: string;
}

const sizeToClass: Record<LoaderSize, string> = {
    sm: "loader-size-sm",
    md: "loader-size-md",
    lg: "loader-size-lg",
};

/**
 * Reusable loading animation. Supply label to expose a screen-reader status;
 * omit label when a surrounding element already announces the loading state.
 * @example
 * <Loaders type="spintrail" size="sm" label="Loading results" />
 */
export function Loaders({
    type = "energyspin",
    size = "md",
    color = "var(--tmbk-primary, #475569)",
    label,
}: LoadersProps) {
    const sizeClass = sizeToClass[size] ?? sizeToClass.md;
    const loaderColor = color || "var(--tmbk-primary, #475569)";

    return <span role={label ? "status" : undefined} aria-label={label} aria-live={label ? "polite" : undefined} aria-hidden={label ? undefined : true} style={{display:"inline-flex"}}>
        {type === "spintrail" ? <SpinTrail sizeClass={sizeClass} color={loaderColor} /> : <EnergySpin sizeClass={sizeClass} color={loaderColor} />}
    </span>;
}

// Different loaders

function EnergySpin({
    sizeClass,
    color,
}: {
    sizeClass: string;
    color: string;
}) {
    return (
        <div
            className={`loader-shell ${sizeClass}`}
            style={{ ["--loader-color" as string]: color }}
        >
            <div className="energyspin-spinner">
                <div className="energyspin-ring energyspin-ring--glow" />
                <div className="energyspin-ring energyspin-ring--base" />
                <div className="energyspin-ring energyspin-ring--arc energyspin-ring--bright energyspin-rotate-40" style={{ filter: `brightness(5)` }} />
                <div className="energyspin-ring energyspin-ring--arc energyspin-ring--soft energyspin-rotate-20" style={{ filter: `brightness(2)` }} />
                <div className="energyspin-ring energyspin-ring--arc" />
            </div>
        </div>
    );
}

function SpinTrail({
    sizeClass,
    color,
}: {
    sizeClass: string;
    color: string;
}) {
    const DURATION = 900; // ms
    const COUNT = 5;
    const STEP = 55; // ms between trail dots

    function Dot({ i, blownOut }: { i: number; blownOut?: boolean }) {
        const t = i / (COUNT - 1); // 0=head -> 1=tail
        const opacity = 1 - t * 0.92;
        const blur = t * 2.2;
        const scale = 1 - t * 0.25;
        const brightness = blownOut ? 5 : 1 + (1 - t) * 2;

        return (
            <div
                className="spintrail-dot-wrapper"
                style={{
                    animation: "orbitEase 1100ms cubic-bezier(.45,0,.55,1) infinite",
                    animationDelay: `${-((COUNT - 1 - i) * STEP)}ms`,
                    transformOrigin: "50% 50%",
                }}
            >
                <div
                    className="spintrail-dot"
                    style={{
                        opacity,
                        transform: `translateY(0px) scale(${scale})`,
                        filter: `blur(${blur}px) brightness(${brightness})`,
                        boxShadow: blownOut ? `0 0 14px ${color}` : undefined,
                    }}
                />
            </div>
        );
    }

    function Comet() {
        return (
            <>
                {Array.from({ length: COUNT })
                    .map((_, i) => i)
                    .reverse()
                    .map((i) => (
                        <Dot key={i} i={i} blownOut={i === 0} />
                    ))}
            </>
        );
    }

    return (
        <div
            className={`loader-shell ${sizeClass}`}
            style={{ ["--loader-color" as string]: color }}
        >
            <div className="spintrail-shell">
                <div className="spintrail-layer">
                    <Comet />
                </div>
                <div className="spintrail-layer" style={{ transform: "rotate(180deg)" }}>
                    <Comet />
                </div>
            </div>
        </div>
    );
}
