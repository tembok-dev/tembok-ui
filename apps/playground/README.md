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
