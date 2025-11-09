Scaffold OK ✅

## Inventory

| File path                                             | Detected type | Proposed target package      |
|-------------------------------------------------------|---------------|-----------------------------|
| README.md                                             | Other         | @tembok/ui-react            |
| components/package.json                               | Other         | @tembok/ui-react            |
| components/README-REACT.md                            | Other         | @tembok/ui-react            |
| components/src/Button.astro                           | Astro         | @tembok/ui-astro            |
| components/src/DevGrid.astro                          | Astro         | @tembok/ui-astro            |
| components/src/IconButton.astro                       | Astro         | @tembok/ui-astro            |
| components/src/index.ts                               | Astro         | @tembok/ui-astro            |
| components/src/Modal.astro                            | Astro         | @tembok/ui-astro            |
| components/src/Popover.astro                          | Astro         | @tembok/ui-astro            |
| components/src/react.ts                               | React         | @tembok/ui-react            |
| components/src/SideBar.astro                          | Astro         | @tembok/ui-astro            |
| components/src/styles.css                             | Tailwind      | @tembok/tailwind-preset     |
| components/src/react/Button.tsx                       | React         | @tembok/ui-react            |
| components/src/react/DemoSimpleLayout.tsx             | React         | @tembok/ui-react            |
| components/src/react/DevGrid.tsx                      | React         | @tembok/ui-react            |
| components/src/react/Dropdown.tsx                     | React         | @tembok/ui-react            |
| components/src/react/IconButton.tsx                   | React         | @tembok/ui-react            |
| components/src/react/Modal.tsx                        | React         | @tembok/ui-react            |
| components/src/react/Popover.tsx                      | React         | @tembok/ui-react            |
| components/src/react/SideBar.tsx                      | React         | @tembok/ui-react            |
| components/src/react/TembokLogo.tsx                   | React         | @tembok/ui-react            |
| components/src/react/Toast.tsx                        | React         | @tembok/ui-react            |
| components/src/react/demos/DemoWrapper.tsx            | React         | @tembok/ui-react            |
| components/src/react/demos/GridOverlay.tsx            | React         | @tembok/ui-react            |
| components/src/react/demos/index.ts                   | React         | @tembok/ui-react            |
| components/src/react/demos/README.md                  | Other         | @tembok/ui-react            |
| components/src/react/demos/ToolLayout.tsx             | React         | @tembok/ui-react            |
| components/src/react/demos/types.ts                   | React         | @tembok/ui-react            |
| components/src/react/hooks/index.ts                   | React         | @tembok/ui-react            |
| components/src/react/hooks/useClickOutside.ts         | React         | @tembok/ui-react            |
| components/src/react/hooks/useEscapeKey.ts            | React         | @tembok/ui-react            |
| components/src/react/hooks/useFocusTrap.ts            | React         | @tembok/ui-react            |
| components/src/react/hooks/usePosition.ts             | React         | @tembok/ui-react            |
| components/src/react/icons/AlertTrianglle.tsx         | Icon          | @tembok/icons               |
| components/src/react/icons/CheckCircle2.tsx           | Icon          | @tembok/icons               |
| components/src/react/icons/Info.tsx                   | Icon          | @tembok/icons               |
| components/src/react/icons/XCircle.tsx                | Icon          | @tembok/icons               |
| components/src/react/utils/index.ts                   | React         | @tembok/ui-react            |
| components/src/react/utils/Portal.tsx                 | React         | @tembok/ui-react            |
| components/src/utils/variants.ts                      | Other         | @tembok/ui-react            |
| tailwind-preset/index.d.ts                            | Tailwind      | @tembok/tailwind-preset     |
| tailwind-preset/index.js                              | Tailwind      | @tembok/tailwind-preset     |
| tailwind-preset/package.json                          | Other         | @tembok/tailwind-preset     |
| tailwind-preset/theme.css                             | Tailwind      | @tembok/tailwind-preset     |
| tokens/package.json                                   | Other         | @tembok/tokens              |
| tokens/styles.css                                     | Token         | @tembok/tokens              |

## Move Plan (Draft)

- Move all `components/src/react/icons/*.tsx` to `@tembok/icons`
- Move all `components/src/react/**/*.tsx` (except icons) and related `.ts`/`.md` to `@tembok/ui-react`
- Move all `components/src/*.astro` and `components/src/index.ts` to `@tembok/ui-astro`
- Move all `components/src/styles.css` and `tailwind-preset/*` to `@tembok/tailwind-preset`
- Move all `tokens/*` to `@tembok/tokens`
- Other files (README, package.json, utils, etc.) to be assigned based on context
