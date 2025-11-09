# @tembok/ui-astro

Astro UI components for the Tembok design system.

## Installation

```bash
pnpm add @tembok/ui-astro @tembok/tailwind-preset
```

## Setup

1. Install the Tailwind preset:

```js
// tailwind.config.mjs
import tembokPreset from '@tembok/tailwind-preset';

export default {
  presets: [tembokPreset],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
};
```

2. Import components in your Astro files:

```astro
---
import { Button, Modal, SideBar } from '@tembok/ui-astro';
---
```

## Components

### Button

Polymorphic button with variants for intent, size, and tone.

```astro
<Button intent="primary" size="md">
  Click me
</Button>

<Button as="a" href="/about" intent="neutral">
  Link Button
</Button>
```

**Props:**
- `intent` - `primary` | `neutral` | `ghost` | `success` | `warning` | `info` | `danger`
- `size` - `sm` | `md` | `lg`
- `tone` - `default` | `ink` | `red` | `lime` | `cyan`
- `as` - Element type (default: `button`)

### Modal

Accessible modal dialog component.

```astro
<Modal>
  <h2>Modal Title</h2>
  <p>Modal content goes here</p>
</Modal>
```

### SideBar

Collapsible sidebar component.

```astro
<SideBar position="left">
  <nav>Navigation items</nav>
</SideBar>
```

### IconButton

Icon-only button variant.

```astro
<IconButton icon={CheckCircle} ariaLabel="Success" />
```

### Popover

Popover component with positioning.

```astro
<Popover trigger={<Button>Toggle</Button>}>
  <p>Popover content</p>
</Popover>
```

### Other Components

- `DevGrid` - Development grid overlay for layout debugging

## Requirements

- Astro 4+
- Tailwind CSS 4+

## License

MIT
