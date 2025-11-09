# Tembok UI

A modern, modular UI component library built for React and Astro, with design tokens and Tailwind CSS integration.

## Packages

This monorepo contains the following packages:

- **[@tembok/tokens](./packages/tokens)** - Design tokens (colors, spacing, typography)
- **[@tembok/tailwind-preset](./packages/tailwind-preset)** - Tailwind CSS preset with Tembok design system
- **[@tembok/icons](./packages/icons)** - React icon components
- **[@tembok/ui-react](./packages/ui-react)** - React UI components
- **[@tembok/ui-astro](./packages/ui-astro)** - Astro UI components

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
