# @tembok/ui-react

[![npm version](https://badge.fury.io/js/%40tembok%2Fui-react.svg)](https://badge.fury.io/js/%40tembok%2Fui-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18%2B-61dafb.svg)](https://react.dev/)

📦 **NPM Package**: [@tembok/ui-react](https://www.npmjs.com/package/@tembok/ui-react)

Headless React UI components for the Tembok Design System - automatically styled, zero setup.

No Tailwind configuration. No CSS imports.
Just install and use.

Current stable: 0.0.19
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

No configuration required - all styles are injected automatically.

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

Import components directly - no CSS or Tailwind setup needed.

import { Button, IconButton, Loaders, Modal, Toast } from "@tembok/ui-react";

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

### Loaders

Animated loaders with size and color options.

<Loaders type="energyspin" size="md" color="#E72AAE" />
<Loaders type="spintrail" size="lg" color="rebeccapurple" />

Props:
- type: 'energyspin' | 'spintrail' (default: 'energyspin')
- size: 'sm' | 'md' | 'lg' (default: 'md')
- color: any valid CSS color (default: '#E72AAE')

### InputField

Controlled input with label and error support.

```tsx
import { useState } from "react";
import { InputField } from "@tembok/ui-react";

export default function Example() {
  const [value, setValue] = useState("");

  return (
    <InputField
      label="Company"
      placeholder="Acme Inc."
      value={value}
      onChange={setValue}
    />
  );
}
```

### DataTable

Basic table with columns and rows.

```tsx
import { DataTable } from "@tembok/ui-react";

const rows = [
  { id: 1, name: "Ada", email: "ada@example.com" },
  { id: 2, name: "Linus", email: "linus@example.com" },
];

const columns = [
  { id: "name", label: "Name", isPrimary: true, sortable: true },
  { id: "email", label: "Email" },
];

export default function Example() {
  return (
    <DataTable
      data={rows}
      columns={columns}
      getRowId={(row) => row.id}
      enableSorting
    />
  );
}
```

### Dropdown

Menu anchored to a trigger.

```tsx
import { Dropdown } from "@tembok/ui-react";

export default function Example() {
  return (
    <Dropdown
      trigger={<button>Menu</button>}
      side="down"
      align="start"
    >
      <button type="button">Edit</button>
      <button type="button">Delete</button>
    </Dropdown>
  );
}
```

### Popover

Floating panel attached to any trigger.

```tsx
import { Popover } from "@tembok/ui-react";

export default function Example() {
  return (
    <Popover trigger={<button>Help</button>} side="down" align="center">
      <div>Quick tips go here.</div>
    </Popover>
  );
}
```

### SideBar

Slide-out panel with simple data-attribute triggers.

```tsx
import { SideBar } from "@tembok/ui-react";

export default function Example() {
  return (
    <>
      <button data-sidebar-open="mainMenu">Open Menu</button>

      <SideBar id="mainMenu" side="left" closeOnOverlayClick>
        <nav>
          <a href="#home">Home</a>
          <a href="#projects">Projects</a>
          <button data-close-menu>Close</button>
        </nav>
      </SideBar>
    </>
  );
}
```

### DevGrid

Development grid overlay for layout checks.

```tsx
import { DevGrid } from "@tembok/ui-react";

export default function Example() {
  return <DevGrid enabled={true} columns={12} />;
}
```

### TembokLogo

SVG logo component.

```tsx
import { TembokLogo } from "@tembok/ui-react";

export default function Example() {
  return <TembokLogo size="md" />;
}
```

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

- latest - stable release (recommended for production)
- next - prerelease builds (for testing new components)

## Changelog

- 0.0.19 - Added Loaders component (energyspin, spintrail)
- 0.0.18 - Added InputField component
- 0.0.17 - Added DataTable component
- 0.0.1 - Added Button, IconButton, Modal, Toast, Dropdown, Popover, SideBar, DevGrid, TembokLogo

--------------------------------------------------------------------

## License

MIT (c) 2025 Tembok Dev
