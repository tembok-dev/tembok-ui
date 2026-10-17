# Tembok UI

A modern, modular UI component library built for React and Astro, with design tokens and Tailwind CSS integration.

## Packages

This monorepo contains the following packages:

- **[@tembok/tokens](./packages/tokens)** - Design tokens (colors, spacing, typography)
- **[@tembok/tailwind-preset](./packages/tailwind-preset)** - Tailwind CSS preset with Tembok design system
- **[@tembok/icons](./packages/icons)** - React icon components
- **[@tembok/ui-react](./packages/ui-react)** - React UI components
- **[@tembok/ui-astro](./packages/ui-astro)** - Astro UI components

## For application developers

Each package is independently versioned. Start with the [React package guide](./packages/ui-react/README.md) for installation, themes and copyable component examples.

**Source vs npm:** A feature merged into `main` is not automatically published. Check the version available on [npm](https://www.npmjs.com/package/@tembok/ui-react) before adopting an unreleased API. Review the [React changelog](./packages/ui-react/CHANGELOG.md) for work pending release.

## Local development

Use `pnpm dev` to open the private component workbench. Run `pnpm check` to typecheck, test and build packages locally. These commands are **manual only**; the repository does not introduce GitHub Actions or scheduled checks.

## Getting Started

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Type check all packages
pnpm typecheck

# Clean build artifacts
pnpm clean
```

## Installation

Each package can be installed independently:

```bash
# React components
pnpm add @tembok/ui-react @tembok/tailwind-preset

# Astro components
pnpm add @tembok/ui-astro @tembok/tailwind-preset

# Icons
pnpm add @tembok/icons

# Design tokens
pnpm add @tembok/tokens
```

## Requirements

- Node.js 18+
- pnpm 9+

## Contributing

This is a monorepo managed with pnpm workspaces. Each package has its own build configuration and can be developed independently.

## License

MIT
