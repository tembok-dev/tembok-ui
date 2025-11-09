# Demo Display System

A unified system for displaying demos across different contexts (card grids, embed views, full pages) with consistent sizing, zoom, and layout behavior.

## Overview

The demo display system provides:
- **Single source of truth**: All display config in `manifest.json`
- **Three display modes**: Card, Embed, Full
- **Grid overlay dev tool**: Press `Alt+Ctrl+G` to visualize sizing boundaries
- **Reusable layouts**: ToolLayout for tool-type demos
- **Automatic prop handling**: Smart prop injection based on mode

## Components

### DemoWrapper
Universal wrapper that handles display modes and applies manifest config.

```tsx
import { DemoWrapper } from '@tembok/components/react';

<DemoWrapper 
  Component={YourDemo}
  mode="embed"
  manifest={manifest}
/>
```

### ToolLayout
Reusable layout for tool-type demos with header, footer, and glassmorphic design.

```tsx
import { ToolLayout } from '@tembok/components/react';

function MyTool() {
  return (
    <ToolLayout
      title="GPS Converter"
      subtitle="DD • DMS • DMM • UTM"
      mode="embed"
    >
      {/* Your tool content */}
    </ToolLayout>
  );
}
```

### GridOverlay
Dev tool to visualize sizing boundaries (activated with `Alt+Ctrl+G`).

## Manifest Configuration

Each demo has a `manifest.json` with display config:

### Experiment Example
```json
{
  "slug": "animated-button",
  "kind": "experiment",
  "display": {
    "card": {
      "zoom": 2.5,
      "width": 400,
      "height": 400
    },
    "embed": {
      "maxWidth": 400,
      "minHeight": 400,
      "zoom": 1,
      "allowScroll": false,
      "defaultView": "fit"
    },
    "full": {
      "enabled": false
    }
  }
}
```

### Tool Example
```json
{
  "slug": "gps-converter",
  "kind": "tool",
  "display": {
    "card": {
      "useCover": true
    },
    "embed": {
      "maxWidth": 720,
      "minHeight": 420,
      "zoom": 1,
      "allowScroll": true,
      "defaultView": "scroll",
      "layout": "tool"
    },
    "full": {
      "enabled": true,
      "layout": "tool"
    }
  }
}
```

## Display Modes

### Card Mode
- Used in grid/card views
- Applies `zoom` to make small demos look bigger
- Can use Strapi cover image instead of iframe (`useCover: true`)
- Always passes `embedded: true, compact: true`

### Embed Mode
- Used in detail pages and embed routes
- Respects `maxWidth`, `minHeight`, `zoom`
- Can enable scrolling with `allowScroll: true`
- Optionally wraps with ToolLayout (`layout: "tool"`)
- Passes `embedded: true, compact: false`

### Full Mode
- Used for full-page views
- Optionally wraps with ToolLayout (`layout: "tool"`)
- Passes `embedded: false, compact: false`

## Grid Overlay (Alt+Ctrl+G)

Press `Alt+Ctrl+G` while viewing any demo to activate the grid overlay:
- Shows visual boundaries for current mode
- Displays sizing info in a panel
- Helps validate design fits within constraints
- Works in development without publishing

## Demo Component Props

Your demo components automatically receive props based on display mode:

```tsx
interface DemoProps {
  embedded?: boolean;  // true in card/embed modes
  compact?: boolean;   // true only in card mode
}

export default function MyDemo({ embedded, compact }: DemoProps) {
  // Adjust UI based on mode
  return <div className={compact ? 'p-2' : 'p-4'}>...</div>;
}
```

## Usage in Playground

### CardPreview
```tsx
import { CardPreview } from './components/CardPreview';

<CardPreview 
  slug="animated-button"
  manifest={entry.manifest}
  cover={strapiData?.cover}
/>
```

### PreviewZone (Detail Page)
```tsx
import { PreviewZone } from './components/detail_page/PreviewZone';

<PreviewZone 
  Component={DemoComponent}
  currentMode="simple"
  manifest={entry.manifest}
/>
```

### Embed Route (/e/[slug])
```tsx
import { DemoWrapper } from '@tembok/components/react';

<DemoWrapper 
  Component={Demo}
  mode="embed"
  manifest={manifest}
/>
```

## Migration Guide

### Old Manifest Format (deprecated)
```json
{
  "embed": {
    "maxWidth": 720,
    "zoom": 1,
    "allowVerticalGrowth": true
  }
}
```

### New Format
```json
{
  "display": {
    "card": { "zoom": 2.5, "width": 800, "height": 600 },
    "embed": { 
      "maxWidth": 720, 
      "zoom": 1, 
      "allowScroll": true 
    }
  }
}
```

Backward compatibility is maintained, but prefer the new `display` structure.

## Best Practices

1. **Experiments**: Use high card zoom (2-3x) to showcase small UI elements
2. **Tools**: Use `useCover: true` for cards, enable scrolling in embed
3. **Apps**: Usually live outside playground in `/apps/[slug]`
4. **Grid Overlay**: Use during development to validate sizing
5. **Layouts**: Use ToolLayout for consistent tool aesthetics

## Type Safety

All types are exported from `@tembok/components/react`:

```tsx
import type { 
  DemoManifest, 
  DisplayMode,
  DemoWrapperProps,
  ToolLayoutProps 
} from '@tembok/components/react';
