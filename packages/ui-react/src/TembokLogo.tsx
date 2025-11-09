// components/TembokLogo.tsx
import React, { forwardRef, memo } from "react";


/**
 * 🏗️ TembokLogo — React SVG component (wordmark + symbol)
 * 
 * Usage:
 *   <TembokLogo size="sm" />
 *   <TembokLogo size="lg" tone="light" animateOnHover={false} className="opacity-90" />
 *
 * Props:
 *   - alt?: string                → Accessible label
 *   - size?: "sm" | "md" | "lg" | number → Controls height
 *   - tone?: "auto" | "light" | "dark"   → Force color mode or inherit
 *   - animateOnHover?: boolean    → Enable/disable hover color cycle (default: true)
 *   - className?: string          → Additional Tailwind classes
 *
 * Notes:
 *   - fill="currentColor" means it inherits the parent text color.
 *   - `block w-auto shrink-0 leading-none` prevents spacing issues inline.
 *   - If extra space appears, ensure viewBox fits the artwork tightly.
 */

type Size = "sm" | "md" | "lg" | number;
type Tone = "auto" | "light" | "dark";

export type TembokLogoProps = {
    /** Accessible label */
    alt?: string;
    /** Controls height. If number, treated as px height. */
    size?: Size;
    /** Inherit color (auto), or force light/dark text */
    tone?: Tone;
    /** Run the color-cycle animation on hover */
    animateOnHover?: boolean;
    /** Extra classes */
    className?: string;
    /** Spread any SVG props (e.g., role, aria-*) */
} & React.SVGProps<SVGSVGElement>;

function sizeToStyle(size: Size) {
    if (typeof size === "number") return { height: `${size}px` };
    switch (size) {
        case "sm":
            return { height: "20px" }; // ~h-5
        case "md":
            return { height: "24px" }; // ~h-6
        case "lg":
            return { height: "28px" }; // ~h-7
        default:
            return { height: "24px" };
    }
}

function toneToClass(tone: Tone) {
    if (tone === "light") return "text-white";
    if (tone === "dark") return "text-black";
    return ""; // inherit current text color
}

