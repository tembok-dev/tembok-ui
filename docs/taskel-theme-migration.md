# Taskel → Tembok UI theme migration (pre-release audit)

**Source inspected:** `tembok-dev/taskel-app` on `develop/core`, `apps/web/src/styles/globals.css` and `apps/web/package.json` (18 October 2026). **No Taskel source changes were made.** Tembok's updated React API is not yet published to npm; Taskel currently depends on `@tembok/ui-react@^0.0.21`. Do not remove Taskel's compatibility rules before an approved release and controlled integration.

## What Taskel currently duplicates

Taskel owns its `--color-*` palette, and bridges to `--tmbk-*` using `.taskel-theme.tmbk-theme, .taskel-theme .tmbk-theme`. That **palette bridge is legitimate and should remain**; the problem is selector-level overrides of Tembok implementation details.

| Taskel selector / rule | Migration approach |
| --- | --- |
| `.tmbk-btn[data-intent="primary"]` base background/foreground | Use `--tmbk-primary: var(--color-primary)` and `--tmbk-primary-fg: var(--color-primary-fg)` |
| Primary hover/active forcing `--color-primary-dark`, plus bespoke shadow/filter | Remove after verification; Tembok now derives states. If exact Taskel shade is intentionally required, explicitly map `--tmbk-primary-hover` and `--tmbk-primary-active` in the theme scope |
| Secondary base/hover/border selectors | Use `--tmbk-secondary-bg`, `--tmbk-secondary-fg`, `--tmbk-secondary-border`, `--tmbk-secondary-hover` |
| Global `.tmbk-btn:hover/:active` transforms | Prefer Tembok's default subtle hover + pressed scale feedback; preserve custom motion only as an intentional product exception |
| `.tmbk-popover` dark background, foreground, border and shadow | Use `--tmbk-popover-bg`, `--tmbk-popover-fg`, `--tmbk-popover-border`, `--tmbk-popover-shadow` on the owning product scope, not on `.tmbk-popover` selectors |
| Root `*{scrollbar-color:…}` and WebKit scrollbar selectors | Retain Taskel page-level scrollbar decisions independently; floating menu scrollbars use their own documented `--tmbk-scrollbar-thumb` and `--tmbk-scrollbar-track` contract |

## Suggested integration scope (illustrative; not deployed)

```css
.taskel-theme {
  --tmbk-bg: var(--color-bg);
  --tmbk-bg-light: var(--color-bg-light);
  --tmbk-bg-dark: var(--color-bg-dark);
  --tmbk-fg: var(--color-fg);
  --tmbk-fg-muted: var(--color-fg-muted);
  --tmbk-border: var(--color-border);

  --tmbk-primary: var(--color-primary);
  --tmbk-primary-fg: var(--color-primary-fg);
  --tmbk-ring: var(--color-ring);

  --tmbk-secondary-bg: color-mix(in srgb, var(--color-primary) 8%, var(--color-bg-light));
  --tmbk-secondary-fg: var(--color-fg);
  --tmbk-secondary-border: color-mix(in srgb, var(--color-primary) 35%, var(--color-border));
  --tmbk-secondary-hover: color-mix(in srgb, var(--color-primary) 12%, var(--color-bg-light));

  --tmbk-popover-bg: var(--color-secondary);
  --tmbk-popover-fg: var(--color-secondary-fg);
  --tmbk-popover-border: var(--color-secondary-light);
  --tmbk-menu-hover: #394656;

  --tmbk-success: var(--color-success);
  --tmbk-success-fg: var(--color-success-fg);
  --tmbk-warning: var(--color-warning);
  --tmbk-warning-fg: var(--color-warning-fg);
  --tmbk-danger: var(--color-danger);
  --tmbk-danger-fg: var(--color-danger-fg);
}
```

The `Taskel-inspired / Product Reference` playground preset already models the ink-popover and palette behavior using public tokens; it is a **visual parity reference**, not evidence that the real Taskel app has been migrated.

## Migration acceptance sequence

1. Finish Tembok issue reconciliation and the deliberate npm release approval; do **not** update Taskel to unreleased package code.
2. In a separate **Taskel draft integration branch**, upgrade the dependency only after approval.
3. Retain Taskel's `--color-*` palette and semantic token bridge; remove component-selector overrides one family at a time (Button → Popover/Dropdown → special cases).
4. Run Taskel's own local typecheck/tests/build and inspect shell navigation/account popovers, Settings Modal, mobile layouts, light/dark modes, keyboard navigation and portal theme inheritance.
5. Compare Taskel with the playground reference; any discrepancy should become a small Tembok contract issue rather than another app-side selector override.
6. Do not merge Taskel integration until product QA passes and the owner approves.

## Open questions

- This audit **only** inspected the two named Taskel files; it does not assert there are no other local `.tmbk-*` overrides elsewhere on `develop/core`.
- The shell's bespoke global scrollbar CSS needs a separate integration visual check alongside the package's local floating scrollbars.
- Theme foreground utility `primaryForeground` supports opaque hexadecimal primaries at setup time; Taskel's existing explicit foreground token stays authoritative.
- Keep Outfit/Zain as Taskel app typography. Tembok must not force those fonts on other consumers.
