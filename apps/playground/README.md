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

## Showcase (Gallery)

The Gallery is now a curated visual showcase using the actual `@tembok/ui-react` Button, IconButton, Popover, Dropdown and Modal components, with supplementary demo-only examples clearly labeled. The existing Overlay QA route is preserved.

The light/dark selector and radius/motion controls are local showcase experiments, not exported component APIs. Theme controls scope the page, while overlays portal to `document.body`; global application-level portal theme inheritance is a separate design-system concern, so do not use this demo as proof that portaled themes propagate.

Run `pnpm check` locally before merging. No additional dependencies, CI workflows or automated cloud testing are introduced.