export const TembokLogo = memo(
    forwardRef<SVGSVGElement, TembokLogoProps>(function TembokLogo(
        {
            alt = "Tembok Panama wordmark",
            size = "md",
            tone = "auto",
            animateOnHover = true,
            className = "",
            ...attrs
        },
        ref
    ) {
        const sizeStyle = sizeToStyle(size);
        const toneClass = toneToClass(tone);

        // We use a wrapper `group` so we can drive hover state via `group-hover:*`
        // Symbol has a smooth color transition even when hover ends.
        // The animation uses custom @keyframes defined below.
        return (
            <div
                className="inline-block group leading-none"
                aria-hidden={attrs["aria-hidden"] as any}
            >
                {/* Scoped keyframes for the logo */}
                <style>
                    {`
            @keyframes tembokColorCycle {
              0%   { color: hsl(var(--fg)); }
              25%  { color: hsl(var(--brand-red-ui)); }
              50%  { color: hsl(var(--brand-cyan-ui)); }
              75%  { color: hsl(var(--brand-lime-ui)); }
              100% { color: hsl(var(--fg)); }
            }
          `}
                </style>

                <svg
                    ref={ref}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 378.15499 111.78466"
                    role="img"
                    aria-label={alt}
                    fill="currentColor"
                    // Defaults first; user classes last so they can override
                    className={[
                        "tembok-logo w-auto fill-current transition-all",
                        toneClass,
                        className,
                    ].join(" ")}
                    style={sizeStyle}
                    {...attrs}
                >
                    <g transform="translate(1305.9557,-2410.6256)">
                        <g transform="translate(-1923.8427,678.25489)">
                            <g
                                aria-label="TEMBOK"
                                transform="matrix(0.78913918,0,0,0.78913918,367.9903,-236.92374)"
                                className="group-hover:brightness-110 transition-color"
                            >
                                <path
                                    aria-label="T"
                                    d="m382.38546,2547.9328-9.8643-11.2386a6.6248192,6.6248192,0,0,0-4.97898-2.2547h-49.83124a1.3552494,1.3552494,0,0,0-1.01693,2.2511l9.89128,11.2282a6.6513119,6.6513119,0,0,0,4.98307,2.2546l12.2383,0.014v44.7187a3,3,0,0,0,3,3h10.89063a3,3,0,0,0,3-3v-44.7207h14.06366h2.43945l4.16404,0.0009a1.358124,1.358124,0,0,0,1.02102-2.254z"
                                ></path>
                                <path
                                    aria-label="E"
                                    d="m399.71484,2558.9688h-13.65429a3,3,0,0,0-3,3v32.9394a3,3,0,0,0,3,3h35.14453a3,3,0,0,0,3-3v-9.7891a3,3,0,0,0-3-3h-21.49024v-9.0937H416.875a3,3,0,0,0,3-3v-8.0566a3,3,0,0,0-3-3z"
                                ></path>
                                <path
                                    aria-label="M"
                                    d="m388.22129,2536.7161l9.53984,11.1167a6.5276931,6.5276931,0,0,0,4.95371,2.2766h18.49024a3,3,0,0,0,3-3v-9.6699a3,3,0,0,0-3-3h-31.9375a1.3787413,1.3787413,0,0,0-1.04629,2.2766z"
                                ></path>
                                <path
                                    aria-label="B"
                                    d="m494.78016,2536.0221-24.65163,33.7715a1.4586612,1.4586612,0,0,1-2.35638,0l-24.65169-33.7715a3.9326953,3.9326953,0,0,0-3.17647-1.614h-0.71812a3.9965674,3.9965674,0,0,0-3.99657,3.9966v55.507a3.9965674,3.9965674,0,0,0,3.99657,3.9966h8.71125a3.9965674,3.9965674,0,0,0,3.99657-3.9966v-20.943l15.8759,22.2589a1.4236164,1.4236164,0,0,0,2.31894,0l15.83853-22.2577v20.943a3.9965674,3.9965674,0,0,0,3.99657,3.9966h8.71131a3.9965674,3.9965674,0,0,0,3.99657-3.9966v-55.507a3.9965674,3.9965674,0,0,0-3.99657-3.9966h-0.71831a3.9326896,3.9326896,0,0,0-3.17647,1.614z"
                                ></path>
                                <path
                                    d="m547.55645,2562.1576c2.59862,0,6.92963-4.6854,6.92963-11.2212,0-8.7408-8.42576-16.4973-19.92268-16.4973h-16.83587a4.0317888,4.0317888,0,0,0-4.03179,4.0318v55.4056a4.0317888,4.0317888,0,0,0,4.03179,4.0318h23.05679c12.71747,0,21.1433-9.3314,21.1433-19.3715,0-9.5677-7.59898-16.3792-14.37117-16.3792zm-7.20521-8.1895c0,3.2679-2.75613,5.0791-6.4178,5.0791h-4.01607v-9.9614h4.1342c3.62229,0,6.29967,1.8112,6.29967,4.8823zm-2.12617,28.6241h-8.3077v-12.0481l8.42584,0.04c4.76409,0,7.44147,2.2442,7.44147,5.9453,0,4.1735-3.70105,6.0634-7.55961,6.0634z"
                                ></path>
                                <path
                                    d="m595.428,2534.4393a28,28,0,0,0-27.99944,27.9995v7.5016a28,28,0,0,0,27.99944,27.9995h7.50166a28,28,0,0,0,28.00192-27.9995v-7.5016a28,28,0,0,0-28.00192-27.9995h-3.74959zm1.83891,15.3449h3.82632c8.23005,0.9207,14.30291,7.7424,14.30291,16.4067,0,8.9385-6.51418,15.8988-15.1939,16.4066h-2.04186c-8.67973-0.5078-15.19637-7.4681-15.19637-16.4066,0-8.6643,6.07286-15.486,14.3029-16.4067z"
                                ></path>
                                <path
                                    d="m641.91415,2534.4394c-2.22702-0.0007-4.03287,1.8042-4.0332,4.0312v55.4063c0.0003,2.2187,1.7931,4.0202,4.01172,4.0312h9.80078c1.84745,0,3.5454-1.0154,4.4196-2.6428l5.75423-10.7126l6.65625,10c1.39565,2.0963,3.74724,3.3557,6.26562,3.3555h12.37109c1.71871-0.0004,2.74109-1.9187,1.78321-3.3457l-18.03321-26.8398l16.46108-30.6404c0.64206-1.1951-0.22361-2.6429-1.58022-2.6429h-13.37109c-1.84747,0-3.54545,1.0153-4.41977,2.6429l-13.30679,24.7692v-23.8555c0.00021-1.9643-1.59228-3.5567-3.55664-3.5566z"
                                ></path>
                            </g>
                            {/* The symbol we animate */}
                            <g
                                id="symbol"
                                // Smooth color transitions always:
                                className={[
                                    "transition-colors duration-[1500ms] ease-[var(--ease-hover)]",
                                    animateOnHover
                                        ? // Kick the keyframes only while hovering:
                                        "group-hover:[animation:tembokColorCycle_2.5s_var(--ease-reveal)_forwards]"
                                        : "",
                                ].join(" ")}
                                transform="matrix(0.54047467,0,0,0.54047467,666.89087,1130.4595)"
                            >
                                <path d="m502.52159,1118.5311-26.36133,28.877c-7.47408,8.1875-8.58831,20.5036-2.61719,29.8867l13.91797,21.8672c1.12918,1.7742,1.69336,3.7363,1.69336,5.7519v24.3692c0,2.016-0.56381,3.9753-1.69336,5.75l-13.91797,21.8711c-5.97188,9.3836-4.85779,21.7007,2.61719,29.8886l26.32813,28.8438c7.57111,8.2951,23.94841,5.6445,30.62695-5.4258l7.64258-12.6699c3.2275-0.6033,6.29044-1.8425,8.57813-4.2617l53.84375-60.75c7.76083-8.7564,7.76099-22.0934,0-30.8496l-52.66602-59.42c-2.54163-2.8677-5.19708-4.6257-8.17773-5.4082l-9.35742-13.08c-6.82295-10.9987-22.98763-13.4262-30.46104-5.2403zm17.85938,13.1406l47.66796,79.0234c2.3863,3.9562,2.3863,8.8546,0,12.8106l-47.66992,79.0156c-1.90611,3.1596-6.43415,3.5903-8.85351,0.9395l-24.375-26.7032c-3.01074-3.2982-3.43873-8.124-1.05274-11.873l13.91797-21.8672c2.62739-4.1288,4.01758-8.8871,4.01758-13.7402V1204.91c0.00016-4.8531-1.39002-9.6095-4.01758-13.7382l-13.91797-21.8672c-2.38569-3.7491-1.95784-8.573,1.05274-11.8711l23.62695-25.8828c4.234-4.638,8.32616-1.9962,9.60352,0.121z" />
                            </g>
                        </g>
                    </g>
                </svg>
            </div>
        );
    })
);

