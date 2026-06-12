# Light Mode Toggle & Page Load Entry Animations

**Date:** 2026-06-12
**Project:** SHOOOS – Premium Sneakers Store

## Overview

Add two features to the existing Next.js app: a light/dark theme toggle and staggered slide-in entry animations on page load.

---

## 1. Theme System — Warm & Luxe Light Mode

### Approach

Use CSS custom properties for all color tokens. The `:root` (no `dark` class) holds light mode values; `.dark` overrides with the current dark palette. Tailwind config references these variables. This requires **zero changes to existing component code** — every `bg-surface`, `text-ink`, etc. just works in both modes.

### Tailwind Config Changes

- Add `darkMode: "class"` to enable class-based dark mode
- Replace hardcoded color values with CSS variable references
- Add `slide-left` keyframe for alternating entry animations

### Color Palette

| Token         | Light (`:root`) | Dark (`.dark` — unchanged) |
|---------------|----------------|---------------------------|
| `--color-surface`     | `#faf6f0` (cream) | `#0a0a0a` |
| `--color-surface-50`  | `#f5efe6` | `#1a1a1a` |
| `--color-surface-100` | `#ede4d6` | `#222222` |
| `--color-surface-200` | `#e0d5c2` | `#2a2a2a` |
| `--color-ink`         | `#1a1a1a` | `#f5f5f5` |
| `--color-ink-muted`   | `#6b7280` | `#a3a3a3` |
| `--color-ink-dim`     | `#9ca3af` | `#6b7280` |
| `--color-scrollbar`   | `#d4c9b8` | `#2a2a2a` |
| Accent colors         | Unchanged in both modes | |

### ThemeProvider Component

New client component that:
- Wraps the app in a React context providing `theme` and `toggleTheme`
- On mount: checks `localStorage` for saved preference, falls back to `prefers-color-scheme`
- Toggles `dark` class on `<html>` element
- Persists preference to `localStorage`
- Adds `transition-colors duration-300` to `<body>` for smooth switching

### Theme Toggle (Navbar)

Sun/moon icon button in the navbar, placed before the cart button. Uses `theme` and `toggleTheme` from context.

### Files Changed

- `tailwind.config.ts` — `darkMode: "class"`, CSS var references, `slide-left` keyframe
- `app/globals.css` — CSS custom properties, transition, scrollbar colors
- `app/layout.tsx` — wrap with ThemeProvider, remove hardcoded `dark`
- `components/ThemeProvider.tsx` — **new**
- `components/Navbar.tsx` — add theme toggle button

---

## 2. Page Load Entry Animations

### Behavior

On every page navigation, main content sections slide in from alternating sides with staggered delays. The animation plays once per page load (not on scroll).

### Keyframes

New `slide-left` keyframe:
```
0%: opacity 0, translateX -20px
100%: opacity 1, translateX 0
```

Existing `slide-right` is reused for the right-to-left direction.

### Stagger Timing

| Element group | Direction | Delay |
|--------------|-----------|-------|
| Hero / page title | slide-right | 0ms |
| First content row | slide-left | 100ms |
| Second content row | slide-right | 200ms |
| Third content row | slide-left | 300ms |
| (continues alternating) | | +100ms each |

### Hook: `usePageLoadAnimation`

A new hook that:
- Uses `usePathname()` to detect page changes
- On mount/path change, sets up staggered animation classes on elements
- Uses CSS classes `animate-slide-right` and `animate-slide-left` (to be added)
- Each element's animation class and delay is configured via a `data-animate` attribute
- Animation plays once, then elements stay visible

### Application

- Applied to the **homepage** (hero, featured products section)
- Applied to **all other pages** (page title, content sections)
- Used via a `AnimateOnLoad` wrapper component that children opt into with `data-animate` attributes
- Only the `main` content area animates (navbar and persistent UI do not)

### Files Created/Changed

- `app/globals.css` — add `.animate-slide-left` utility
- `tailwind.config.ts` — add `slide-left` keyframe and animation
- `lib/usePageLoadAnimation.ts` — **new** hook
- `components/AnimateOnLoad.tsx` — **new** wrapper component
- `app/layout.tsx` — apply `AnimateOnLoad` to `<main>`
- `app/page.tsx` — add `data-animate` attributes to sections

---

## Files Summary

### New Files
1. `components/ThemeProvider.tsx` — Theme context, toggle, persistence
2. `lib/usePageLoadAnimation.ts` — Page-load stagger animation hook
3. `components/AnimateOnLoad.tsx` — Wrapper that wires up data-animate children

### Modified Files
1. `tailwind.config.ts` — `darkMode`, CSS variables, slide-left keyframe
2. `app/globals.css` — CSS custom properties, transitions, slide-left utility
3. `app/layout.tsx` — ThemeProvider wrapper, AnimateOnLoad, remove hardcoded dark
4. `components/Navbar.tsx` — Theme toggle button (sun/moon icon)
5. `app/page.tsx` — `data-animate` attributes on sections

---

## Future Considerations (Out of Scope)

- System preference change listener (respects `prefers-color-scheme` only on first visit)
- Per-page animation toggle
- Reduced motion media query support (`prefers-reduced-motion`)
