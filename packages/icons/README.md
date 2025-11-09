# @tembok/icons

React icon components for the Tembok UI system.

## Installation

```bash
pnpm add @tembok/icons
```

## Usage

```tsx
import { CheckCircle2, Info, AlertTriangle, XCircle } from '@tembok/icons';

function MyComponent() {
  return (
    <div>
      <CheckCircle2 className="w-6 h-6 text-success" />
      <Info className="w-6 h-6 text-info" />
      <AlertTriangle className="w-6 h-6 text-warning" />
      <XCircle className="w-6 h-6 text-danger" />
    </div>
  );
}
```

## Available Icons

- `CheckCircle2` - Success/check icon
- `Info` - Information icon
- `AlertTriangle` - Warning/alert icon
- `XCircle` - Error/close icon

## Customization

All icons accept standard SVG props:

```tsx
<CheckCircle2 
  className="w-8 h-8" 
  fill="currentColor"
  aria-label="Success"
/>
```

## SVG Files

Raw SVG files are also included in the package at `@tembok/icons/svg/` for use in non-React contexts.

## Requirements

- React 18+

## License

MIT
