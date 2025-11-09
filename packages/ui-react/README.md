# @tembok/ui-react

React UI components for the Tembok design system.

## Installation

```bash
pnpm add @tembok/ui-react @tembok/tailwind-preset
```

## Setup

1. Install the Tailwind preset:

```js
// tailwind.config.js
import tembokPreset from '@tembok/tailwind-preset';

export default {
  presets: [tembokPreset],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
};
```

2. Import components:

```tsx
import { Button, Modal, SideBar, Toast, Dropdown } from '@tembok/ui-react';
```

## Components

### Button

Polymorphic button with variants for intent, size, and tone.

```tsx
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
- `as` - Polymorphic element type (default: `button`)

### Modal

Accessible modal dialog with Portal rendering.

```tsx
const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <h2>Modal Title</h2>
  <p>Modal content goes here</p>
</Modal>
```

### SideBar

Collapsible sidebar component.

```tsx
<SideBar position="left" isOpen={isSidebarOpen}>
  <nav>Navigation items</nav>
</SideBar>
```

### Toast

Toast notification system.

```tsx
import { toast } from '@tembok/ui-react';

toast.success('Operation completed!');
toast.error('Something went wrong');
toast.info('Information message');
toast.warning('Warning message');
```

### Dropdown

Dropdown menu with positioning.

```tsx
<Dropdown trigger={<Button>Menu</Button>}>
  <button>Option 1</button>
  <button>Option 2</button>
</Dropdown>
```

### Other Components

- `IconButton` - Icon-only button variant
- `Popover` - Popover component with positioning
- `DevGrid` - Development grid overlay
- `TembokLogo` - Tembok logo component

## Hooks

```tsx
import { 
  useClickOutside,
  useEscapeKey,
  useFocusTrap,
  usePosition 
} from '@tembok/ui-react';
```

## Requirements

- React 18+
- Tailwind CSS 4+

## License

MIT
