// src/Loaders.tsx
// Reusable loaders without Tailwind dependency

import "./styles/components/loaders.css";

type LoaderKind = "energyspin" | "spintrail";
type LoaderSize = "sm" | "md" | "lg";

interface LoadersProps {
    type?: LoaderKind;
    size?: LoaderSize;
    color?: string; // HEX or any CSS color
}

const sizeToClass: Record<LoaderSize, string> = {
    sm: "loader-size-sm",
    md: "loader-size-md",
    lg: "loader-size-lg",
};

export function Loaders({
    type = "energyspin",
    size = "md",
    color = "#E72AAE",
}: LoadersProps) {
    const sizeClass = sizeToClass[size] ?? sizeToClass.md;
    const loaderColor = color || "#E72AAE";

    if (type === "spintrail") {
        return <SpinTrail sizeClass={sizeClass} color={loaderColor} />;
    }

    return <EnergySpin sizeClass={sizeClass} color={loaderColor} />;
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
