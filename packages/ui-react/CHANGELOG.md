# Changelog

Changes to the React package are recorded here for application developers.

## Unreleased (source only, not yet on npm)

### Added
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
- Portaled overlay surfaces no longer lose semantic theme colors when opened from locally themed application regions.
- Removed per-component theme token resets that previously overrode application-scope colors.
- Repaired invalid secondary Button background CSS value.
- Dropdown no longer inherits spacious Popover panel padding; menus use compact spacing.
- Coordinated dismissal/focus of nested overlays.
- Popover/Dropdown collision positioning, context-menu anchors and Escape focus restoration.
- Popover arrow styling for dark surfaces.

### Developer tools
- Workbench dark preview now propagates foreground/surface tokens to self-scoped buttons, restoring neutral and ghost readability.
- Private component workbench for appearance, accent and interaction previews.

> This is an accumulated source-level summary of changes after prior npm releases. It does **not** mean the features have been published. The package source remains 0.0.22; choose the release version and publish in a separate, reviewed release step. For exact history, consult Git commits and PRs.

## Released versions

Historical npm release notes have not yet been reconstructed. Do not assume a source commit or package.json version is a published npm release.
