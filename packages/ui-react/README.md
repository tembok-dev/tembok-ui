# @tembok/ui-react

[![npm version](https://badge.fury.io/js/%40tembok%2Fui-react.svg)](https://badge.fury.io/js/%40tembok%2Fui-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18%2B-61dafb.svg)](https://react.dev/)

📦 **NPM Package**: [@tembok/ui-react](https://www.npmjs.com/package/@tembok/ui-react)

Headless React UI components for the Tembok Design System - automatically styled, zero setup.

No Tailwind configuration. No CSS imports.
Just install and use.

Current package source: 0.0.22 (pending npm publication; install the latest published version for production)
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

Accessible modal dialog rendered via portal, with initial focus, Tab/Shift+Tab containment, and focus restoration to the opener on close. Panel width includes padding/border and is capped to the viewport. Long-content vertical scrolling and coordinated nested overlay behavior remain follow-up work.

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

Menu anchored to a trigger. Defaults to collision-aware automatic vertical placement; an explicit `side="up"` or `side="down"` is a preference and can flip when space is insufficient.

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

Floating panel attached to any trigger. Panels unmount on close; Escape returns keyboard focus to the trigger if focus is inside. Explicit `side` values are preferred directions, not strict placement guarantees.

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

### Controlled Popover and context menus (unreleased)

`Popover` and `Dropdown` support the same optional controlled behavior:

```tsx
const [open, setOpen] = useState(false);
const [point, setPoint] = useState({ x: 0, y: 0 });

<div onContextMenu={(event) => {
  event.preventDefault();
  setPoint({ x: event.clientX, y: event.clientY });
  setOpen(true);
}}>
  Right-click here
</div>
<Dropdown
  open={open}
  onOpenChange={(next, reason) => {
    setOpen(next);
    // reason: "trigger" | "hover" | "outside" | "escape" | "select"
  }}
  anchorRect={point}
  ariaLabel="Context actions"
>
  <button>Rename</button>
</Dropdown>
```

- Existing click/hover trigger usage remains uncontrolled by default.
- `defaultOpen` supplies the initial state for uncontrolled components.
- `anchorRect` accepts x/y and optional width/height; `anchorElement` is also supported. They reuse collision positioning, with `anchorRect` taking precedence.
- A triggerless controlled menu should supply an accessible `ariaLabel`. It focuses its first action when opened and restores the previous focused control on Escape where possible.
- Pointer-outside dismissal does not move focus back to the opener.
- Coordinated nested Escape/outside dismissal and shared layer stacks are **not** solved by this API addition; see #4.

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

- 0.0.22 (source prepared, not yet published) - React overlay hardening: Popover/Dropdown collision flipping and viewport/ancestor scroll repositioning; closed Popover unmounting; Escape focus return; Modal focus ownership and mobile-width safety. Chrome QA passed at 375, 900, 1280px; package typecheck/build passed. Nested layers, strict positioning, and tall Modal scrolling are not covered by this release.
- 0.0.21 - Previously published React package version at start of overlay work; see Git history for preceding changes.

- 0.0.19 - Added Loaders component (energyspin, spintrail)
- 0.0.18 - Added InputField component
- 0.0.17 - Added DataTable component
- 0.0.1 - Added Button, IconButton, Modal, Toast, Dropdown, Popover, SideBar, DevGrid, TembokLogo

--------------------------------------------------------------------

## License

MIT (c) 2025 Tembok Dev

## React overlay QA and release checklist

Source: `tembok-dev/tembok-ui`, React package `packages/ui-react`.

1. Run `pnpm --filter @tembok/ui-react typecheck` and `pnpm --filter @tembok/ui-react build`.
2. Use the local-build React/Vite overlay QA fixture in `agmitre/tembok-ui-kit-preview` at `/qa/overlays`. Verify it resolves the linked sibling package, not the published npm artifact.
3. Check 375px, 900px and 1280px: Popover/Dropdown corner flipping and overflow, Escape focus restoration, closed panel unmounting; Modal initial focus, Tab wrap, Escape restoration and mobile width.
4. After approving the changes and checking downstream compatibility, publish explicitly with the project's npm release credentials and verify the registry version. A Git merge or source version bump **does not** publish npm automatically.

**Scope:** These changes apply only to `@tembok/ui-react` (React 18/19). `@tembok/ui-astro` was not modified or validated. Review Astro separately if shared tokens, CSS, overlay behavior or public APIs change.

## Premium surface and motion foundations

The optional semantic values below give Modal and Popover coherent surfaces without locking applications into a brand. Set them on the relevant `.tmbk-theme` scope. Portaled surfaces receive their own `.tmbk-theme` scope, so application-wide overrides should target those portaled surfaces too (for example through a global CSS rule).

```css
/* Example theme override; keep your existing brand palette. */
.tmbk-theme {
  --tmbk-surface: #ffffff;
  --tmbk-surface-raised: #ffffff;
  --tmbk-surface-text: #202329;
  --tmbk-surface-border: rgba(32, 35, 41, .12);
  --tmbk-radius-surface: .75rem;
  --tmbk-shadow-surface: 0 12px 36px rgba(0,0,0,.12);
  --tmbk-shadow-floating: 0 16px 48px rgba(0,0,0,.18);
  --tmbk-motion-fast: 140ms;
  --tmbk-motion-normal: 220ms;
  --tmbk-motion-ease: cubic-bezier(.22,1,.36,1);
}
```

Modal additionally supports `--tmbk-modal-bg`, `--tmbk-modal-fg`, `--tmbk-modal-border`, `--tmbk-modal-radius` and `--tmbk-modal-shadow`. Popover supports `--tmbk-popover-radius` and `--tmbk-popover-shadow`. Existing component props and token aliases remain valid. Motion duration tokens become `0ms` under `prefers-reduced-motion: reduce`.

These visual defaults are CSS-only; they do not change z-index, focus, dismissal or positioning behavior. Run `pnpm check` locally before merging. No hosted CI is configured.
