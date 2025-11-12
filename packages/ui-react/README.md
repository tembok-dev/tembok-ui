# @tembok/ui-react

Headless React UI components for the Tembok Design System — automatically styled, zero setup.

No Tailwind configuration. No CSS imports.
Just install and use.

Current stable: 0.0.14
You can install prerelease builds using the @next tag if needed.

--------------------------------------------------------------------

## Installation

pnpm add @tembok/ui-react
# or
npm install @tembok/ui-react
# prerelease builds:
npm install @tembok/ui-react@next

--------------------------------------------------------------------

## Setup

No configuration required — all styles are injected automatically.

To enable the design system scope and theme variables, wrap your app with the tmbk-theme class:

// App.tsx
export default function App() {
  return (
    <div className="tmbk-theme">
      <AppContent />
    </div>
  );
}

Without this wrapper, components still render but fallback to plain browser defaults.

--------------------------------------------------------------------

## Usage

Import components directly — no CSS or Tailwind setup needed.

import { Button, IconButton, Modal, Toast } from "@tembok/ui-react";

--------------------------------------------------------------------

## Components

### Button

Polymorphic, accessible, and themable button component.

<Button intent="primary" size="md">Click me</Button>

<Button as="a" href="/about" intent="neutral">Link Button</Button>

Props:
- intent: 'primary' | 'secondary' | 'neutral' | 'ghost' | 'success' | 'warning' | 'info' | 'danger' (default: 'primary')
- size: 'sm' | 'md' | 'lg' (default: 'sm')
- tone: 'default' | 'ink' | 'red' | 'lime' | 'cyan' (default: 'default')
- as: polymorphic element type (default: 'button')
- disabled: boolean (default: false)

### IconButton

Icon-only button with automatic icon scaling.

<IconButton label="Edit"><Edit2 /></IconButton>
<IconButton tone="ink" intent="primary"><Plus /></IconButton>

### Modal

Accessible modal dialog rendered via portal, with focus trap and backdrop blur.

const [open, setOpen] = useState(false);

<Modal open={open} onOpenChange={setOpen}>
  <h2>Modal Title</h2>
  <p>Modal content here</p>
</Modal>

### Toast

Global toast notifications.

import { toast } from "@tembok/ui-react";

toast.success("Operation completed!");
toast.error("Something went wrong");
toast.info("Information message");
toast.warning("Warning message");

### Other Components

- SideBar — Collapsible sidebar
- Dropdown — Dropdown menu
- Popover — Contextual popover
- DevGrid — Development grid overlay
- TembokLogo — SVG logo component

--------------------------------------------------------------------

## Hooks

import {
  useClickOutside,
  useEscapeKey,
  useFocusTrap,
  usePosition,
} from "@tembok/ui-react";

--------------------------------------------------------------------

## Theming

All tokens live under .tmbk-theme. You can override them in your host app:

.tmbk-theme {
  --tmbk-primary: #5aedec;
  --tmbk-bg: #fafafa;
  --tmbk-fg: #222;
}

Dark mode activates automatically via .dark or [data-theme="dark"].

--------------------------------------------------------------------

## Requirements

- React 18 or higher
- TypeScript (optional, fully typed)
- No Tailwind required (self-contained styling)

--------------------------------------------------------------------

## Versioning

- latest → stable release (recommended for production)
- next → prerelease builds (for testing new components)

--------------------------------------------------------------------

## License

MIT © 2025 Tembok Dev
