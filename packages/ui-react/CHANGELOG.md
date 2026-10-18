# Changelog

Changes to the React package are recorded here for application developers.

## 0.0.23 — 2026-10-18

### Added
- Toast accepts optional rich React descriptions and configurable/custom action content without breaking string descriptions; playground includes message and upload examples.
- Exported `primaryForeground(hex)` helper for WCAG-based black/white primary text selection at theme setup or color-picker changes; playground uses it instead of a heuristic.
- React `AlertDialog` composes Modal's surface with `alertdialog` semantics, a compact default, explicit action slots, safe initial Cancel focus and no backdrop dismissal.
- SideBar supports controlled `open`/`onOpenChange`, with initial focus and opener-focus return on close; legacy attribute triggers remain supported.
- Floating surface scrollbar tokens (`--tmbk-scrollbar-thumb`, `--tmbk-scrollbar-track`) that inherit across portals and respect dark ink menus.
- Optional popover surface tokens (`--tmbk-popover-bg`, `--tmbk-popover-fg`, `--tmbk-popover-border`) so menus can retain intentional dark ink styling in light product themes.
- Provider-free scoped theme inheritance for Modal, Popover and Dropdown portals, including product-specific CSS token scopes and live ancestor class/style changes.
- Inherited neutral slate default theme, with optional app-level semantic token overrides and no required wrapper.
- Optional Button hover/active and secondary-state token overrides, plus neutral/Tembok/product-reference playground presets.
- `IconButton size="xs"` for dense 28px actions, customizable with `--tmbk-icon-button-xs-size`.
- `MenuItem` component for compact dropdown actions with icon, trailing text, description and danger/disabled states.
- Clear human-facing guidance distinguishing Dropdown, Popover and Modal.
- Modal `size` presets (`sm`, `md`, `lg`, `xl`, `full`) and optional `width` override.
- Modal viewport-safe scrolling with independently scrollable body and persistent footer.
- Local React regression tests and `pnpm check` command (manual only).
- Semantic surface and motion theme values.

### Fixed
- DevGrid now uses its own fixed overlay/grid layout rather than relying on consumer Tailwind utility classes.
- Loaders can expose an optional accessible status label and default to the primary theme token.
- DataTable defaults to English pagination/empty-state text and exposes `labels` / `emptyText` overrides; controlled `sortState={null}` is respected.
- Primary Button hover/pressed colors now derive from primary and foreground tokens; removed fixed preview-specific interaction shades.
- SideBar backdrop now uses the same dimming and blur theme tokens as Modal, while keeping an explicit `--tmbk-backdrop` override.
- Closed SideBar content is inert as well as hidden to assistive technology, preventing focus on offscreen controls.
- Modal and SideBar now coordinate body scroll locks, preserving the original inline overflow after the last overlay closes.
- SideBar panel and backdrop inherit product-scoped theme tokens across their portal.
- Compact non-scrolling Popovers/Dropdowns no longer reserve a permanent right-side scrollbar gutter.
- Reworked Popover/Dropdown scrolling into one inset content viewport; removed native scrollbar-corner patches and prevented positioning recalculation on internal scroll to avoid panel size jumps.
- Portaled overlay surfaces no longer lose semantic theme colors when opened from locally themed application regions.
- Removed per-component theme token resets that previously overrode application-scope colors.
- Repaired invalid secondary Button background CSS value.
- Dropdown no longer inherits spacious Popover panel padding; menus use compact spacing.
- Coordinated dismissal/focus of nested overlays.
- Popover/Dropdown collision positioning, context-menu anchors and Escape focus restoration.
- Popover arrow styling for dark surfaces.

### Developer tools
- Gallery now includes a wide Settings Modal and compact confirmation Modal with real scrolling and size fixtures for QA.
- SideBar can now be opened directly from Gallery → Overlays for visual QA.
- Removed playground-only body theme mutations and component selector overrides; theme examples now exercise inherited public CSS tokens.
- Workbench dark preview now propagates foreground/surface tokens to self-scoped buttons, restoring neutral and ghost readability.
- Private component workbench for appearance, accent and interaction previews.

