# @tembok/tailwind-preset

Tailwind CSS preset for the Tembok design system - pre-configured theme, utilities, and plugins.

## Installation

```bash
pnpm add @tembok/tailwind-preset
```

## Usage

Add the preset to your `tailwind.config.js`:

```js
// ESM
import tembokPreset from '@tembok/tailwind-preset';

export default {
  presets: [tembokPreset],
  content: ['./src/**/*.{js,jsx,ts,tsx,astro}'],
};
```

```js
// CommonJS
const tembokPreset = require('@tembok/tailwind-preset');

module.exports = {
  presets: [tembokPreset],
  content: ['./src/**/*.{js,jsx,ts,tsx,astro}'],
};
```

## What's Included

- **Design tokens** - Colors, spacing, typography from `@tembok/tokens`
- **Custom utilities** - Additional utility classes for common patterns
- **Animation presets** - Smooth transitions and micro-interactions
- **Component variants** - Pre-styled variants for buttons, cards, etc.

## Customization

You can override or extend the preset in your Tailwind config:

```js
import tembokPreset from '@tembok/tailwind-preset';

export default {
  presets: [tembokPreset],
  theme: {
    extend: {
      colors: {
        // Add your custom colors
        brand: '#ff0000',
      },
    },
  },
};
```

## License

MIT
