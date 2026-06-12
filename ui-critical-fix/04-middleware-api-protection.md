# Phase 4: Middleware API Route Protection

**Priority:** 🟡 MEDIUM
**File:** `middleware.ts`
**Risk:** API routes are not covered by middleware — defense-in-depth is weak.

## Problem
The middleware matcher only covers page routes:
```ts
matcher: ["/checkout", "/success", "/account/:path*", "/admin/:path*"]
```
API routes like `/api/chat` are unprotected by middleware. While Phase 2 adds server-side auth, adding middleware coverage provides defense-in-depth and ensures consistent redirect behavior.

## Fix
Add API patterns to the middleware matcher. Note that the middleware currently checks roles via the JWT token, so we need to handle API routes differently (return 401 JSON instead of redirecting to login).

## Steps
1. Read `middleware.ts`
2. Add `"/api/:path*"` to the matcher
3. In the `authorized` callback, check if the request is to `/api/` and return a 401-style response instead of redirecting
4. Build and verify

## Alternative (simpler)
Skip this phase if Phase 2 is implemented — each API route does its own auth check, which is the standard Next.js pattern. Many apps intentionally exclude API routes from middleware since they handle auth themselves.
