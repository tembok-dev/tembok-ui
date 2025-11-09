# @tembok/tokens

Design tokens for the Tembok UI system - colors, spacing, typography, and other design primitives.

## Installation

```bash
pnpm add @tembok/tokens
```

## Usage

```ts
import { tokens } from '@tembok/tokens';

// Access design tokens
console.log(tokens);
```

### CSS Variables

Import the CSS file to use design tokens as CSS variables:

```ts
import '@tembok/tokens/dist/styles.css';
```

Then use in your CSS:

```css
.my-element {
  color: var(--color-primary);
  padding: var(--spacing-4);
}
```

## What's Included

- Color palette
- Spacing scale
- Typography system
- Border radius values
- Shadow definitions

## License

MIT
