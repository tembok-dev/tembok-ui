# Changelog

Changes to the React package are recorded here for application developers.

## Unreleased (source only, not yet on npm)

### Added
- Modal `size` presets (`sm`, `md`, `lg`, `xl`, `full`) and optional `width` override.
- Modal viewport-safe scrolling with independently scrollable body and persistent footer.
- Local React regression tests and `pnpm check` command (manual only).
- Semantic surface and motion theme values.

### Fixed
- Coordinated dismissal/focus of nested overlays.
- Popover/Dropdown collision positioning, context-menu anchors and Escape focus restoration.
- Popover arrow styling for dark surfaces.

### Developer tools
- Private component workbench for appearance, accent and interaction previews.

> This is an accumulated source-level summary of changes after prior npm releases. It does **not** mean the features have been published. The package source remains 0.0.22; choose the release version and publish in a separate, reviewed release step. For exact history, consult Git commits and PRs.

## Released versions

Historical npm release notes have not yet been reconstructed. Do not assume a source commit or package.json version is a published npm release.
