# Phase 5: Remove Dead CSS

**Priority:** 🔵 LOW
**File:** `app/globals.css`
**Risk:** None — dead code only, adds ~500 bytes to CSS bundle.

## Problem
The `.reveal`, `.reveal.visible`, and `.reveal-delay-1` through `.reveal-delay-8` classes are no longer used since switching to `animate-fade-up` CSS animations.

## Steps
1. Read `app/globals.css`
2. Remove lines 35-53:
   ```css
   .reveal {
     opacity: 0;
     transform: translateY(24px);
     ...
   }
   .reveal.visible { ... }
   .reveal-delay-1 { ... }
   ...
   .reveal-delay-8 { ... }
   ```
3. Also consider removing `.glow-border` (lines 69-86) if it's not used anywhere
4. Build and verify

## Verification
- Grep for `reveal` in all source files → should return 0 results
- Build should pass with no errors
