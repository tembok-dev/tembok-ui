// packages/tembok/tailwind-preset/index.js
/** @type {import('tailwindcss').Config} */
export default {
    theme: {
        extend: {
            colors: {
                /* Background scale + semantics */
                'bg-dark': 'hsl(var(--bg-dark) / <alpha-value>)',
                bg: 'hsl(var(--bg) / <alpha-value>)',
                'bg-light': 'hsl(var(--bg-light) / <alpha-value>)',
                fg: 'hsl(var(--fg) / <alpha-value>)',
                muted: 'hsl(var(--muted) / <alpha-value>)',
                border: 'hsl(var(--border) / <alpha-value>)',
                ring: 'hsl(var(--ring) / <alpha-value>)',

                /* Primary pair (dept-driven) */
                primary: 'hsl(var(--primary) / <alpha-value>)',
                'primary-fg': 'hsl(var(--primary-fg) / <alpha-value>)',

                /* Optional surfaces */
                card: 'hsl(var(--card))',
                'card-fg': 'hsl(var(--card-fg))',
                popover: 'hsl(var(--popover))',
                'popover-fg': 'hsl(var(--popover-fg))',
                accent: 'hsl(var(--accent))',
                'accent-fg': 'hsl(var(--accent-fg))',
                destructive: 'hsl(var(--destructive))',
                'destructive-fg': 'hsl(var(--destructive-fg))',

                /* Brands + their foreground companions (constants) */
                'brand-charcoal': 'hsl(var(--brand-charcoal))',
                'brand-charcoal-fg': 'hsl(var(--brand-charcoal-fg))',
                'brand-offwhite': 'hsl(var(--brand-offwhite))',
                'brand-offwhite-fg': 'hsl(var(--brand-offwhite-fg))',
                'brand-white': 'hsl(var(--brand-white))',
                'brand-white-fg': 'hsl(var(--brand-white-fg))',
                'brand-red': 'hsl(var(--brand-red))',
                'brand-red-fg': 'hsl(var(--brand-red-fg))',
                'brand-cyan': 'hsl(var(--brand-cyan))',
                'brand-cyan-fg': 'hsl(var(--brand-cyan-fg))',
                'brand-lime': 'hsl(var(--brand-lime))',
                'brand-lime-fg': 'hsl(var(--brand-lime-fg))',
                'brand-ink': 'hsl(var(--brand-ink))',
                'brand-ink-fg': 'hsl(var(--brand-ink-fg))',

                /* Theme-aware UI tokens (auto-switch between dark/light) */
                'brand-red-ui': 'hsl(var(--brand-red-ui) / <alpha-value>)',
                'brand-cyan-ui': 'hsl(var(--brand-cyan-ui) / <alpha-value>)',
                'brand-lime-ui': 'hsl(var(--brand-lime-ui) / <alpha-value>)',

                /* Light mode variants (explicit access regardless of theme) */
                'brand-red-light': 'hsl(var(--brand-red-light) / <alpha-value>)',
                'brand-cyan-light': 'hsl(var(--brand-cyan-light) / <alpha-value>)',
                'brand-lime-light': 'hsl(var(--brand-lime-light) / <alpha-value>)',

                /* Soft variants (chips/badges) */
                'brand-red-soft': 'hsl(var(--brand-red-soft) / <alpha-value>)',
                'brand-cyan-soft': 'hsl(var(--brand-cyan-soft) / <alpha-value>)',
                'brand-lime-soft': 'hsl(var(--brand-lime-soft) / <alpha-value>)',

                // Status (solid)
                success: 'hsl(var(--success) / <alpha-value>)',
                'success-fg': 'hsl(var(--success-fg) / <alpha-value>)',
                warning: 'hsl(var(--warning) / <alpha-value>)',
                'warning-fg': 'hsl(var(--warning-fg) / <alpha-value>)',
                info: 'hsl(var(--info) / <alpha-value>)',
                'info-fg': 'hsl(var(--info-fg) / <alpha-value>)',
                danger: 'hsl(var(--danger) / <alpha-value>)',
                'danger-fg': 'hsl(var(--danger-fg) / <alpha-value>)',

                // Status (soft)
                'success-soft': 'hsl(var(--success-soft) / <alpha-value>)',
                'success-soft-fg': 'hsl(var(--success-soft-fg) / <alpha-value>)',
                'warning-soft': 'hsl(var(--warning-soft) / <alpha-value>)',
                'warning-soft-fg': 'hsl(var(--warning-soft-fg) / <alpha-value>)',
                'info-soft': 'hsl(var(--info-soft) / <alpha-value>)',
                'info-soft-fg': 'hsl(var(--info-soft-fg) / <alpha-value>)',
                'danger-soft': 'hsl(var(--danger-soft) / <alpha-value>)',
                'danger-soft-fg': 'hsl(var(--danger-soft-fg) / <alpha-value>)',
            },
            boxShadow: {
                'elevation-low': 'var(--shadow-elevation-low)',
                'elevation-medium': 'var(--shadow-elevation-medium)',
                'elevation-high': 'var(--shadow-elevation-high)',
            },
            backgroundImage: {
                'noise': "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><filter id=%22n%22><feTurbulence baseFrequency=%220.8%22 numOctaves=%224%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')"
            },
            // Durations & easings
            transitionDuration: {
                'fast': '150ms',
                'base': '250ms',
                'slow': '400ms',
                'slower': '700ms',
                'swap': '450ms',
            },
            transitionTimingFunction: {
                'snap': 'var(--ease-snap)',
                'hover': 'var(--ease-hover)',
                'reveal': 'var(--ease-reveal)',
                'shift': 'var(--ease-shift)',
                'expo': 'var(--ease-expo)',
                'bounce': 'var(--ease-bounce)',
                'swap': 'var(--ease-swap)',
            },

            // Optional: a couple of tiny keyframes wired to those easings
            keyframes: {
                'snap-in': {
                    '0%': { transform: 'translateY(8px) scale(.98)', opacity: '0' },
                    '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
                },
                'reveal-down': {
                    '0%': { clipPath: 'inset(0 0 100% 0)', opacity: '0.001' },
                    '100%': { clipPath: 'inset(0 0 0 0)', opacity: '1' },
                },
                'press': {
                    '0%': { transform: 'scale(1)' },
                    '100%': { transform: 'scale(.98)' },
                },
            },
            animation: {
                'snap-in': 'snap-in var(--anim-dur,300ms) var(--ease-snap) both',
                'reveal': 'reveal-down var(--anim-dur,400ms) var(--ease-reveal) both',
                'press': 'press 120ms var(--ease-bounce) both',
            },
        },
    },
};
