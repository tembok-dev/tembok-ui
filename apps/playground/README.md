# Tembok React Playground

An internal development and manual QA app for **the local source** of `@tembok/ui-react`. It is private and is not published to npm.

From the monorepo root:

```bash
pnpm install
pnpm dev
```

The Vite alias points directly at `packages/ui-react/src/index.ts`, enabling hot reload without building or publishing the package. This is a development test, **not** a substitute for testing the actual packaged `dist` output.

Use **Gallery** to explore actual Tembok UI components. Use **Overlay QA** for keyboard, positioning and viewport regression tests (375, 900 and 1280 CSS pixels). Native HTML inputs/selects/buttons in fixtures are intentional: they isolate focus and accessibility behavior from unrelated component styling.

Before release also run `pnpm typecheck`, `pnpm build`, and verify the package build independently. Test additional nested/stacked overlays and longer Modal content before claiming full accessibility compliance.

Astro is a separate future QA surface; do not assume React tests validate `@tembok/ui-astro`.

## Local-only quality gates

From the repository root:

```bash
pnpm install
pnpm test
pnpm check
```

- `pnpm test` runs the deterministic React overlay regression tests using Vitest + jsdom.
- `pnpm check` runs package and playground typechecks, regression tests, and builds.
- `pnpm dev` launches the visual playground for manual QA.

These scripts only run when a developer invokes them. **No GitHub Actions, CI workflows, pre-commit hooks, pre-push hooks or scheduled testing are added.** The jsdom tests verify behavior, not visual stacking or browser layout. Use Chrome QA only for visual or interaction scenarios that need a real browser.

When adding dependencies, regenerate and commit `pnpm-lock.yaml` locally using `pnpm install`, then verify `pnpm install --frozen-lockfile`. Do not merge before completing this step.

## Component workbench (Gallery)

The private playground Gallery is a compact inspection workbench with component navigation, real React component previews and an appearance inspector. Components remain imported from `@tembok/ui-react`, not reimplemented as visual stand-ins.

Preview controls:
- Icon-tab light / dark appearance for the workbench and portaled Modal, Popover and SideBar surfaces.
- Primary accent color from Tembok default, red, cyan, lime or ink presets, plus a custom native color input; the preview also chooses a readable primary text color.
- Surface radius and optional motion for demonstration.

Theme settings are ephemeral, local to this app, and are not persisted or published. For portaled surfaces the playground sets a temporary body data attribute and CSS variable, then cleans them up; consumer apps must still provide their own theme integration. The separate Overlay QA page stays isolated from those preview overrides.

This page is an engineering tool, **not a marketing landing page**. Prefer useful live component states, interaction examples and property controls over slogans, numbered feature grids or decorative motion-only demos.

Run `pnpm check` locally. No GitHub Actions or hosted CI is configured.

The preset values come from existing React theme tokens, not a new brand palette. The preview-only accent CSS accounts for components with their own `.tmbk-theme` scope. Popover arrow styling is fixed in the package itself, using the raised panel surface and no rotated-square border.
