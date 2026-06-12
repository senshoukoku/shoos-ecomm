# Light Mode Toggle & Page Load Entry Animations — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a light/dark theme toggle and staggered slide-in entry animations on page load.

**Architecture:** CSS custom properties for color tokens so all existing `bg-surface`/`text-ink` classes work across themes. Toggle `dark` class on `<html>` via a React context provider. Entry animations use the existing `slide-right` keyframe plus a new `slide-left` keyframe, applied via a lightweight hook.

**Tech Stack:** Next.js 14 App Router, React 18, Tailwind CSS 3.4

---

### Task 1: Configure Tailwind for Dark Mode & CSS Variable Colors

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Add `darkMode`, update colors to CSS variables, add `slide-left` keyframe**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: "var(--color-surface)",
          50: "var(--color-surface-50)",
          100: "var(--color-surface-100)",
          200: "var(--color-surface-200)",
        },
        accent: {
          DEFAULT: "#f59e0b",
          light: "#fbbf24",
          dark: "#d97706",
        },
        ink: {
          DEFAULT: "var(--color-ink)",
          muted: "var(--color-ink-muted)",
          dim: "var(--color-ink-dim)",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(245, 158, 11, 0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(245, 158, 11, 0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "scale-in": "scale-in 0.4s ease-out forwards",
        "slide-right": "slide-right 0.5s ease-out forwards",
        "slide-left": "slide-left 0.5s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 2: Verify no syntax errors**

Run: `npx tsc --noEmit`
Expected: No errors (or only pre-existing errors unrelated to tailwind.config.ts)

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: configure tailwind for dark mode, CSS variable colors, slide-left keyframe"
```

---

### Task 2: Define CSS Custom Properties for Light & Dark Themes

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace globals.css with theme variables, smooth transition, and slide-left utility**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-surface: #faf6f0;
    --color-surface-50: #f5efe6;
    --color-surface-100: #ede4d6;
    --color-surface-200: #e0d5c2;
    --color-ink: #1a1a1a;
    --color-ink-muted: #6b7280;
    --color-ink-dim: #9ca3af;
  }

  .dark {
    --color-surface: #0a0a0a;
    --color-surface-50: #1a1a1a;
    --color-surface-100: #222222;
    --color-surface-200: #2a2a2a;
    --color-ink: #f5f5f5;
    --color-ink-muted: #a3a3a3;
    --color-ink-dim: #6b7280;
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: var(--color-surface-200) transparent;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: var(--color-surface-200);
    border-radius: 3px;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    transition: background-color 0.3s ease, color 0.3s ease;
  }
}

@layer utilities {
  .text-gradient {
    background: linear-gradient(135deg, #f59e0b, #fbbf24, #f59e0b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .text-gradient-white {
    background: linear-gradient(135deg, #ffffff 0%, #a3a3a3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build` (or `npm run build`)
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add CSS custom properties for light/dark themes with smooth transition"
```

---

### Task 3: Create ThemeProvider Component

**Files:**
- Create: `components/ThemeProvider.tsx`

- [ ] **Step 1: Create ThemeProvider with context, toggle, and localStorage persistence**

```tsx
"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"

type Theme = "light" | "dark"

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null
    if (stored === "light" || stored === "dark") {
      setTheme(stored)
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(prefersDark ? "dark" : "light")
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem("theme", theme)
  }, [theme, mounted])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add components/ThemeProvider.tsx
git commit -m "feat: add ThemeProvider with context, toggle, and localStorage persistence"
```

---

### Task 4: Update Root Layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Wrap with ThemeProvider, remove hardcoded `dark` class, add ThemeToggle import**

```tsx
import type { Metadata } from "next"
import { Anton, Sora } from "next/font/google"
import "./globals.css"
import SessionProvider from "@/components/SessionProvider"
import ThemeProvider from "@/components/ThemeProvider"
import Navbar from "@/components/Navbar"
import CartDrawer from "@/components/cart/CartDrawer"
import ChatBubble from "@/components/chat/ChatBubble"
import ToastContainer from "@/components/ui/Toast"

const heading = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
  display: "swap",
})

