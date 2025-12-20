# @tembok/ui-astro

[![npm version](https://badge.fury.io/js/%40tembok%2Fui-astro.svg)](https://badge.fury.io/js/%40tembok%2Fui-astro)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Astro](https://img.shields.io/badge/Astro-4%2B-ff5d01.svg)](https://astro.build/)

📦 **NPM Package**: [@tembok/ui-astro](https://www.npmjs.com/package/@tembok/ui-astro)

Headless Astro components for the Tembok design system. No Tailwind dependency.

## Installation

```bash
pnpm add @tembok/ui-astro
```

## Setup

Import the base CSS once (includes tokens + component styles):

```astro
---
import "@tembok/ui-astro/styles.css";
---
```

Then import components in your Astro files:

```astro
---
import { Button, Modal, SideBar } from "@tembok/ui-astro";
---
```

## Components

### Button

```astro
<Button intent="primary" size="md">Click me</Button>
<Button as="a" href="/about" intent="neutral">Link Button</Button>
```

Props:
- `intent`: `primary` | `secondary` | `neutral` | `ghost` | `success` | `warning` | `info` | `danger`
- `size`: `sm` | `md` | `lg`
- `tone`: `default` | `ink` | `red` | `lime` | `cyan`
- `as`: element tag (default `button`)

### IconButton

```astro
<IconButton label="Settings" intent="ghost">
  <svg>...</svg>
</IconButton>
```

### Modal

```astro
<button data-modal-open="my-modal">Open</button>

<Modal id="my-modal">
  <Fragment slot="header">Title</Fragment>
  Modal content
  <Fragment slot="footer">
    <Button data-modal-close-button>Close</Button>
  </Fragment>
</Modal>
```

Global triggers:
- `data-modal-open="id"`
- `data-modal-close="id"`
- `data-modal-toggle="id"`
- `data-modal-close-button` inside the panel

### Popover

```astro
<Popover openOn="click" side="down" align="start">
  <Fragment slot="trigger">
    <Button>Open</Button>
  </Fragment>
  <div>Popover content</div>
</Popover>
```

### Dropdown

```astro
<Dropdown>
  <Fragment slot="trigger">
    <Button>Menu</Button>
  </Fragment>
  <button role="menuitem">Item</button>
</Dropdown>
```

### SideBar

```astro
<button data-sidebar-open="main-menu">Open menu</button>

<SideBar id="main-menu" side="left">
  <nav>
    <a href="/about">About</a>
    <button data-close-menu>Close</button>
  </nav>
</SideBar>
```

Global triggers:
- `data-sidebar-open="id"`
- `data-sidebar-close="id"`
- `data-sidebar-toggle="id"`
- `data-close-menu` inside the panel

### DevGrid

```astro
<DevGrid enabled columns={12} />
```

### Loaders

```astro
<Loaders type="energyspin" size="md" color="#E72AAE" />
```

### TembokLogo

```astro
<TembokLogo size="md" tone="auto" />
```

## Not yet ported

- `DataTable`
- `InputField`
- `Toast`

## Requirements

- Astro 4+

## License

MIT

## Changelog

### 0.0.3
- Ported latest core headless components from React: Button, IconButton, Modal, Popover, SideBar, DevGrid.
- Added new Astro components: Dropdown, Loaders, TembokLogo.
- Added shared CSS bundle export at `@tembok/ui-astro/styles.css`.
- Removed Tailwind dependency; styles now rely on tokens and component CSS.
