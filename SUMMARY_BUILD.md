# Build Summary

This document provides an overview of the build outputs for each package in the tembok-ui monorepo.

## Package Overview

| Package | Version | Type |
|---------|---------|------|
| @tembok/icons | 0.0.1 | Built (tsup) |
| @tembok/tailwind-preset | 0.0.1 | Built (tsup) |
| @tembok/tokens | 0.0.1 | Built (tsup) |
| @tembok/ui-astro | 0.0.1 | Source-only |
| @tembok/ui-react | 0.0.1 | Built (tsup) |

---

## @tembok/icons

**Version:** 0.0.1

**Exports:**
- **types:** `./dist/index.d.ts`
- **import:** `./dist/index.js`
- **require:** `./dist/index.cjs`

**Files in dist:**
- `index.cjs` - CommonJS bundle
- `index.d.cts` - CommonJS type definitions
- `index.d.ts` - ESM type definitions
- `index.js` - ESM bundle

---

## @tembok/tailwind-preset

**Version:** 0.0.1

**Exports:**
- **types:** `./dist/index.d.ts`
- **import:** `./dist/index.js`
- **require:** `./dist/index.cjs`

**Files in dist:**
- `index.cjs` - CommonJS bundle
- `index.d.cts` - CommonJS type definitions
- `index.d.ts` - ESM type definitions
- `index.js` - ESM bundle

---

## @tembok/tokens

**Version:** 0.0.1

**Exports:**
- **types:** `./dist/index.d.ts`
- **import:** `./dist/index.js`
- **require:** `./dist/index.cjs`

**Files in dist:**
- `index.cjs` - CommonJS bundle
- `index.d.cts` - CommonJS type definitions
- `index.d.ts` - ESM type definitions
- `index.js` - ESM bundle

---

## @tembok/ui-astro

**Version:** 0.0.1

**Exports:**
- **types:** `./src/index.ts`
- **import:** `./src/index.ts`
- **require:** `./src/index.ts`

**Files in dist:**
- N/A - This package publishes source files directly (no build step)

**Note:** Astro components are distributed as source files for optimal integration with Astro's build system.

---

## @tembok/ui-react

**Version:** 0.0.1

**Exports:**
- **types:** `./dist/index.d.ts`
- **import:** `./dist/index.js`
- **require:** `./dist/index.cjs`

**Files in dist:**
- `index.cjs` - CommonJS bundle
- `index.d.cts` - CommonJS type definitions
- `index.d.ts` - ESM type definitions
- `index.js` - ESM bundle

---

## Summary

- **4 packages** built with tsup (dual ESM/CJS format)
- **1 package** (@tembok/ui-astro) published as source
- All built packages follow the same export pattern with full CommonJS and ESM support
- All packages include TypeScript definitions