const body = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SHOOOS – Premium Sneakers",
  description: "Your destination for premium sneakers.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${heading.variable} ${body.variable} font-body antialiased bg-surface text-ink`}
      >
        <svg className="fixed inset-0 pointer-events-none z-0 w-full h-full opacity-[0.015]"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="grainFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter="url(#grainFilter)" />
        </svg>
        <ThemeProvider>
          <SessionProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <CartDrawer />
            <ChatBubble />
            <ToastContainer />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

Changes from current:
1. Added `import ThemeProvider from "@/components/ThemeProvider"`
2. Changed `<html lang="en" className="dark">` to `<html lang="en" suppressHydrationWarning>`
3. Wrapped content in `<ThemeProvider>`

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: integrate ThemeProvider into root layout, remove hardcoded dark class"
```

---

### Task 5: Add Theme Toggle to Navbar

**Files:**
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Add theme toggle button (sun/moon icon) to the navbar**

Add import:
```tsx
import { useTheme } from "@/components/ThemeProvider"
```

Add inside the component, before `useState`:
```tsx
const { theme, toggleTheme } = useTheme()
```

Add the toggle button in the desktop nav section (after the Sign Out button and before the cart button):

```tsx
          <button
            onClick={toggleTheme}
            className="p-2 text-ink-muted hover:text-ink transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>
```

Also add the toggle button in the mobile menu, before the Sign Out button:

```tsx
              <button onClick={() => { toggleTheme(); setMenuOpen(false) }} className="block py-2 text-sm font-medium text-ink-muted hover:text-ink transition-colors">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat: add theme toggle button (sun/moon) to navbar"
```

---

### Task 6: Create Page Load Animation Hook

**Files:**
- Create: `lib/usePageLoadAnimation.ts`

- [ ] **Step 1: Create the stagger animation hook**

```tsx
"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function usePageLoadAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets = el.querySelectorAll<HTMLElement>("[data-animate]")
    const directions = ["slide-right", "slide-left"]

    targets.forEach((target, i) => {
      const direction = directions[i % 2]
      const delay = i * 100
      target.classList.add(`animate-${direction}`)
      target.style.animationDelay = `${delay}ms`
      target.style.opacity = "1"
    })

    return () => {
      targets.forEach((target) => {
        target.classList.remove("animate-slide-right", "animate-slide-left")
        target.style.animationDelay = ""
      })
    }
  }, [pathname])

  return ref
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add lib/usePageLoadAnimation.ts
git commit -m "feat: add usePageLoadAnimation hook for staggered slide-in animations"
```

---

### Task 7: Create AnimateOnLoad Wrapper Component

**Files:**
- Create: `components/AnimateOnLoad.tsx`

- [ ] **Step 1: Create the wrapper component**

```tsx
"use client"

import { usePageLoadAnimation } from "@/lib/usePageLoadAnimation"

export default function AnimateOnLoad({ children }: { children: React.ReactNode }) {
  const ref = usePageLoadAnimation()

  return (
    <div ref={ref}>
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/AnimateOnLoad.tsx
git commit -m "feat: add AnimateOnLoad wrapper component for page entry animations"
```

---

### Task 8: Apply Animations to Layout & Homepage

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Wrap `<main>` with AnimateOnLoad in the layout**

In `app/layout.tsx`, add import:
```tsx
import AnimateOnLoad from "@/components/AnimateOnLoad"
```

Wrap the main element:
```tsx
            <AnimateOnLoad>
              <main className="min-h-screen">{children}</main>
            </AnimateOnLoad>
```

- [ ] **Step 2: Add `data-animate` attributes to homepage sections**

In `app/page.tsx`, replace the existing `animate-fade-up` / `animate-fade-in` classes on the hero section with `data-animate` attributes. Each `data-animate` element will get the alternating slide animation.

Update the section wrappers (the top-level divs in the return). The key sections to animate:

1. `<section className="relative min-h-[85vh]...">` — add `data-animate` to the inner content div
2. `<section className="relative mx-auto max-w-7xl...">` — add `data-animate` to the content

```tsx
  return (
    <div>
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-50 to-surface" />
        <div className="absolute inset-0 opacity-30" style={{
          background: "radial-gradient(circle at 20% 50%, rgba(245,158,11,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(251,191,36,0.1) 0%, transparent 50%)"
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        <div data-animate className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <p className="font-heading text-sm tracking-[0.3em] text-accent">PREMIUM SNEAKERS</p>
          <h1 className="mt-6 font-heading text-7xl sm:text-8xl lg:text-9xl leading-none text-ink">
            STEP INTO
            <br />
            <span className="text-gradient">STYLE</span>
          </h1>
          <p className="mt-6 font-body text-lg text-ink-muted max-w-xl mx-auto leading-relaxed">
            Discover the freshest kicks from the biggest brands. Your next pair is one click away.
          </p>
          <div className="mt-10">
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 rounded-full bg-accent px-10 py-4 font-heading text-sm tracking-widest text-surface hover:bg-accent-dark transition-all duration-300 hover:scale-105"
            >
              SHOP NOW
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section data-animate className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        ...
      </section>
    </div>
  )
```

Key changes from current page.tsx:
1. Added `data-animate` to the hero content div
2. Removed `animate-fade-in`, `animate-fade-up` classes from individual hero children
3. Removed inline `animationDelay`/`animationFillMode` styles from hero children
4. Added `data-animate` to the featured products section

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/page.tsx
git commit -m "feat: apply AnimateOnLoad wrapper and data-animate attributes to homepage"
```
